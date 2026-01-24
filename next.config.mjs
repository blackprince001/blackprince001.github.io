import createMDX from '@next/mdx'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blackprince001.github.io",
  output: "export",
  // images: { unoptimized: true },
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight, rehypeRaw],
  },
})
 
export default withMDX(nextConfig)
