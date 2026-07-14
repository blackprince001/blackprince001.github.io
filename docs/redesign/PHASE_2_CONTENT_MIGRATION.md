---
type: Delivery Checkpoint
title: Phase 2 content migration
description: Current route, content, and island parity checkpoint for the Astro migration.
tags: [astro, content, migration, phase-2]
timestamp: 2026-07-14
---

# Phase 2 content migration

Status: In progress
Branch: `codex/phase-2-content-migration`

## Checkpoint outcome

The Astro preview now builds every public content view from the site's canonical sources:

- 29 published long-form articles and the writing index
- 5 shorts, the shorts index, and 7 tag indexes
- projects, manuscripts, and reading pages
- homepage, sitemap, and 404 page

This produces 48 static pages. The temporary writing-index JSON has been removed; the homepage and writing page now query the validated Astro collection directly.

## Component boundary

Article MDX maps legacy component names to small Astro-native primitives for figures, examples, sidenotes, suggestions, previews, code, and link embeds. Rich figure captions are rendered as static, allow-listed HTML with inline KaTeX support.

Interactive demonstrations remain React islands. Heavy visualization and code-runner components load only when their article requires them and include a textual fallback. Mafs demonstrations and language runners use client-only boundaries because their current dependencies are not server-rendering compatible; this is an explicit compatibility exception, not the default component strategy.

## Verification evidence

- `bun run check`: zero errors; six pre-existing TypeScript hints in legacy files
- `bun run build`: 48 Astro pages generated successfully
- `bun run build:next`: production fallback builds successfully with existing lint warnings
- Browser sampling: long-form caption, shorts, projects, manuscripts, reading, and a code-runner article each have one H1, a main landmark, no object serialization text, and no horizontal overflow
- Mobile sampling at 390 px: long-form article, shorts index, and projects have no horizontal overflow
- Browser error log: empty after the representative route checks

## Remaining Phase 2 work

- add RSS and decide the final `robots.txt` ownership
- resolve the `/api/publications` contract before the Next Pages Router is retired
- audit internal links and media references across every content entry
- run the final accessibility, responsive, and content-parity gate

Production remains on Next until these checks pass and Phase 2 is accepted.
