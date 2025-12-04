import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { getShortBySlug, getShorts } from "@/utils/fetch-mdx"
import { parseDate, formatDate } from "@/utils/date"
import { Button } from "@/components/ui/button"
import Comments from "@/app/(main)/components/comments"
import styles from "@/app/md.module.css"
import { cn } from "@/lib/utils"
import ImageLightbox from "@/components/ui/image-lightbox"

interface ShortPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const shorts = await getShorts()
  return shorts.map((short) => ({ slug: short.slug }))
}

async function resolveShort(slugParam: string) {
  const slug = decodeURIComponent(slugParam)
  try
  {
    return await getShortBySlug(slug)
  } catch (error)
  {
    return null
  }
}

export async function generateMetadata({ params }: ShortPageProps): Promise<Metadata> {
  const short = await resolveShort(params.slug)

  if (!short)
  {
    return {
      title: "Short not found | blackprince",
    }
  }

  const title = `${short.frontmatter.title} | Shorts by blackprince`
  const description =
    short.frontmatter.summary ?? `Quick note published on ${formatDate(parseDate(short.frontmatter.publishedAt))}`
  const canonicalSlug = encodeURIComponent(short.slug)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://blackprince.tech/shorts/${canonicalSlug}`,
      type: "article",
      tags: short.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ShortPage({ params }: ShortPageProps) {
  const short = await resolveShort(params.slug)

  if (!short)
  {
    notFound()
  }

  const { frontmatter, content } = short
  const formattedDate = formatDate(parseDate(frontmatter.publishedAt))

  return (
    <main className="w-full py-16">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/shorts">← Back to all shorts</Link>
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {formattedDate}
          </span>
        </div>

        <header className="space-y-4">
          <h1>
            {frontmatter.title}
          </h1>
          {frontmatter.summary && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {frontmatter.summary}
            </p>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <section
          className={cn(
            styles.blogContent,
            "prose prose-lg prose-gray dark:prose-invert max-w-none"
          )}
        >
          <ImageLightbox>
            {content}
          </ImageLightbox>
        </section>

        {frontmatter.ctaHref && (
          <div className="flex justify-end">
            <Button asChild variant="outline">
              <Link
                href={frontmatter.ctaHref}
                target={frontmatter.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={frontmatter.ctaHref.startsWith("http") ? "noreferrer" : undefined}
              >
                {frontmatter.ctaLabel ?? "Explore"}
              </Link>
            </Button>
          </div>
        )}

        <section className="pt-10 border-t border-border/60">
          <h2 className="mb-4">Comments</h2>
          <Comments />
        </section>
      </article>
    </main>
  )
}


