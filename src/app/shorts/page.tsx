import type { Metadata } from "next"

import { getShorts } from "@/utils/fetch-mdx"
import { ShortsContent } from "./shorts-content"

export const metadata: Metadata = {
  title: "Shorts | blackprince",
  description:
    "Concise notes on ideas, experiments, and philosophies that are in motion, captured before they become long-form posts.",
  openGraph: {
    title: "Shorts by blackprince",
    description: "Quick takes and working notes worth sharing before they become full essays.",
    url: "https://blackprince001.github.io/shorts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shorts by blackprince",
    description: "Quick takes and working notes worth sharing before they become full essays.",
  },
}

export default async function ShortsPage() {
  const shorts = await getShorts()

  const availableTags = Array.from(
    new Set(shorts.flatMap((item) => item.frontmatter.tags ?? []))
  ).sort((a, b) => a.localeCompare(b))
  return <ShortsContent shorts={shorts} availableTags={availableTags} />
}

