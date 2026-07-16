import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";

const root = process.cwd();
const dist = join(root, "dist");
const failures = [];

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

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const route = publicRoute(file);

  for (const value of references(html)) {
    if (!value || !isLocalReference(value)) continue;
    const url = new URL(value.replaceAll("&amp;", "&"), `https://site.test${route}`);
    const target = await localTarget(url.pathname);
    if (!target) failures.push(`${route} -> ${value}`);
  }
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
  `Site audit passed: ${htmlFiles.length} HTML pages, all local references, ${builtPublications.length} publications, and ${rssItems} RSS items.`,
);
