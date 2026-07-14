---
type: Decision
title: Phase 0 design foundation
description: Accepted visual direction, component contracts, and migration boundaries for the Astro implementation.
tags:
  - redesign
  - design-foundation
  - astro-handoff
timestamp: 2026-07-14
---

# Phase 0 design foundation

Status: Accepted
Accepted: 2026-07-14
Production proof: `/` on `codex/phase-0-design-foundation`

## Decision

The redesign preserves the current site's minimal, professional identity and content structure. Peter Sesan's site is the primary reference for editorial measure, whitespace, plainspoken copy, low-contrast supporting navigation, and restrained project presentation. TRIBE v2 informs technical component craft only.

The homepage implementation is the accepted visual proof. Phase 1 must reproduce its behavior and visual hierarchy in Astro before expanding the migration.

## Accepted visual language

- Inter remains the primary typeface; JetBrains Mono remains the technical-label face.
- Body copy stays within a narrow reading measure with comfortable line height.
- The palette remains neutral and supports both light and dark themes, defaulting to the system preference.
- Whitespace, alignment, and type establish section hierarchy. Routine separator lines are not used.
- A personal monogram remains the introduction mark until a suitable portrait is intentionally supplied.
- Motion is limited to short hover, press, state, and continuity feedback. No decorative entrance sequence is required.
- Narrow layouts use one linear content column. The desktop section rail is removed below its useful content width.

## Foundation values

These values describe the accepted relationships. Phase 1 should encode them as semantic tokens rather than copying route-local raw values.

| Role | Phase 0 value |
|---|---|
| Primary type | Inter, regular and bold local files |
| Technical type | JetBrains Mono with a compatible monospace fallback |
| Reading measure | approximately `43rem` |
| Page gutter | fluid from `1.25rem` to `3rem` |
| Section rhythm | fluid from `4.5rem` to `7.5rem` |
| Body copy | approximately `16–17px`, `1.6` line height |
| Supporting labels | approximately `11–13px`, mono where technical |
| Media shape | restrained radius, approximately `0.55rem` |
| Ordinary feedback | `120–220ms`, transform/color/opacity only |
| Wide composition | optional section rail plus centered reading column |
| Narrow composition | one column, no section rail, no horizontal overflow |

Color must be expressed through semantic roles—canvas, surface, text, muted text, media surface, border, focus, and text-on-media—with light and dark values defined centrally.

## Accepted homepage order

1. Introduction and current focus
2. Selected work
3. Recent writing
4. Recent manuscripts

Contact remains in the global footer. Shorts and Reading retain dedicated routes.

## Resolved product defaults

- Use Prince conversationally, the full name for formal attribution and metadata, and `blackprince` as the established technical handle.
- Keep Shorts visible during the migration.
- Keep Reading as the only personal collection in v1; add no speculative lifestyle section.
- Default to the system theme with explicit light and dark support.
- Emphasize research understanding and collaboration while keeping the site useful for teaching and employment contexts.
- Begin flagship exploration with Oware and Real-Time Traffic Density Estimation; final production treatment remains subject to content review in Phase 3.

## Navigation and route contract

Phase 1 preserves the current navigation labels and public URLs:

- `/blog` — Writing
- `/shorts` — Shorts
- `/projects` — Projects
- `/publications` — Manuscripts
- `/reading` — Reading

Changing these labels or consolidating routes is not part of the framework migration. Redirects may be added later only after a separate information-architecture decision.

## First component contracts

The homepage validates the initial contracts with real content:

### `EditorialShell`

- centered reading column
- optional low-contrast desktop section rail
- normal document flow on narrow screens
- global theme, header, and footer ownership

### `SectionHeading`

- technical eyebrow or sequence label
- semantic heading
- optional destination action
- whitespace, not a divider, separates it from adjacent sections

### `ProjectFeature`

- media frame with an accessible destination
- small system index and inspection action
- title, year, concise summary, technology metadata, and resource links
- media may be an image, video, comparison, or interactive island without changing the surrounding content contract

### `IndexList`

- compact dated or categorized entries
- one unambiguous destination per row
- optional supporting metadata and directional cue
- no decorative row separators

### `EvidenceFrame`

- reserved for technical stories that need multiple evidence states
- figure, caption, state label, and optional compact controls
- static fallback and reduced-motion behavior are mandatory

## Astro handoff

Phase 1 begins from the final Phase 0 commit and must establish:

1. Astro static output with TypeScript and MDX.
2. Semantic design tokens for both themes.
3. Astro layouts and components matching the accepted homepage.
4. Typed collections for essays, shorts, projects, manuscripts, and reading.
5. One simple essay migration.
6. `rigid-body-motions` as the complex React-island proof.
7. GitHub Pages preview output without changing production.

## Explicit non-goals for Phase 1

- redesigning every content route before the Astro foundation works
- rewriting functioning React demonstrations
- changing public URLs or navigation taxonomy
- adding a CMS, database, or new styling framework
- making every project a cinematic exhibit

## Verification evidence

- TypeScript check passes.
- Next.js static production build passes.
- The homepage has one H1 and ordered H2/H3 structure.
- Project media loads without broken assets.
- No horizontal overflow occurs at 390px or 1280px.
- The desktop rail collapses on narrow screens.
- Browser console verification reports no errors or warnings on the exported homepage.

## Rejected directions

- A full TRIBE-like homepage was rejected because it overwhelms the personal editorial identity.
- Multiple competing homepage modes were rejected because they create an unnecessary second design system.
- A simultaneous information-architecture and framework migration was rejected because it obscures parity and rollback.
