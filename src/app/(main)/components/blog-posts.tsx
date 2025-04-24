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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentBlogs.map((item) => (
          <Link key={item.slug} href={`/blog/${item.slug}`} className="block h-full">
            <Card className="hover:border-muted/50 h-full flex flex-col">
              <div className="aspect-video w-full relative overflow-hidden">
                {/* Abstract gradient placeholder based on blog slug */}
                <GradientPlaceholder seed={item.frontmatter.tag} />

                {/* Tag overlay */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                    {item.frontmatter.tag}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-sm">{item.frontmatter.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(parseDate(item.frontmatter.publishDate))}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BlogPosts
