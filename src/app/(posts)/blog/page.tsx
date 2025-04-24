import { getBlogs } from "@/utils/fetch-mdx"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientPlaceholder } from "@/components/gradient-placeholder"

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

interface GroupedBlogs {
  [key: string]: BlogPost[]
}

async function Page() {
  const blogs = await getBlogs()

  const groupedBlogs = blogs.reduce<GroupedBlogs>((acc, blog) => {
    const tag = blog.frontmatter.tag || "Randoms"
    if (!acc[tag]) {
      acc[tag] = []
    }
    acc[tag].push(blog)
    return acc
  }, {})

  // const getItemClassName = (index: number) => {
  //   const baseClasses = "w-full transition-all duration-300 ease-in-out mb-4 lg:mb-[2%]"

  //   const position = index % 9
  //   const lgClasses =
  //     {
  //       0: "lg:w-[40%]",
  //       1: "lg:w-[30%]",
  //       2: "lg:grow",
  //       3: "lg:w-1/4",
  //       4: "lg:w-[40%]",
  //       5: "lg:grow",
  //       6: "lg:w-[40%]",
  //       7: "lg:w-[30%]",
  //       8: "lg:grow",
  //     }[position] || ""

  //   return `${baseClasses} ${lgClasses}`
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-2xl font-bold">Posts</h3>
        <p className="text-muted-foreground">{`${blogs.length} ${blogs.length === 1 ? "post published" : "posts published"
          }`}</p>
      </div>
      <hr className="my-8 border-t border-border" />
      <div className="space-y-16">
        {Object.entries(groupedBlogs).map(([tag, items]) => (
          <div key={tag}>
            <h4 className="text-xl font-semibold mb-6 text-muted-foreground">{tag}</h4>
            {/* Container that switches to flex layout on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link href={`/blog/${item.slug}`} key={item.slug} >
                  <Card className="h-full flex flex-col border border-border bg-card transition-colors hover:bg-muted/50">
                    <div className="aspect-video w-full relative overflow-hidden">
                      {/* Abstract gradient placeholder based on blog slug */}
                      <GradientPlaceholder seed={item.frontmatter.tag || ""} />

                      {/* Tag overlay */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                          {item.frontmatter.tag}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">{item.frontmatter.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        {item.frontmatter.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {item.frontmatter.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="text-muted-foreground">
                            <span className="text-foreground font-medium">Published:</span>{" "}
                            {new Date(item.frontmatter.publishDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          {item.frontmatter.readingTime && (
                            <div className="text-muted-foreground">
                              <span className="text-foreground font-medium">Read time:</span>{" "}
                              {item.frontmatter.readingTime}
                            </div>
                          )}
                          {/* <div className="text-muted-foreground">
                            <span className="text-foreground font-medium">Tag:</span>{" "}
                            {item.frontmatter.tag || "Uncategorized"}
                          </div> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page

