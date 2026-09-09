import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { gzipSync } from "node:zlib";
import sharp from "sharp";

const root = process.cwd();
const dist = join(root, "dist");
const failures = [];
const titles = new Map();
const socialImageMetadata = new Map();

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : path;
    }),
  );
  return files.flat();
}

function publicRoute(file) {
  const path = `/${relative(dist, file).split(sep).join("/")}`;
  if (path === "/index.html") return "/";
  return path.endsWith("/index.html") ? path.slice(0, -"index.html".length) : path;
}

function decodePathname(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

async function localTarget(pathname) {
  const clean = decodePathname(pathname).replace(/^\/+/, "");
  const candidate = resolve(dist, clean);
  if (!candidate.startsWith(`${dist}${sep}`) && candidate !== dist) return null;

  const options = extname(candidate)
    ? [candidate]
    : [candidate, `${candidate}.html`, join(candidate, "index.html")];

  for (const option of options) {
    try {
      if ((await stat(option)).isFile()) return option;
    } catch {
      // Try the next static-output form.
    }
  }
  return null;
}

function references(html) {
  const values = [];
  const singleValue = /\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi;
  const sourceSet = /\bsrcset\s*=\s*(["'])(.*?)\1/gi;
  let match;

  while ((match = singleValue.exec(html))) values.push(match[2]);
  while ((match = sourceSet.exec(html))) {
    for (const item of match[2].split(",")) {
      const value = item.trim().split(/\s+/)[0];
      if (value) values.push(value);
    }
  }
  return values;
}

function isLocalReference(value) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value);
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const scriptFiles = files.filter((file) => file.endsWith(".js"));
const styleFiles = files.filter((file) => file.endsWith(".css"));

for (const file of scriptFiles) {
  const source = await readFile(file);
  if (source.byteLength > 850 * 1024) failures.push(`${relative(dist, file)} exceeds the 850 KiB raw JavaScript chunk budget`);
  if (gzipSync(source).byteLength > 225 * 1024) failures.push(`${relative(dist, file)} exceeds the 225 KiB gzip JavaScript chunk budget`);
}
for (const file of styleFiles) {
  const source = await readFile(file);
  if (gzipSync(source).byteLength > 20 * 1024) failures.push(`${relative(dist, file)} exceeds the 20 KiB gzip stylesheet budget`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const route = publicRoute(file);

  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]?.trim();
  const socialImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1]?.trim();
  const twitterImage = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i)?.[1]?.trim();
  const h1Count = html.match(/<h1(?:\s|>)/gi)?.length ?? 0;
  const mainCount = html.match(/<main(?:\s|>)/gi)?.length ?? 0;
  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const videoTags = html.match(/<video\b[^>]*>/gi) ?? [];
  const buttonTags = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  const linkTags = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const figureImageTags = imageTags.filter((tag) => /\bclass="[^"]*\barticle-figure__image\b/i.test(tag));
  const isArticle = /\bclass="article-shell"/i.test(html);
  const hasMonoPreload = /<link\s+rel="preload"\s+href="\/fonts\/JetBrainsMono-Regular\.woff2"/i.test(html);

  if (!title) failures.push(`${route} has no document title`);
  else if (titles.has(title)) failures.push(`${route} duplicates the title used by ${titles.get(title)}`);
  else titles.set(title, route);
  if (!description) failures.push(`${route} has no meta description`);
  if (!canonical?.startsWith("https://blackprince001.github.io/")) failures.push(`${route} has no production canonical URL`);
  if (!socialImage?.startsWith("https://blackprince001.github.io/images/og/")) {
    failures.push(`${route} has no route-aware social image`);
  } else {
    const socialImagePath = new URL(socialImage).pathname;
    const socialImageTarget = await localTarget(socialImagePath);
    if (!socialImageTarget) {
      failures.push(`${route} references a missing social image`);
    } else {
      let metadata = socialImageMetadata.get(socialImageTarget);
      if (!metadata) {
        metadata = await sharp(socialImageTarget).metadata();
        socialImageMetadata.set(socialImageTarget, metadata);
      }
      if (metadata.width !== 1200 || metadata.height !== 630) {
        failures.push(`${route} has a social image that is not 1200×630`);
      }
    }
  }
  if (twitterImage !== socialImage) failures.push(`${route} has mismatched Open Graph and Twitter images`);
  if (!/<meta\s+property="og:image:width"\s+content="1200"/i.test(html)) failures.push(`${route} has the wrong social image width metadata`);
  if (!/<meta\s+property="og:image:height"\s+content="630"/i.test(html)) failures.push(`${route} has the wrong social image height metadata`);
  if (!/<meta\s+property="og:image:alt"\s+content="[^"]+"/i.test(html)) failures.push(`${route} has no social image description`);
  if (h1Count !== 1) failures.push(`${route} has ${h1Count} H1 elements`);
  if (mainCount !== 1) failures.push(`${route} has ${mainCount} main landmarks`);
  if (!/<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1"/i.test(html)) failures.push(`${route} has an incomplete viewport declaration`);
  const hasSiteNavigation = /<nav\s+class="site-nav"\s+aria-label="Primary navigation"/i.test(html);
  if (route === "/" && !hasSiteNavigation) failures.push("/ has no primary site navigation");
  if (route !== "/" && hasSiteNavigation) failures.push(`${route} unexpectedly includes the homepage navigation rail`);
  if (route === "/reading/" && /covers\.openlibrary\.org/i.test(html)) {
    failures.push("/reading/ requests book covers from Open Library instead of the local cache");
  }
  if (!/<a\s+class="skip-link"\s+href="#main-content"/i.test(html)) failures.push(`${route} has no repeated-navigation bypass`);
  if (imageTags.some((tag) => !/\balt="[^"]*"/i.test(tag))) failures.push(`${route} has an image without an alt attribute`);
  if (buttonTags.some(([, attributes, body]) =>
    !/\baria-label="[^"]+"/i.test(attributes)
    && !body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) {
    failures.push(`${route} has a button without an accessible name`);
  }
  if (linkTags.some(([, attributes, body]) => {
    const text = body
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const imageAlt = [...body.matchAll(/<img\b[^>]*\balt="([^"]+)"/gi)]
      .map((match) => match[1])
      .join(" ");
    return !/\baria-label="[^"]+"/i.test(attributes) && !text && !imageAlt;
  })) failures.push(`${route} has a link without an accessible name`);
  if (figureImageTags.some((tag) => !/\bsrcset="[^"]+"/i.test(tag))) failures.push(`${route} has an article figure without responsive sources`);
  if (figureImageTags.some((tag) => !/\bwidth="\d+"/i.test(tag) || !/\bheight="\d+"/i.test(tag))) failures.push(`${route} has an article figure without intrinsic dimensions`);
  if (figureImageTags.some((tag) => !/\bloading="lazy"/i.test(tag))) failures.push(`${route} has an eagerly loaded article figure`);
  if (videoTags.some((tag) => /\bautoplay\b/i.test(tag))) failures.push(`${route} has an autoplaying video`);
  if (videoTags.some((tag) => !/\bposter="[^"]+"/i.test(tag))) failures.push(`${route} has a video without a poster`);
  if (videoTags.some((tag) => !/\bpreload="none"/i.test(tag))) failures.push(`${route} has a video that is not deferred`);
  if (route === "/404.html" && !/<meta\s+name="robots"\s+content="noindex, nofollow"/i.test(html)) failures.push("/404.html must be noindex");
  if (isArticle) {
    if (!/<meta\s+property="og:type"\s+content="article"/i.test(html)) failures.push(`${route} has no article Open Graph type`);
    if (!/<meta\s+property="article:published_time"\s+content="[^"]+"/i.test(html)) failures.push(`${route} has no Open Graph publish date`);
    if (!/<script\s+type="application\/ld\+json">[^<]*"@type":"Article"/i.test(html)) failures.push(`${route} has no Article structured data`);
    if (!/\bclass="article-discovery"/i.test(html)) failures.push(`${route} has no onward reading links`);
    if (!hasMonoPreload) failures.push(`${route} does not preload its code font`);
  } else if (hasMonoPreload) {
    failures.push(`${route} unnecessarily preloads the code font`);
  }

  for (const tag of figureImageTags) {
    const source = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!source) continue;
    const url = new URL(source, `https://site.test${route}`);
    const target = await localTarget(url.pathname);
    if (target && (await stat(target)).size > 500 * 1024) {
      failures.push(`${route} has an article figure fallback larger than 500 KiB`);
    }
  }

  for (const value of references(html)) {
    if (!value || !isLocalReference(value)) continue;
    const url = new URL(value.replaceAll("&amp;", "&"), `https://site.test${route}`);
    const target = await localTarget(url.pathname);
    if (!target) failures.push(`${route} -> ${value}`);
  }
}

for (const route of ["index.html", "blog/index.html", "projects/index.html", "publications/index.html", "reading/index.html", "shorts/index.html"]) {
  const html = await readFile(join(dist, route), "utf8");
  if (/\/_astro\/[A-Za-z0-9_.-]+\.js/.test(html)) failures.push(`/${route.replace(/index\.html$/, "")} unexpectedly loads framework JavaScript`);
}

const sourcePublications = JSON.parse(
  await readFile(join(root, "src/data/publications.json"), "utf8"),
);
const builtPublications = JSON.parse(
  await readFile(join(dist, "api/publications"), "utf8"),
);
if (JSON.stringify(sourcePublications) !== JSON.stringify(builtPublications)) {
  failures.push("/api/publications does not match src/data/publications.json");
}

const rss = await readFile(join(dist, "rss.xml"), "utf8");
const rssItems = rss.match(/<item>/g)?.length ?? 0;
if (rssItems === 0 || rss.includes("undefined") || rss.includes("[object Object]")) {
  failures.push("/rss.xml is empty or contains invalid serialized values");
}

const robots = await readFile(join(dist, "robots.txt"), "utf8");
if (!robots.includes("/sitemap-index.xml")) {
  failures.push("/robots.txt does not reference /sitemap-index.xml");
}
await stat(join(dist, "sitemap-index.xml"));
await stat(join(dist, "sw.js"));

for (const legacyFont of ["fonts/Inter-Regular.ttf", "fonts/Inter-Bold.ttf"]) {
  try {
    await stat(join(dist, legacyFont));
    failures.push(`${legacyFont} is an unused legacy font`);
  } catch {
    // Expected: Inter is bundled by @fontsource instead.
  }
}

for (const file of htmlFiles) {
  const relativePath = relative(dist, file).split(sep).join("/");
  if (/\s/.test(relativePath)) failures.push(`${relativePath} contains whitespace in a route`);
}

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Site audit passed: ${htmlFiles.length} HTML pages, all local references, navigation, article metadata, responsive figures, ${builtPublications.length} publications, ${rssItems} RSS items, and ${scriptFiles.length + styleFiles.length} budgeted code assets.`,
);
