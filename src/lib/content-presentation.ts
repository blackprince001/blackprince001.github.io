export interface ArticleDiscoveryLink {
  href: string;
  label: string;
  title: string;
}

export function estimateReadingTime(source: string, wordsPerMinute = 225) {
  const prose = source
    .replace(/---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}'’-]+/gu, " ")
    .trim();
  const words = prose ? prose.split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`;
}

export function slugifyTag(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tag";
}
