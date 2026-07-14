---
type: Implementation Decision
title: Phase 1 Astro foundation
description: Runtime choice, migration boundary, security findings, and first checkpoint for the Astro port.
tags: [astro, architecture, migration]
timestamp: 2026-07-14
---

# Phase 1 Astro foundation

Status: In progress
Branch: `codex/phase-1-astro-foundation`

## Runtime decision

Use Astro 7.0.9 with static output and exact versions of the official MDX, React, and sitemap integrations. The repository runs Node 24 locally, above Astro 7's Node 22.12 minimum. React remains on 18.3 during migration because the current demonstrations already target it and the official Astro React integration supports it.

Astro 7 is suitable for this new foundation because no earlier Astro application or third-party Astro integration must be upgraded. Exact pins, a separate phase branch, the retained `build:next` command, and the immutable backup branch bound the risk of adopting a recent major.

## Rendering contract

- Pages and editorial components render as static Astro HTML.
- Client JavaScript is opt-in through explicit island directives.
- Theme switching is a small framework-free script.
- Existing React demonstrations remain untouched until their individual route proof.
- GitHub Pages keeps the root-site URL and therefore requires no Astro `base` path.

## Content boundary

Astro 7 parses MDX more strictly than the legacy Next pipeline. The existing corpus includes JSX expressions and LaTeX braces that fail the new parser as a group. The foundation therefore does not rewrite source essays in place:

1. legacy content stays in `src/content/` for the Next fallback;
2. converted content enters `src/content-v2/` under validated collections;
3. a typed writing index preserves current homepage and `/blog` links during conversion;
4. Phase 2 removes the temporary index after route parity.

## Dependency audit

`bun audit` reports 48 advisories across the combined migration graph: 20 high, 22 moderate, and 6 low. Most high findings originate in the retained Next 14, old MDX, ESLint, Tailwind, and 3D-viewer dependency paths. Current Astro paths resolve patched releases for several packages that the audit lists elsewhere in older parallel paths.

No forced transitive cross-major override is applied in this checkpoint. The safer remediation is to keep production static, accept only trusted repository MDX, and remove the legacy graph after parity. The audit must be repeated when Next and unused visualization packages are removed.

## Checkpoint evidence

- Astro configuration, local font loading, semantic theme tokens, shell, homepage, writing index, 404 page, sitemap, and typed data validation build successfully.
- The production workflow is unchanged.
- Pull requests can build and download a static Astro artifact without deploying over production.
- `bun run check` reports zero errors; remaining hints are in legacy Next source.
- `bun run build` emits the first static preview to `dist/`.

## Remaining Phase 1 gates

- migrate and render one simple essay;
- prove `rigid-body-motions` with its React islands;
- establish an isolated hosted preview URL;
- run final accessibility, motion, responsive, and performance verification on both article proofs.
