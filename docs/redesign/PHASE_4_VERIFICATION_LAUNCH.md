---
type: Release Candidate
title: Phase 4 verification and launch
description: Pre-launch evidence, known boundaries, and remaining production-only gates.
tags: [astro, verification, release, phase-4]
timestamp: 2026-07-16
---

# Phase 4 verification and launch

Status: Release candidate — production launch pending
Branch: `codex/phase-4-verification-launch`

## Pre-launch gates passed

- `bun run check`: 52 Astro/shared source files, zero errors, warnings, or hints.
- `bun run build`: clean 50-page static build with no bundler warnings.
- `bun run audit:site`: every local link/media reference resolves; every page has a unique title, description, production canonical, one H1, one main landmark, and alt attributes; the 404 is `noindex`; RSS, robots, sitemap, and publications API contracts pass.
- Core static routes and both flagship stories reference no emitted framework-JavaScript chunks.
- Every emitted JavaScript chunk is below 850 KiB raw and 225 KiB gzip; every stylesheet is below 20 KiB gzip. The largest intentional shared Three.js chunk is approximately 208 KiB gzip and remains isolated to complex demonstrations.
- `bun audit --production`: no known vulnerabilities after retiring the unused Next production graph and resolving build-tool transitive packages to patched versions.
- All article/project videos require an intentional play action, use posters, and defer loading with `preload="none"`.
- Rendered desktop/mobile checks cover the homepage, indexes, complex articles, projects, both flagship stories, dialogs, floating outline, dock, theme control, and deferred video state with clean sampled consoles.
- The Astro preview workflow now runs the generated-site audit; the Pages workflow builds and uploads `dist` rather than the retired Next `out` artifact.

## Regressions found and fixed by this gate

- Added missing alternative text to two passwordless-authentication diagrams.
- Replaced an extra article-body H1 with the correct H2.
- Replaced a raw two-image traffic block that widened the page with the shared figure group.
- Removed article video autoplay and assigned existing evidence images as posters.
- Restored complete Open Graph/Twitter metadata and marked the 404 as non-indexable.
- Removed unused imports from the retained mesh viewer and removed Next-only packages/scripts from the production dependency graph.

## Deliberate boundary

The previous Next source remains in the repository only as migration history; TypeScript and the production package graph now target Astro/shared sources. The immutable backup branch and prior phase branches preserve a buildable pre-migration checkpoint. A later cleanup can remove the retired source tree after the Astro release has completed its observation window.

GitHub Pages does not provide application-server headers or runtime health endpoints. Core availability is instead the static homepage plus machine-readable sitemap/robots/feed checks. A strict CSP should be introduced only with a reporting/staging layer because the current site intentionally hosts inline Astro scripts, WebAssembly runners, Giscus, YouTube, and live project embeds.

## Production-only gates

These cannot be truthfully completed against localhost:

- merge/push and successful GitHub Pages deployment
- public URL/status/cache/TLS smoke checks
- Lighthouse mobile measurements against the deployed artifact
- initial real-user Core Web Vitals/field baseline
- external embed/comment behavior at the production origin
- first-hour error and critical-journey observation

Follow [RELEASE_RUNBOOK.md](./RELEASE_RUNBOOK.md) for the go/no-go, observation, and rollback sequence.
