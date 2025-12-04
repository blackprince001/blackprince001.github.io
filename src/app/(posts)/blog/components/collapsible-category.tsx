"use client"

import Link from "next/link"
import { parseDate, formatDate } from "@/utils/date"

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    publishDate: string
    tag?: string
    description?: string
    readingTime?: string
  }
}

interface CollapsibleCategoryProps {
  title: string
  items: BlogPost[]
}

export function CollapsibleCategory({ title, items }: CollapsibleCategoryProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 border-b border-border pb-1">
        {title} <span className="text-sm font-normal text-muted-foreground ml-2">({items.length})</span>
      </h3>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.slug}>
            <Link
              href={`/blog/${item.slug}`}
              className="group block hover:bg-muted/30 -mx-4 px-4 py-2 rounded-sm transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0 w-24 pt-1">
                  {formatDate(parseDate(item.frontmatter.publishDate))}
                </span>
                <span className="text-lg font-serif text-primary group-hover:underline underline-offset-4 decoration-muted-foreground/50 group-hover:decoration-primary leading-snug">
                  {item.frontmatter.title}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
