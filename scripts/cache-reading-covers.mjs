import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIRECTORY = path.join(ROOT, "public/images/books");
const reading = JSON.parse(
  await fs.readFile(path.join(ROOT, "src/data/reading.json"), "utf8"),
);

function coverId(cover) {
  const url = new URL(cover);
  if (url.hostname !== "covers.openlibrary.org") {
    throw new Error(`Unsupported book-cover host: ${url.hostname}`);
  }

  const match = url.pathname.match(/\/isbn\/([^/]+)-L\.jpg$/);
  if (!match) throw new Error(`Could not identify book cover: ${cover}`);
  return match[1];
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function cacheCover(book) {
  const id = coverId(book.cover);
  const destination = path.join(OUTPUT_DIRECTORY, `${id}.webp`);
  if (await exists(destination)) return "cached";

  const response = await fetch(book.cover, {
    headers: { "user-agent": "blackprince-reading-list/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} while fetching the cover for ${book.title}`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  const optimized = await sharp(source)
    .rotate()
    .resize({ width: 360, height: 540, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
  await fs.writeFile(destination, optimized);
  return "downloaded";
}

await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });

let downloaded = 0;
for (let index = 0; index < reading.books.length; index += 6) {
  const batch = reading.books.slice(index, index + 6);
  const results = await Promise.all(batch.map(cacheCover));
  downloaded += results.filter((result) => result === "downloaded").length;
}

console.log(
  `Reading covers ready: ${reading.books.length} total, ${downloaded} downloaded, ${reading.books.length - downloaded} already cached`,
);
