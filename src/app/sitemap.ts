import { MetadataRoute } from 'next'
import { getBlogs } from "@/utils/fetch-mdx"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blackprince001.github.io'

  // Get all blog posts
  const blogs = await getBlogs()
  const blogUrls = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Static routes
  const routes = [
    '',
    '/blog',
    '/shorts',
    '/projects',
    '/publications',
    '/resume',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes, ...blogUrls]
}
