import { z } from "astro/zod";

export const projectSchema = z.object({
  name: z.string(),
  date: z.string().optional(),
  tags: z.array(z.string()).default([]),
  description: z.union([z.string(), z.array(z.string())]),
  images: z.array(z.string()).optional(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
});

export const publicationSchema = z.object({
  id: z.number(),
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number(),
  link: z.string(),
  pdf: z.string().optional(),
  abstract: z.string().optional(),
  domain: z.string().optional(),
});

export const readingSchema = z.object({
  categories: z.array(z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
  })),
  books: z.array(z.object({
    title: z.string(),
    author: z.string(),
    category: z.string(),
    cover: z.url(),
    status: z.enum(["reading", "finished", "want-to-read"]),
  })),
});

export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
