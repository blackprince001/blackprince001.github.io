---
type: System Audit
title: Current-site system audit
description: Baseline inventory of routes, content, interactivity, deployment, and migration risks in the current Next.js site.
tags:
  - audit
  - nextjs
  - astro
timestamp: 2026-07-14
---

# Current-site system audit

Status: discovery baseline
Audited: 2026-07-14
Repository: `blackprince001.github.io`

## Executive summary

The site is a statically exported Next.js 14 digital garden hosted on GitHub Pages. It is visually restrained, but technically richer than a conventional portfolio: long-form MDX essays embed mathematics, code runners, quizzes, Three.js robotics demonstrations, margin notes, link previews, figures, and comments.

The Astro migration is a strong fit because most routes are content-first and can ship as static HTML, while the existing React components can remain as selectively hydrated islands. The migration should not begin by rewriting interactive components. It should first establish typed content collections, a route-compatible Astro shell, and an explicit island inventory.

## Current architecture

| Area | Current implementation |
|---|---|
| Framework | Next.js `^14.2.22`, App Router, React `^18.3.1`, TypeScript 5 |
| Rendering | Static export via `output: "export"` |
| Styling | Tailwind CSS 3, CSS modules, global CSS variables |
| Content | 29 long-form MDX files and 5 short-form MDX files |
| Structured data | JSON for featured projects, publications, and reading list |
| Rich content | KaTeX, GFM, syntax highlighting, custom React MDX components |
| Deployment | Bun build in GitHub Actions, then GitHub Pages |
| Analytics/comments | Umami and Giscus |
| Media | 240 public assets, approximately 116 MB total |

## Route and content inventory

Public route families:

- `/` — profile, recent writing, projects, and manuscripts
- `/blog` and `/blog/[slug]` — long-form writing
- `/shorts`, `/shorts/[slug]`, and `/shorts/tag/[tag]` — short-form notes
- `/projects` — project catalogue
- `/publications` — manuscripts and PDFs
- `/reading` — reading shelf
- `/robots.txt` and `/sitemap.xml` — discovery metadata

The site also contains a statically generated `/api/publications` endpoint, although page components import the same JSON directly. It is not currently a necessary runtime boundary.

## Content model

### Long-form writing

Current fields:

- `title`
- `publishDate`
- `tag`
- optional `description`
- optional `readingTime`

The date field uses several human-readable formats. Invalid dates are silently replaced with the build time, which can hide data errors and destabilize ordering.

### Shorts

Expected fields:

- `title`
- `publishedAt`
- optional `summary`
- optional `tags[]`
- optional CTA label and URL

Four of five existing shorts use `tag` as an array while the loader expects `tags`. Their tags are therefore dropped at runtime. This must be normalized during migration.

### Projects, publications, and reading

These are unvalidated JSON documents. All publication records currently reuse `id: 1`; rendering works only because one component builds a composite key. Astro content/data collections should validate these structures at build time and use stable string identifiers.

## Interactivity inventory

Approximately 40 source files are client components. They fall into three migration classes.

### Keep as React islands initially

- Three.js / React Three Fiber robotics demonstrations
- graphing and simulation components
- quizzes
- runnable code editors
- PDF viewer
- Giscus comments
- complex margin-note positioning
- image lightbox where native dialog is insufficient

These should hydrate only when visible or idle, depending on how quickly the interaction is needed.

### Replace with small framework-free scripts

- theme preference
- mobile navigation
- copy-to-clipboard
- simple disclosure controls
- table-of-contents highlighting

### Render as static Astro components

- page shells and layouts
- navigation links
- hero and section introductions
- project, publication, and writing cards
- figures and basic embeds
- footer and metadata

## Deployment and tooling

The current GitHub Pages workflow builds with Bun and uploads `./out`. Astro's static build will emit `./dist` and can use the official `withastro/action` workflow.

Issues to resolve:

- Both `next.config.js` and `next.config.mjs` exist.
- Both `bun.lock` and `package-lock.json` exist, leaving package-manager ownership ambiguous.
- The README is still the default Create Next App document.
- There is no automated test suite or content-schema check.
- The build depends on remote Google font delivery for JetBrains Mono while Inter is local.
- The public media library includes individual videos from about 5 MB to 18 MB.

## SEO and URL risks

- Existing blog URLs must remain unchanged.
- Short URLs and tag URLs must remain unchanged or receive static redirects.
- The current sitemap omits `/reading`, individual shorts, and short tag pages.
- Per-post metadata is limited for long-form essays; descriptions and social images should become schema-supported fields.
- Canonical URLs, RSS, and structured data should be added in the Astro shell.

## Visual baseline

Strengths to preserve:

- strong reading-first restraint
- dark and light themes
- clear separation of writing, projects, manuscripts, and reading
- unusually rich technical articles
- identity as a working digital garden rather than a polished corporate portfolio

Limitations to address:

- homepage reads like a directory rather than a deliberately composed story
- all content types receive similar visual weight
- flagship research and engineering work lacks an immersive presentation mode
- navigation labels reflect storage categories more than a visitor's journey
- projects contain substantial narrative and media but are presented mostly as repeated cards
- typography and spacing are consistent but do not yet create a distinctive visual signature

## Migration constraints

1. Preserve every published URL unless a redirect is explicitly documented.
2. Preserve all MDX content before changing its presentation.
3. Prove one complex MDX article in Astro before bulk migration.
4. Keep React where it protects working interactive behavior.
5. Do not ship all React components as globally hydrated UI.
6. Validate content at build time and fail on invalid dates or fields.
7. Establish performance budgets before adding motion or large media.
8. Maintain GitHub Pages as the initial hosting target.

## Recommended proof slice

The first end-to-end slice should include:

- the global Astro layout and design tokens
- the homepage shell
- the writing collection and `/blog/[slug]` route
- one simple essay
- `rigid-body-motions.mdx` as the complex compatibility test
- one React Three Fiber demo hydrated as an island
- sitemap, RSS, and GitHub Pages preview deployment

If that slice works, the rest of the migration becomes a controlled content and component conversion rather than an architecture experiment.
