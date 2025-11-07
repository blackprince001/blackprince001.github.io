import type { Metadata } from "next"

import { getShorts } from "@/utils/fetch-mdx"
import { ShortsContent } from "../../shorts-content"

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  const shorts = await getShorts()
  const tags = new Set(shorts.flatMap((item) => item.frontmatter.tags ?? []))

  return Array.from(tags).map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag)

  return {
    title: `${decodedTag} shorts | blackprince`,
    description: `Short-form updates filtered by ${decodedTag} from blackprince.`,
    openGraph: {
      title: `${decodedTag} shorts | blackprince`,
      description: `Short-form updates filtered by ${decodedTag} from blackprince.`,
      url: `https://blackprince.tech/shorts/tag/${encodeURIComponent(decodedTag)}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} shorts | blackprince`,
      description: `Short-form updates filtered by ${decodedTag} from blackprince.`,
    },
  }
}

export default async function TagShortsPage({ params }: TagPageProps) {
  const shorts = await getShorts()
  const availableTags = Array.from(
    new Set(shorts.flatMap((item) => item.frontmatter.tags ?? []))
  ).sort((a, b) => a.localeCompare(b))

  const decodedTag = decodeURIComponent(params.tag)

  return <ShortsContent shorts={shorts} availableTags={availableTags} activeTag={decodedTag} />
}


