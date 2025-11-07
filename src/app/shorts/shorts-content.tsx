import Link from "next/link"

import { parseDate, formatDate } from "@/utils/date"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:px-8">
        <aside className="space-y-8">
          <header className="space-y-4">
            <span className="uppercase tracking-wide text-xs text-muted-foreground">short form</span>
            <h1 className="text-4xl font-semibold tracking-tight">Shorts</h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Snapshots of ideas, course corrections, and mental models I want to share while they are still unfolding.
              They capture direction and intent without waiting for a full essay.
            </p>
          </header>

          {availableTags.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant={!activeTag ? "default" : "outline"} size="sm">
                  <Link href="/shorts">All</Link>
                </Button>
                {availableTags.map((tag) => {
                  const isActive = activeTag === tag
                  return (
                    <Button
                      key={tag}
                      asChild
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                    >
                      <Link href={isActive ? "/shorts" : `/shorts/tag/${encodeURIComponent(tag)}`}>
                        {tag}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        <section className="space-y-6">
          {filteredShorts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nothing here yet</CardTitle>
                <CardDescription>
                  Check back soon—more short-form notes are on the way.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            filteredShorts.map((item) => {
              const { frontmatter, content } = item
              const formattedDate = formatDate(parseDate(frontmatter.publishedAt))

              return (
                <article key={item.slug}>
                  <Card className="border-border/60">
                    <CardHeader className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                          {frontmatter.title}
                        </CardTitle>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {formattedDate}
                        </span>
                      </div>
                      {frontmatter.summary && (
                        <CardDescription className="text-sm leading-relaxed">
                          {frontmatter.summary}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          styles.blogContent,
                          "prose prose-gray dark:prose-invert max-w-none text-base leading-7 text-foreground"
                        )}
                      >
                        {content}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {frontmatter.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/shorts/${item.slug}`}>Open thread</Link>
                        </Button>
                        {frontmatter.ctaHref && (
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={frontmatter.ctaHref}
                              target={frontmatter.ctaHref.startsWith("http") ? "_blank" : undefined}
                              rel={frontmatter.ctaHref.startsWith("http") ? "noreferrer" : undefined}
                            >
                              {frontmatter.ctaLabel ?? "Explore"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </article>
              )
            })
          )}
        </section>
      </div>
    </main>
  )
}


