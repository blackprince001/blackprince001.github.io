import { getBlogs } from "@/utils/fetch-mdx"
import { parseDate, formatDate } from "@/utils/date"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { GradientPlaceholder } from "@/components/gradient-placeholder"

async function BlogPosts() {
  const blogs = await getBlogs()
  const recentBlogs = blogs.slice(0, 6)

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Posts</h2>
        <Button asChild variant="ghost">
          <Link href="/blog" className="group">
            View all posts
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {recentBlogs.map((item) => (
          <Link key={item.slug} href={`/blog/${item.slug}`} className="group block">
            <div className="flex flex-col md:flex-row gap-6 items-start p-4 rounded-lg transition-colors hover:bg-muted/40 border border-transparent hover:border-border/50">
              {/* Image / Placeholder */}
              <div className="w-full md:w-48 aspect-video md:aspect-[4/3] relative overflow-hidden rounded-md shrink-0">
                <GradientPlaceholder seed={item.frontmatter.tag} className="w-full h-full" />

                {/* Tag overlay - visible on mobile, hidden on desktop if preferred, or kept */}
                <div className="absolute bottom-2 right-2 md:hidden">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                    {item.frontmatter.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(parseDate(item.frontmatter.publishDate))}
                    <span className="hidden md:inline-block">•</span>
                    <span className="hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                      {item.frontmatter.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {item.frontmatter.title}
                  </h3>

                  {/* Optional: Add description if available in frontmatter, or just keep it clean */}
                  {/* <p className="text-muted-foreground line-clamp-2 text-sm">
                    {item.frontmatter.description}
                  </p> */}
                </div>

                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BlogPosts
