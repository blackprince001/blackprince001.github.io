import createMDX from '@next/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blackprince001.github.io",
  output: "export",
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings, rehypeRaw],
  },
})
 
export default withMDX(nextConfig)
