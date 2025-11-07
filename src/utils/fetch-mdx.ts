import fs from "fs"
import path from "path"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { compileMDX } from "next-mdx-remote/rsc"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { parseDate, sortByDate } from "./date"
import MeshRenderSwitch from "@/components/graphics/render"
import ImageGrid from "@/components/ui/image-grid"
import { HelloFx, InequalitiesExample, Sigmoid } from "@/components/maths/graphing"
import BlogSuggestion from "@/components/ui/blog-suggested"
import Sidenote, { AutoNumberedSidenote } from "@/components/ui/sidenotes"
import Quiz from "@/components/quiz/quiz"
import PreviewLink from "@/components/ui/linked-previews"
import LinkEmbed from "@/components/ui/link-embed"
import RustRunner from "@/components/code-runner/rust"
import GoRunner from "@/components/code-runner/golang"
import CodeSnippet from "@/components/code-runner/code-snippet"

const contentDir = path.join(process.cwd(), "/src/content/")
const shortsContentDir = path.join(process.cwd(), "/src/content/shorts/")

interface BlogFrontmatter {
  tag: string
  title: string
  publishDate: string
  description?: string
  readingTime?: string
}

interface ShortFrontmatter {
  title: string
  publishedAt: string
  summary?: string
  tags?: string[]
  ctaLabel?: string
  ctaHref?: string
}

type CustomMDXRemoteProps = Omit<MDXRemoteProps, "options"> & {
  options?: MDXRemoteProps["options"] & {
    mdxOptions?: {
      remarkPlugins?: any[]
      rehypePlugins?: any[]
    }
  }
}

const customComponents = {
  Quiz,
  ImageGrid,
  BlogSuggestion,
  MeshRenderSwitch,
  HelloFx,
  InequalitiesExample,
  Sigmoid,
  Sidenote,
  AutoNumberedSidenote,
  PreviewLink,
  LinkEmbed,
  RustRunner,
  GoRunner,
  CodeSnippet
}

export async function getBlogBySlug(slug: string) {
  const fileName = slug + ".mdx"
  const filePath = path.join(contentDir, fileName)
  const fileContent = fs.readFileSync(filePath, "utf8")

  const { frontmatter, content } = await compileMDX<BlogFrontmatter>({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    },
    components: customComponents,
  } as CustomMDXRemoteProps)

  try {
    parseDate(frontmatter.publishDate)
  } catch (error) {
    console.error(`Invalid date in ${fileName}: ${frontmatter.publishDate}`)
    frontmatter.publishDate = new Date().toISOString()
  }

  return {
    frontmatter,
    content,
    slug: path.parse(fileName).name,
  }
}

export async function getBlogs() {
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
  const blogs = await Promise.all(files.map(async (file) => await getBlogBySlug(path.parse(file).name)))

  return blogs.sort(sortByDate)
}

export function getAllBlogSlug() {
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
  const slugs = files.map((file) => ({ slug: path.parse(file).name }))
  return slugs
}

export async function getShortBySlug(slug: string) {
  const fileName = slug + ".mdx"
  const filePath = path.join(shortsContentDir, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Short not found: ${slug}`)
  }

  const fileContent = fs.readFileSync(filePath, "utf8")

  const { frontmatter, content } = await compileMDX<ShortFrontmatter>({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    },
    components: customComponents,
  } as CustomMDXRemoteProps)

  try {
    parseDate(frontmatter.publishedAt)
  } catch (error) {
    console.error(`Invalid date in ${fileName}: ${frontmatter.publishedAt}`)
    frontmatter.publishedAt = new Date().toISOString()
  }

  const tags = frontmatter.tags?.filter((tag) => Boolean(tag.trim())) ?? []

  return {
    frontmatter: { ...frontmatter, tags },
    content,
    slug: path.parse(fileName).name,
  }
}

export async function getShorts() {
  if (!fs.existsSync(shortsContentDir)) {
    return []
  }

  const files = fs
    .readdirSync(shortsContentDir)
    .filter((file) => file.endsWith(".mdx"))

  const shorts = await Promise.all(files.map(async (file) => await getShortBySlug(path.parse(file).name)))

  return shorts.sort((a, b) =>
    parseDate(b.frontmatter.publishedAt).getTime() - parseDate(a.frontmatter.publishedAt).getTime()
  )
}
