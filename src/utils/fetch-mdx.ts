import fs from "fs";
import path from "path";

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from "rehype-highlight";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXRemoteProps } from "next-mdx-remote/rsc";
import MeshRenderSwitch from "@/components/graphics/render";
import ImageGrid from "@/components/ui/image-grid";
import {HelloFx, InequalitiesExample, Sigmoid } from "@/components/maths/graphing";
import BlogSuggestion from "@/components/ui/blog-suggested";
import Sidenote, { AutoNumberedSidenote } from "@/components/ui/sidenotes";

const contentDir = path.join(process.cwd(), "/src/content/");

// Create a custom type that extends MDXRemoteProps
type CustomMDXRemoteProps = Omit<MDXRemoteProps, 'options'> & {
  options?: MDXRemoteProps['options'] & {
    mdxOptions?: {
      remarkPlugins?: any[];
      rehypePlugins?: any[];
    };
  };
};

const customComponents = {ImageGrid, BlogSuggestion, MeshRenderSwitch, HelloFx, InequalitiesExample, Sigmoid, Sidenote, AutoNumberedSidenote};

export async function getBlogBySlug(slug: string) {
  const fileName = slug + ".mdx";
  const filePath = path.join(contentDir, fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  
  // Use the custom type here
  const { frontmatter, content } = await compileMDX<{
    tag: string;
    title: string;
    publishDate: string;
  }>({
    source: fileContent,
    options: { 
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex, rehypeHighlight],
      }
    },
    components: customComponents,
  } as CustomMDXRemoteProps);

  return {
    frontmatter,
    content,
    slug: path.parse(fileName).name,
  };
}

export async function getBlogs() {
  const files = fs.readdirSync(contentDir);
  const blogs = await Promise.all(
    files.map(async (file) => await getBlogBySlug(path.parse(file).name))
  );
  return blogs;
}

export function getAllBlogSlug() {
  const files = fs.readdirSync(contentDir);
  const slugs = files.map((file) => ({ slug: path.parse(file).name }));
  return slugs;
}
