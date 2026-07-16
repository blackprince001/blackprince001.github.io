---
type: Release Runbook
title: Astro release and rollback runbook
description: Production promotion, smoke checks, observation, and rollback for the Astro migration.
tags: [astro, github-pages, release, rollback]
timestamp: 2026-07-16
---

# Astro release and rollback runbook

## Before promotion

1. Confirm `codex/phase-4-verification-launch` is clean and `bun run verify` plus `bun audit --production` pass.
2. Review the phase checkpoints and release diff; keep `codex/backup-current-site-2026-07-14` unchanged.
3. Merge the release candidate into `master` only when someone can watch the deployment and the following hour.
4. Record the release merge SHA as `ASTRO_RELEASE_SHA` and its first parent as `ROLLBACK_SHA`.

## Deployment

The `publish-to-github-pages` workflow installs the frozen Bun graph, runs the complete verification command, configures Pages for Astro, uploads `dist`, and deploys through the GitHub Pages environment.

Do not treat a successful upload as release acceptance. Wait for the deploy job and public checks.

## Production smoke sequence

Check these in order:

1. `/` loads, announces the identity and selected work, and the `bp` dock link returns to `/#intro`.
2. `/blog`, `/projects`, `/publications`, `/reading`, and `/shorts` load without horizontal overflow at desktop and mobile widths.
3. `/projects/oware` and `/projects/floodit` load all evidence and resource links.
4. `/blog/c-space` exercises a quiz, figure viewer, floating outline, table, and bilateral/inline sidenotes.
5. `/blog/rigid-body-motions` loads a Three.js island on demand and enters/exits fullscreen without article/nav overlap.
6. `/rss.xml`, `/robots.txt`, `/sitemap-index.xml`, and `/api/publications` return the expected public formats.
7. An unknown route renders the custom non-indexable 404.
8. Run mobile Lighthouse on the homepage, writing index, one ordinary article, and one flagship story. LCP must be ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 before final acceptance.

## First-hour observation

- Re-run the core navigation, theme, search/tag filter, project resource, figure modal, and complex-island journeys in production.
- Watch the Pages workflow/environment for a superseding or failed deployment.
- Check browser consoles for new same-origin asset errors and verify external comments/embeds fail without blocking core reading.
- Capture the initial Web Vitals lab results; establish field monitoring when sufficient traffic exists.

## Rollback

If a critical route, content, accessibility, or asset regression appears:

1. Revert the release merge commit on `master` with a new revert commit; do not reset or force-push.
2. Push the revert and watch the existing Pages workflow restore the previous Next artifact and workflow.
3. Re-run the production smoke sequence against the restored deployment.
4. Keep the failed Astro commit reachable on the phase branch, fix there, and repeat the complete release gate.

The immutable backup branch is the final reconstruction point, not the routine rollback mechanism.
