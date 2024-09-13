import { getBlogs } from "@/utils/fetch-mdx";
import Link from "next/link";
import { CiPen } from "react-icons/ci";

async function BlogPosts() {
  const blogs = await getBlogs();
  const recentBlogs = blogs.slice(0, 10);

  return (
    <div className="mb-16">
      <div className="flex flex-row justify-between items-center gap-5">
        <div>
          <div className="flex items-center gap-3 text-[#0f4c81]">
            <CiPen />
            <h3>Recent Posts</h3>
          </div>
        </div>
        <Link
          href={"/blog"}
          className="text-[#0f4c81] underline hover:text-black ease-in-out duration-500"
        >
          <p className="text-sm">View Posts</p>
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
                <h4>{item.frontmatter.title}</h4>
              </Link>
              <p className="text-[#0f4c81]">t/{item.frontmatter.tag}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogPosts;
