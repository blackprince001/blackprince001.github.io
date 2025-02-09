import { getBlogs } from "@/utils/fetch-mdx"
import { parseDate, formatDate } from "@/utils/date"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

async function BlogPosts() {
  const blogs = await getBlogs()
  const recentBlogs = blogs.slice(0, 5)

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

      <div className="grid gap-4">
        {recentBlogs.map((item) => (
          <Link key={item.slug} href={`/blog/${item.slug}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg">{item.frontmatter.title}</CardTitle>
                  <CardDescription className="text-right shrink-0">
                    {formatDate(parseDate(item.frontmatter.publishDate))}
                  </CardDescription>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/50" />
                  {item.frontmatter.tag}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BlogPosts

