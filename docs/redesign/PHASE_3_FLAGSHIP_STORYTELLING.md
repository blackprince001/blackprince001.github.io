---
type: Delivery Checkpoint
title: Phase 3 flagship storytelling
description: Reusable exhibit components and two accepted technical case studies.
tags: [astro, exhibit, projects, phase-3]
timestamp: 2026-07-16
---

# Phase 3 flagship storytelling

Status: Complete
Branch: `codex/phase-3-flagship-storytelling`

## Accepted outcome

Two complete flagship stories now use one data-driven Astro system:

- `/projects/oware` presents the rules engine, agent failure modes, and tournament evidence.
- `/projects/floodit` presents board representation, inspectable DQN decisions, and the deployed inference boundary.

The stories supplement rather than replace their full technical articles. Project cards lead with the case study while preserving direct links to the complete write-up, source, and deployed application.

## Reusable contracts

- `ResearchHero` owns the statement, taxonomy, resources, and primary evidence.
- `MetricGroup` keeps a result connected to its label and interpretive context.
- `ResearchChapter` pairs an addressable narrative finding with one evidence stage.
- `EvidenceStage` owns responsive media, alternative text, loading, and centered caption behavior.
- `ResourceLinks` repeats stable write-up, source, and application actions at both story boundaries.
- `flagship-stories.ts` separates story data from presentation and is the authoring surface for future case studies.

Exhibit mode remains part of the existing design system: the same tokens, typography, tag pills, bottom navigation, and light/dark themes apply. It introduces no separate theme provider or generic card language.

## Motion and responsive behavior

Wide viewports use a narrative/evidence split with a sticky stage inside each chapter. Below 52rem, the stage returns to static document flow and the hero becomes a single column. Chapter reveal motion is short, one-time, and subordinate to scrolling; reduced-motion users receive fully visible chapters with no transform or transition.

## Verification evidence

- `bun run check`: zero errors; six pre-existing hints in legacy Next files.
- `bun run build`: 50 static HTML pages, including both flagship routes.
- `bun run audit:site`: all local references across all 50 pages resolve; API, RSS, robots, and sitemap contracts still pass.
- Desktop at 1280 × 900: one H1, one main landmark, three chapters, three metrics, no unlabeled images, no overflow, and sticky evidence behavior.
- Mobile at 390 × 844: one H1, three linear chapters, static evidence behavior, named controls, no undersized non-inline targets, and no overflow.
- Runtime console: no warnings or errors on the sampled flagship routes.
