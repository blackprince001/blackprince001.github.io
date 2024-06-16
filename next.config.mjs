import createMDX from '@next/mdx'
 
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
    remarkPlugins: [require('remark-math')],
    rehypePlugins: [require('rehype-katex'), require('rehype-highlight')],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
})
 
export default withMDX(nextConfig)
