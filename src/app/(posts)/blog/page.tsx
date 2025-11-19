import { getBlogs } from "@/utils/fetch-mdx"
import { CollapsibleCategory } from "./components/collapsible-category"

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
    if (!acc[tag])
    {
      acc[tag] = []
    }
    acc[tag].push(blog)
    return acc
  }, {})

  // Sort categories alphabetically or by some other logic if needed
  const sortedCategories = Object.keys(groupedBlogs).sort()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Writing</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, tutorials, and notes on engineering and design.
        </p>
      </div>

      <div className="space-y-2">
        {sortedCategories.map((tag) => (
          <CollapsibleCategory
            key={tag}
            title={tag}
            items={groupedBlogs[tag]}
          />
        ))}
      </div>
    </div>
  )
}

export default Page

