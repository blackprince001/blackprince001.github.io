import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";

const site = "https://blackprince001.github.io";
const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const GET: APIRoute = async () => {
  const writingEntries = await getCollection("writing");
  const shortEntries = await getCollection("shorts");
  const writing = writingEntries.filter((entry: CollectionEntry<"writing">) => !entry.data.draft).map((entry: CollectionEntry<"writing">) => ({
    title: entry.data.title,
    description: entry.data.description ?? `A ${entry.data.tag.toLocaleLowerCase()} article.`,
    date: entry.data.publishDate,
    url: `${site}/blog/${entry.id}`,
    category: entry.data.tag,
  }));
  const shorts = shortEntries.filter((entry: CollectionEntry<"shorts">) => !entry.data.draft).map((entry: CollectionEntry<"shorts">) => ({
    title: entry.data.title,
    description: entry.data.summary ?? "A short note from blackprince.",
    date: entry.data.publishedAt,
    url: `${site}/shorts/${entry.id}`,
    category: entry.data.tags[0] ?? "Short",
  }));
  const entries = [...writing, ...shorts].sort((a, b) => b.date.valueOf() - a.date.valueOf());
  const lastBuildDate = entries[0]?.date.toUTCString() ?? new Date("2026-01-01T00:00:00Z").toUTCString();
  const items = entries.map((entry) => `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${entry.url}</link>
      <guid isPermaLink="true">${entry.url}</guid>
      <pubDate>${entry.date.toUTCString()}</pubDate>
      <category>${escapeXml(entry.category)}</category>
      <description>${escapeXml(entry.description)}</description>
    </item>`).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>blackprince — Writing</title>
    <link>${site}/</link>
    <description>Research notes, engineering essays, and short observations by Prince Kwabena Appiah Boadu.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
