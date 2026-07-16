import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const dist = join(root, "dist");
const failures = [];
const titles = new Map();

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
  const h1Count = html.match(/<h1(?:\s|>)/gi)?.length ?? 0;
  const mainCount = html.match(/<main(?:\s|>)/gi)?.length ?? 0;
  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const videoTags = html.match(/<video\b[^>]*>/gi) ?? [];

  if (!title) failures.push(`${route} has no document title`);
  else if (titles.has(title)) failures.push(`${route} duplicates the title used by ${titles.get(title)}`);
  else titles.set(title, route);
  if (!description) failures.push(`${route} has no meta description`);
  if (!canonical?.startsWith("https://blackprince001.github.io/")) failures.push(`${route} has no production canonical URL`);
  if (h1Count !== 1) failures.push(`${route} has ${h1Count} H1 elements`);
  if (mainCount !== 1) failures.push(`${route} has ${mainCount} main landmarks`);
  if (imageTags.some((tag) => !/\balt="[^"]*"/i.test(tag))) failures.push(`${route} has an image without an alt attribute`);
  if (videoTags.some((tag) => /\bautoplay\b/i.test(tag))) failures.push(`${route} has an autoplaying video`);
  if (videoTags.some((tag) => !/\bposter="[^"]+"/i.test(tag))) failures.push(`${route} has a video without a poster`);
  if (videoTags.some((tag) => !/\bpreload="none"/i.test(tag))) failures.push(`${route} has a video that is not deferred`);
  if (route === "/404.html" && !/<meta\s+name="robots"\s+content="noindex, nofollow"/i.test(html)) failures.push("/404.html must be noindex");

  for (const value of references(html)) {
    if (!value || !isLocalReference(value)) continue;
    const url = new URL(value.replaceAll("&amp;", "&"), `https://site.test${route}`);
    const target = await localTarget(url.pathname);
    if (!target) failures.push(`${route} -> ${value}`);
  }
}

for (const route of ["index.html", "blog/index.html", "projects/index.html", "projects/oware/index.html", "projects/floodit/index.html", "publications/index.html", "reading/index.html", "shorts/index.html"]) {
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

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Site audit passed: ${htmlFiles.length} HTML pages, all local references and metadata, ${builtPublications.length} publications, ${rssItems} RSS items, and ${scriptFiles.length + styleFiles.length} budgeted assets.`,
);
