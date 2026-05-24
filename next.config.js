/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // images: { unoptimized: true },
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

module.exports = nextConfig;