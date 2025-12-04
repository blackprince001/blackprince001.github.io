import { getBlogs } from "@/utils/fetch-mdx"
import { parseDate, formatDate } from "@/utils/date"
import Link from "next/link"

async function BlogPosts() {
  const blogs = await getBlogs()
  const recentBlogs = blogs.slice(0, 6)

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-baseline border-b border-border pb-2">
        <h2>Recent Writing</h2>
        <Link href="/blog" className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          View all &rarr;
        </Link>
      </div>

      <div className="space-y-6">
        {recentBlogs.map((item) => (
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
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BlogPosts
