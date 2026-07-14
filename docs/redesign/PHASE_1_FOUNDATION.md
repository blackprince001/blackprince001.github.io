---
type: Implementation Decision
title: Phase 1 Astro foundation
description: Runtime choice, migration boundary, article proofs, security findings, and verification for the Astro port.
tags: [astro, architecture, migration]
timestamp: 2026-07-14
---

# Phase 1 Astro foundation

Status: Complete
Branch: `codex/phase-1-astro-foundation`

## Runtime decision

Use Astro 7.0.9 with static output and exact versions of the official MDX, React, and sitemap integrations. The repository runs Node 24 locally, above Astro 7's Node 22.12 minimum. React remains on 18.3 during migration because the current demonstrations already target it and the official Astro React integration supports it.

Astro 7 is suitable for this new foundation because no earlier Astro application or third-party Astro integration must be upgraded. Exact pins, a separate phase branch, the retained `build:next` command, and the immutable backup branch bound the risk of adopting a recent major.

## Rendering contract

- Pages and editorial components render as static Astro HTML.
- Client JavaScript is opt-in through explicit island directives.
- Theme switching is a small framework-free script.
- Existing React demonstrations render as bounded islands and hydrate only when near the viewport.
- GitHub Pages keeps the root-site URL and therefore requires no Astro `base` path.

## Content boundary

The existing corpus depends on GitHub-flavored Markdown, TeX math, KaTeX, and embedded JSX. Phase 1 keeps one canonical source rather than forking article bodies:

1. `src/content/` remains compatible with the Next fallback and is also loaded as an Astro content collection;
2. Astro's unified Markdown processor supplies GFM, math, and KaTeX behavior;
3. Astro-native wrappers own article structure, figures, examples, and notes;
4. wrapper components apply `client:visible` directly to the three React demos and quiz;
5. Phase 2 expands the proven route to the rest of the corpus and removes the temporary writing index.

## Dependency audit

`bun audit` reports 48 advisories across the combined migration graph: 20 high, 22 moderate, and 6 low. Most high findings originate in the retained Next 14, old MDX, ESLint, Tailwind, and 3D-viewer dependency paths. Current Astro paths resolve patched releases for several packages that the audit lists elsewhere in older parallel paths.

No forced transitive cross-major override is applied in this checkpoint. The safer remediation is to keep production static, accept only trusted repository MDX, and remove the legacy graph after parity. The audit must be repeated when Next and unused visualization packages are removed.

## Completed evidence

- Astro configuration, local font loading, semantic theme tokens, shell, homepage, writing index, 404 page, sitemap, and typed data validation build successfully.
- The production workflow is unchanged.
- Pull requests can build and download a portable static Astro preview artifact without deploying over production.
- `bun run check` reports zero errors; remaining hints are in legacy Next source.
- `bun run build` emits the static preview, including `/blog/default/` and `/blog/rigid-body-motions/`.
- `bun run build:next` still succeeds, preserving the production fallback.
- The simple essay renders without framework JavaScript.
- The robotics proof renders its complete linear article, math, figures, examples, quiz, and three React demonstrations.
- Interactive code uses `client:visible` with a 240px root margin; below-fold images use native lazy loading.
- Demo sliders, fullscreen controls, the frame selector, quiz navigation, and feedback expose accessible names and state.
- The quiz no longer permits advancing before an answer is selected.

## Verification record

- Astro diagnostics: zero errors and zero warnings; six legacy-source hints remain.
- Static routes: five pages plus sitemap generated successfully.
- Responsive browser checks: 1280×900 and 390×844, with no document overflow.
- Structural accessibility checks: one H1, no missing image alternatives, no duplicate IDs, and no unnamed controls on the robotics proof.
- Runtime checks: no browser console errors or warnings; theme state and Tailwind's dark class remain synchronized.
- Island checks: all four islands remain unhydrated above the fold; the rotation island hydrates on approach and its fullscreen state updates.
- Asset inspection: the simple essay references no framework bundle; the large Three.js shared chunk is deferred behind `client:visible` on the technical article.
- No-JavaScript behavior: article text, math, figures, descriptions, and controls are present in static HTML; each island includes an explicit fallback description.

The PR artifact is the Phase 1 preview boundary. A public preview deployment is intentionally deferred: GitHub Pages has one production target, and using it for a phase preview would replace the current Next site. Phase 4 owns production deployment and field Core Web Vitals; Phase 1 proves the static artifact and loading contract without touching production.
