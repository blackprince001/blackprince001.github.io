---
type: Migration Manifest
title: Public URL migration manifest
description: Route ownership and parity status while the site moves from Next.js to Astro.
tags: [astro, routes, migration]
timestamp: 2026-07-14
---

# Public URL migration manifest

Status: Phase 1 foundation complete

The production deployment remains the Next.js export on `master`. Astro owns preview builds on the Phase 1 branch only.

| Public route | Next source | Astro status | Phase |
|---|---|---|---|
| `/` | `src/app/(main)/page.tsx` | Homepage proof complete | 1 |
| `/blog` | `src/app/(posts)/blog/page.tsx` | Typed index proof complete | 1 |
| `/blog/default` | `src/app/(posts)/blog/[slug]/page.tsx` | Simple article proof complete | 1 |
| `/blog/rigid-body-motions` | `src/app/(posts)/blog/[slug]/page.tsx` | Complex island proof complete | 1 |
| Remaining `/blog/[slug]` | `src/app/(posts)/blog/[slug]/page.tsx` | Pending route parity | 2 |
| `/shorts` | `src/app/shorts/page.tsx` | Pending | 2 |
| `/shorts/[slug]` | `src/app/shorts/[slug]/page.tsx` | Pending | 2 |
| `/shorts/tag/[tag]` | `src/app/shorts/tag/[tag]/page.tsx` | Pending | 2 |
| `/projects` | `src/app/projects/page.tsx` | Pending | 2 |
| `/publications` | `src/app/publications/page.tsx` | Pending | 2 |
| `/reading` | `src/app/reading/page.tsx` | Pending | 2 |
| `/404.html` | framework fallback | Complete | 1 |

## Content boundary

- `src/content/` is the canonical Next-compatible MDX source and a validated Astro collection.
- `src/content-v2/` remains available for new collections such as shorts during Phase 2.
- `src/data/writing-index.json` is a temporary validated index for public links while article bodies are converted.
- A legacy article route moves only after its MDX, media, and interactive components build and render correctly in Astro.
