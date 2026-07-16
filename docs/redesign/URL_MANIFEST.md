---
type: Migration Manifest
title: Public URL migration manifest
description: Route ownership and parity status while the site moves from Next.js to Astro.
tags: [astro, routes, migration]
timestamp: 2026-07-14
---

# Public URL migration manifest

Status: Phase 2 accepted

The production deployment remains the Next.js export on `master`. Astro owns preview builds on the active Phase 2 branch until the migration exit gate is accepted.

| Public route | Next source | Astro status | Phase |
|---|---|---|---|
| `/` | `src/app/(main)/page.tsx` | Complete; collection-backed | 2 |
| `/blog` | `src/app/(posts)/blog/page.tsx` | Complete; collection-backed | 2 |
| `/blog/[slug]` | `src/app/(posts)/blog/[slug]/page.tsx` | All 29 published articles build | 2 |
| `/shorts` | `src/app/shorts/page.tsx` | Complete | 2 |
| `/shorts/[slug]` | `src/app/shorts/[slug]/page.tsx` | All 5 shorts build | 2 |
| `/shorts/tag/[tag]` | `src/app/shorts/tag/[tag]/page.tsx` | All 7 tag routes build | 2 |
| `/projects` | `src/app/projects/page.tsx` | Complete | 2 |
| `/publications` | `src/app/publications/page.tsx` | Complete | 2 |
| `/reading` | `src/app/reading/page.tsx` | Complete | 2 |
| `/404.html` | framework fallback | Complete | 1 |
| `/sitemap-index.xml` | `src/app/sitemap.ts` | Complete through Astro sitemap integration | 1 |
| `/robots.txt` | `src/app/robots.ts` | Complete; Astro-owned and sitemap-index aware | 2 |
| `/rss.xml` | none | Complete; writing and shorts feed | 2 |
| `/api/publications` | `src/app/api/publications/route.ts` | Complete; static compatibility endpoint | 2 |

## Content boundary

- `src/content/*.mdx` is the canonical Next-compatible source for long-form writing and a validated Astro collection.
- `src/content/shorts/*.mdx` is the canonical shorts source and a validated Astro collection.
- Homepage and writing indexes now query the content collection directly; the temporary writing index has been removed.
- Project, publication, and reading data remain validated through the shared data model.
- Legacy React is retained only behind explicit islands where an article interaction requires it.
