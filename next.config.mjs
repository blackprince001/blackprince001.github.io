import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/public",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};


const withMDX = createMDX({
  options: {
   
  },
})
 
// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig)
