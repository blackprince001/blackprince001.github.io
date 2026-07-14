---
type: Delivery Plan
title: Redesign branch and phase map
description: Branch boundaries, purposes, and exit gates for the redesign and Astro migration.
tags:
  - redesign
  - migration
  - delivery
timestamp: 2026-07-14
---

# Redesign branch and phase map

Status: Phase 0 complete / Phase 1 ready
Started: 2026-07-14

## Safety branches

### `master`

Current production line. Keep deployable. Redesign work reaches `master` only after an accepted phase checkpoint.

### `codex/backup-current-site-2026-07-14`

Immutable pre-redesign snapshot at commit `3357786dd53d70c79cd40978dd17aa7461771f71`.

This branch preserves the current Next.js site before PRD, prototype, or Astro migration changes. Do not add redesign commits to it.

## Working phase branches

### Phase 0 — `codex/phase-0-design-foundation`

Purpose:

- system audit and product requirements
- TRIBE-derived component and motion specification
- evaluation of structurally different homepage directions
- selection of the visual language and first reusable technical components

Exit gate:

- [x] the current minimal editorial structure is confirmed as the baseline
- [x] TRIBE-derived influence is bounded to reusable evidence and interaction components
- [x] first component contracts are validated with real content on the production homepage
- [x] narrow and wide layouts, heading order, media loading, and overflow are verified
- [x] the Astro handoff decisions and explicit non-goals are recorded

Accepted outcome: see [PHASE_0_DECISION.md](./PHASE_0_DECISION.md).

### Phase 1 — `codex/phase-1-astro-foundation`

Branch from the accepted Phase 0 checkpoint.

Purpose:

- Astro static foundation
- TypeScript, MDX, React integration, content collections, and tokens
- GitHub Pages preview workflow
- homepage shell and simple article proof
- `rigid-body-motions` complex island proof

Exit gate:

- preview deployment works
- simple and complex articles preserve behavior
- core accessibility and performance budgets pass

### Phase 2 — `codex/phase-2-content-migration`

Branch from the accepted Phase 1 checkpoint.

Purpose:

- migrate all routes and content collections
- normalize metadata and relationships
- retain required interactive islands
- establish URL, sitemap, RSS, and content parity

Exit gate:

- route manifest and content parity
- all schemas and internal references pass

### Phase 3 — `codex/phase-3-flagship-storytelling`

Branch from the accepted Phase 2 checkpoint.

Purpose:

- production Exhibit components
- two flagship research/project stories
- optimized media, comparisons, stages, and related artifacts

Exit gate:

- two complete flagship stories
- motion, responsive behavior, and fallbacks pass review

### Phase 4 — `codex/phase-4-verification-launch`

Branch from the accepted Phase 3 checkpoint.

Purpose:

- accessibility, performance, browser, SEO, and link verification
- deployment and rollback rehearsal
- production release and observation

Exit gate:

- PRD release criteria pass
- no critical route or content regressions

## Branch rules

1. The backup branch is never rebased, force-pushed, or used as a working branch.
2. Each new phase starts from the final accepted commit of the previous phase.
3. Phase branches contain atomic checkpoints that explain the decision or outcome.
4. Generated build output and local dependency directories are not committed.
5. `master` remains the deployed site until the Astro release is approved.
6. A phase is not merged merely because its code builds; its exit gate must be reviewed.
