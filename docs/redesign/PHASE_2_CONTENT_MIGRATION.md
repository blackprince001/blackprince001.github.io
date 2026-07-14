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

The shared editorial layer now also includes colored tag pills, searchable and tag-filterable writing, centered article tables, and a press-mode floating table of contents. The projects route preserves the previous information hierarchy—featured work followed by sortable, paginated open-source repositories—inside the new visual system.

Tag pills now cover manuscript domains, reading categories, and book statuses as well as writing and project technologies. Detailed project entries also restore the backup site's complete media sets: supporting images sit beside the project narrative, remaining assets form a responsive gallery, images open in a keyboard-operable viewer, and video/YouTube sources retain their native controls.

## Verification evidence

- `bun run check`: zero errors; six pre-existing TypeScript hints in legacy files
- `bun run build`: 48 Astro pages generated successfully
- `bun run build:next`: production fallback builds successfully with existing lint warnings
- Browser sampling: long-form caption, shorts, projects, manuscripts, reading, and a code-runner article each have one H1, a main landmark, no object serialization text, and no horizontal overflow
- Mobile sampling at 390 px: long-form article, shorts index, and projects have no horizontal overflow
- Browser error log: empty after the representative route checks
- Writing interaction check: text search returned five robotics matches; the Machine Learning filter returned thirteen articles with an announced result count
- Floating outline check: 24 H2/H3 entries tracked on the decision-tree article; Escape closed the panel and returned focus to its trigger
- Project hierarchy check: 16 featured projects plus 84 non-fork GitHub repositories, paginated seven at a time
- Table check: table and cell content centered with no document overflow

## Remaining Phase 2 work

- add RSS and decide the final `robots.txt` ownership
- resolve the `/api/publications` contract before the Next Pages Router is retired
- audit internal links and media references across every content entry
- run the final accessibility, responsive, and content-parity gate

Production remains on Next until these checks pass and Phase 2 is accepted.
