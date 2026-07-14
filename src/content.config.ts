import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    tag: z.string(),
    description: z.string().optional(),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const shorts = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/shorts" }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    tag: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }).transform((data) => ({ ...data, tags: data.tags ?? data.tag ?? [] })),
});

export const collections = { writing, shorts };
