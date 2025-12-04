import Link from "next/link"

import { parseDate, formatDate } from "@/utils/date"
import type { getShorts } from "@/utils/fetch-mdx"
import { cn } from "@/lib/utils"
import styles from "@/app/md.module.css"

type ShortsResult = Awaited<ReturnType<typeof getShorts>>

interface ShortsContentProps {
  shorts: ShortsResult
  availableTags: string[]
  activeTag?: string
}

export function ShortsContent({ shorts, availableTags, activeTag }: ShortsContentProps) {
  const filteredShorts = activeTag
    ? shorts.filter((item) => item.frontmatter.tags?.includes(activeTag))
    : shorts

  return (
    <main className="w-full py-16">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:px-8">
        <aside className="space-y-8">
          <header className="space-y-4">
            <span className="uppercase tracking-wide text-xs text-muted-foreground">short form</span>
            <h1>Shorts</h1>
            <p className="text-muted-foreground text-base leading-relaxed font-serif">
              Snapshots of ideas, course corrections, and mental models I want to share while they are still unfolding.
              They capture direction and intent without waiting for a full essay.
            </p>
          </header>

          {availableTags.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/shorts"
                  className={cn(
                    "text-sm hover:underline underline-offset-4",
                    !activeTag ? "font-bold text-primary" : "text-muted-foreground"
                  )}
                >
                  All
                </Link>
                {availableTags.map((tag) => {
                  const isActive = activeTag === tag
                  return (
                    <Link
                      key={tag}
                      href={isActive ? "/shorts" : `/shorts/tag/${encodeURIComponent(tag)}`}
                      className={cn(
                        "text-sm hover:underline underline-offset-4",
                        isActive ? "font-bold text-primary" : "text-muted-foreground"
                      )}
                    >
                      {tag}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        <section className="space-y-12">
          {filteredShorts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-serif italic">
              Nothing here yet. Check back soon.
            </div>
          ) : (
            filteredShorts.map((item, index) => {
              const { frontmatter, content } = item
              const formattedDate = formatDate(parseDate(frontmatter.publishedAt))

              return (
                <article key={item.slug} className="group">
                  <header className="mb-4 space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <Link href={`/shorts/${item.slug}`} className="hover:underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-primary">
                        <h2 className="text-primary">
                          {frontmatter.title}
                        </h2>
                      </Link>
                      <time dateTime={frontmatter.publishedAt} className="text-xs font-mono text-muted-foreground shrink-0">
                        {formattedDate}
                      </time>
                    </div>
                    {frontmatter.summary && (
                      <p className="text-muted-foreground font-serif italic text-lg">
                        {frontmatter.summary}
                      </p>
                    )}
                  </header>

                  <div
                    className={cn(
                      styles.blogContent,
                      "prose prose-lg max-w-none font-serif text-foreground",
                      // Minimalist prose styles
                      "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight",
                      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
                      "prose-blockquote:border-l-2 prose-blockquote:border-primary/20 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
                    )}
                  >
                    {content}
                  </div>

                  <footer className="mt-6 flex items-center justify-between">
                    <div className="flex gap-3 text-xs font-mono text-muted-foreground">
                      {frontmatter.tags?.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                    <Link
                      href={`/shorts/${item.slug}`}
                      className="text-xs font-sans uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                    >
                      Permalink
                    </Link>
                  </footer>

                  {index < filteredShorts.length - 1 && (
                    <div className="squiggly-separator opacity-30 mt-12" />
                  )}
                </article>
              )
            })
          )}
        </section>
      </div>
    </main>
  )
}


