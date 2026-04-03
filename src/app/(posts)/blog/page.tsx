import { getBlogs } from "@/utils/fetch-mdx"
import { BlogList } from "./components/blog-list"

async function Page() {
  const blogs = await getBlogs()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="mb-4">Writing</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, tutorials, and notes on engineering and design.
        </p>
      </div>

      <BlogList blogs={blogs} />
    </div>
  )
}

export default Page
