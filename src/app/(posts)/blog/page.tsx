import { getBlogs } from "@/utils/fetch-mdx";
import Link from "next/link";
import React from "react";

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    publishDate: string;
    tag?: string;
  };
}

interface GroupedBlogs {
  [key: string]: BlogPost[];
}

async function Page() {
  const blogs = await getBlogs();
  
  // Group blogs by tag
  const groupedBlogs = blogs.reduce<GroupedBlogs>((acc, blog) => {
    const tag = blog.frontmatter.tag || 'Randoms';
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(blog);
    return acc;
  }, {});

  return (
    <div>
      <div>
        <h3>Posts</h3>
        <p className="text-gray-500">{`${blogs.length} ${
          blogs.length === 1 ? "post published" : "posts published"
        }`}</p>
      </div>
      <hr className="my-8 border-none" />
      <div>
        {Object.entries(groupedBlogs).map(([tag, items]) => (
          <div key={tag} className="mb-8">
            <h4 className="text-xl font-semibold mb-4 text-gray-500">{tag}</h4>
            {items.map((item) => (
              <Link href={`/blog/${item.slug}`} key={item.slug}>
                <div className="border-b py-5 hover:scale-[1.02] ease-in-out duration-500">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h5>{item.frontmatter.title}</h5>
                  </div>
                  <p className="text-gray-500">
                    {item.frontmatter.publishDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;