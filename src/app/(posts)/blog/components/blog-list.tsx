"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { CollapsibleCategory } from "./collapsible-category"
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

export function BlogList({ blogs }: { blogs: BlogPost[] }) {
  const [query, setQuery] = useState("")

  const filteredBlogs = blogs.filter((blog) => {
    const searchLower = query.toLowerCase()
    const titleMatch = blog.frontmatter.title.toLowerCase().includes(searchLower)
    const tagMatch = (blog.frontmatter.tag || "Randoms").toLowerCase().includes(searchLower)
    return titleMatch || tagMatch
  })

  // Group blogs by category when not searching
  const groupedBlogs = filteredBlogs.reduce<Record<string, BlogPost[]>>((acc, blog) => {
    const tag = blog.frontmatter.tag || "Randoms"
    if (!acc[tag]) {
      acc[tag] = []
    }
    acc[tag].push(blog)
    return acc
  }, {})

  const sortedCategories = Object.keys(groupedBlogs).sort()

  return (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by name or type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border/50 bg-card rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors hover:border-border"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground font-serif italic border border-border/50 rounded-lg p-8 bg-card">
          No writings found for &quot;{query}&quot;.
        </div>
      ) : (
        <div className="space-y-6">
          {query ? (
            <div className="mb-8">
              <h3 className="mb-4 text-muted-foreground font-sans text-sm tracking-wide uppercase">
                Search Results ({filteredBlogs.length})
              </h3>
              <div className="space-y-6">
                {filteredBlogs.map((item) => (
                  <div key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group block hover:bg-muted/30 -mx-4 px-4 py-2 rounded-sm transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                        <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0 w-24 pt-1">
                          {formatDate(parseDate(item.frontmatter.publishDate))}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg font-serif text-primary group-hover:underline underline-offset-4 decoration-muted-foreground/50 group-hover:decoration-primary leading-snug">
                            {item.frontmatter.title}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono mt-1">
                            #{item.frontmatter.tag || "Randoms"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            sortedCategories.map((tag) => (
              <CollapsibleCategory key={tag} title={tag} items={groupedBlogs[tag]} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
