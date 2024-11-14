import { getBlogs } from "@/utils/fetch-mdx";
import Link from "next/link";

async function BlogPosts() {
  const blogs = await getBlogs();
  const recentBlogs = blogs.slice(0, 10);

  return (
    <div className="mb-16">
      <div className="flex flex-row justify-between items-center gap-5">
        <div>
          <div className="flex items-center gap-3 text-gray-500">
            <h3>Recent Posts</h3>
          </div>
        </div>
        <Link
          href={"/blog"}
          className="text-gray-500 underline hover:text-black ease-in-out duration-500"
        >
          <h5>View Posts</h5>
        </Link>
      </div>
      
      <br />

      <div>
        {recentBlogs.map((item) => {
          return (
            <div
              key={item.slug}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <Link href={`/blog/${item.slug}`} className="hover:underline">
                <ul>{item.frontmatter.title}</ul>
              </Link>
              <p className="text-gray-500">{item.frontmatter.tag} - {item.frontmatter.publishDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogPosts;
