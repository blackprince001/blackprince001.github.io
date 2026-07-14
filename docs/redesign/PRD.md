---
type: Product Requirements
title: Astro site overhaul
description: Product, experience, architecture, and release requirements for the portfolio redesign and Astro migration.
tags:
  - redesign
  - astro
  - requirements
timestamp: 2026-07-14
---

# Product requirements document: Astro site overhaul

Status: Phase 0 baseline accepted / v0.2
Owner: Prince Kwabena Appiah Boadu
Prepared: 2026-07-14
Target: `blackprince001.github.io`

## 1. Product statement

Redesign the current digital garden as a distinctive, fast, content-first personal site that presents Prince as a systems engineer, robotics researcher, builder, and writer. The new site should combine the calm editorial clarity of Sesan Studio with the explanatory, media-rich research storytelling of Meta's TRIBE v2—without turning every page into a high-production demo.

The implementation will move from statically exported Next.js to Astro. Astro will render the site shell and most content as static HTML. Existing React components will remain only where interaction materially improves understanding.

Working design idea: **a research notebook with exhibit rooms**.

- The notebook is the default: quiet, personal, legible, and easy to browse.
- Exhibit rooms are reserved for flagship projects and research: cinematic media, diagrams, interactive models, and paced explanations.

## 2. Problem

The current site contains strong material, but its presentation understates its depth.

- The homepage exposes categories but does not tell a memorable story about the person behind them.
- Rich projects and research are compressed into the same card/list language as ordinary entries.
- The content model is not validated, allowing malformed metadata to silently degrade navigation and ordering.
- The Next.js client boundary is broader than a static content site needs.
- The design is consistent but generic; it lacks a recognizable visual and interaction system.
- Large media and many interactive components create performance risk without explicit loading rules.

## 3. Goals

### Product goals

1. Make a new visitor understand Prince's practice and current focus within 15 seconds.
2. Make flagship projects feel substantial before the visitor opens a repository.
3. Make long-form technical writing exceptionally comfortable to read and explore.
4. Connect projects, essays, manuscripts, and experiments into a coherent body of work.
5. Preserve the informal, evolving character of a digital garden.

### Technical goals

1. Move content-first rendering to Astro static pages.
2. Validate all content and structured data at build time.
3. Hydrate React only for components that require client interaction.
4. Preserve public URLs and GitHub Pages deployment.
5. Establish measurable accessibility and performance budgets.
6. Make adding a new essay, short, project, or manuscript a documented, predictable workflow.

## 4. Non-goals for the first release

- A headless CMS or authenticated authoring interface
- User accounts, personalization, or a database
- Rewriting working Three.js, quiz, or code-runner components in another framework
- A full-screen animated experience on every route
- Migrating away from GitHub Pages
- A new comments backend
- A multilingual site
- Re-authoring all existing essays

## 5. Audience

### Primary visitors

**Research and engineering peers** want to assess the depth, methods, artifacts, and reproducibility of the work.

**Potential collaborators, supervisors, and employers** want a fast understanding of capabilities, selected work, role, and contact path.

**Technical readers and students** want clear explanations, useful diagrams, runnable examples, and related material.

### Secondary visitors

**Friends and curious repeat visitors** want recent thinking, reading, small experiments, and signs of the person beyond a résumé.

## 6. Core visitor journeys

### First-time evaluation

1. Land on the homepage.
2. Understand the one-line practice statement and current focus.
3. Scan two or three selected bodies of work.
4. Open a flagship project or essay.
5. See evidence: media, methods, outcomes, code, manuscript, or demo.
6. Reach a clear contact or collaboration path.

### Technical reading

1. Enter through search or a shared essay URL.
2. Read the title, summary, date, topic, and reading context.
3. Navigate the article using a calm, responsive table of contents.
4. Interact with diagrams or demonstrations only when relevant.
5. Continue to a related project, manuscript, or essay.

### Returning exploration

1. Open the site and identify what is new or currently active.
2. Browse by body of work or topic rather than only by content format.
3. Move between a project, its write-up, source, and manuscript without losing context.

## 7. Information architecture

### Primary navigation

- **Writing** — long-form essays
- **Shorts** — short notes
- **Projects** — selected systems and the open-source catalogue
- **Manuscripts** — formal publications and research artifacts
- **Reading** — the personal reading shelf

The homepage carries the introduction and current-focus material. Phase 1 preserves these labels and all current URLs so the framework migration does not also become an information-architecture migration. Any later consolidation into Work, Research, or About requires a separate product decision after route parity.

### Homepage chapters

1. **Introduction** — personal mark, practice statement, working-archive description, and current teaching
2. **Selected work** — two to four curated systems with technical media frames
3. **Recent writing** — dated long-form entries
4. **Recent manuscripts** — selected formal outputs

Contact and personal profiles remain in the global footer. Shorts and Reading retain dedicated routes rather than being forced into the homepage before their editorial role is settled.

### Content relationships

Every major item may link to related items:

- project ↔ essay/write-up
- project ↔ repository/demo
- project ↔ manuscript
- essay ↔ topic
- essay ↔ prerequisite or next reading
- manuscript ↔ project and supporting artifacts

These relationships should be explicit frontmatter fields, not inferred from title strings.

## 8. Design direction

### Principles

1. **Editorial first.** Hierarchy comes from composition, type, spacing, and content—not decorative cards.
2. **Selective spectacle.** Motion and immersive media are reserved for concepts that benefit from demonstration.
3. **Human, not institutional.** The voice and small personal details should keep the site from resembling a lab template.
4. **Technical without visual noise.** Dense ideas can use diagrams, annotations, and tools while the surrounding interface stays quiet.
5. **Theme parity.** Light and dark modes must both feel intentionally art-directed.

### Reference synthesis

From [Sesan Studio](https://www.sesan.studio/):

- adopt the single-page editorial rhythm, persistent section orientation, generous whitespace, personal voice, and varied chapter compositions
- avoid copying its exact grid, typography, or portfolio content hierarchy

From [TRIBE v2](https://aidemos.atmeta.com/tribev2):

- adopt the idea of a research story unfolding through large media, guided sections, interactive comparisons, and clear links to paper/code/model
- avoid applying black cinematic staging, heavy controls, or continuous motion to ordinary blog and index pages

### Visual vocabulary to explore

- warm neutral paper in light mode; near-black graphite in dark mode
- one vivid technical accent that can change by body of work
- expressive editorial display type paired with a highly legible reading face and restrained mono labels
- hairline rules, captions, figure numbers, coordinates, and quiet diagrammatic marks
- asymmetrical but disciplined desktop compositions that reflow to simple linear mobile reading
- project-specific media frames rather than a universal rounded-card grid

### Motion rules

- no essential information may depend on animation
- respect `prefers-reduced-motion`
- use motion for spatial continuity, comparison, and cause/effect—not ambient decoration
- avoid scroll hijacking
- defer heavyweight interactive media until visible or intentionally launched
- specify motion using named behaviors such as reveal, stagger, crossfade, shared-element transition, layout animation, origin-aware animation, and direct manipulation
- keep ordinary UI motion below 300ms; reserve longer sequences for explanations the visitor intentionally enters
- use CSS/WAAPI for predetermined motion and retain spring/velocity systems for interruptible gestures only

The reusable component catalogue, animation matrix, token plan, authoring model, and accessibility/performance contracts are defined in [COMPONENT_AND_MOTION_SYSTEM.md](./COMPONENT_AND_MOTION_SYSTEM.md).

## 9. Functional requirements

### Global shell

- Responsive primary navigation with visible current location
- Light, dark, and system theme preference
- Skip link, keyboard-visible focus, and semantic landmarks
- Canonical metadata, Open Graph/Twitter metadata, favicon, sitemap, RSS, and robots rules
- Consistent footer with contact and source links

### Homepage

- Editable intro, current focus, and status without component code changes
- Curated selected work rather than automatically listing only the latest work
- Recent writing split visually between essays and shorts
- Selected research/manuscripts
- A direct contact action
- Meaningful narrow, medium, and wide compositions

### Work index and project stories

- Filter or group by domain only if the catalogue size justifies it
- Support project status, date, role, collaborators, technologies, links, outcomes, and related content
- Support a standard project page and an enhanced flagship layout
- Enhanced layout may include sticky chapter navigation, full-bleed media, diagrams, comparisons, and React demonstration islands
- External demo, repository, paper, and write-up links must be clearly distinguished
- Flagship work uses the shared Exhibit component system rather than a bespoke route-specific implementation

### Writing

- Unified writing landing page with essay/short filters while preserving `/blog` and `/shorts` URLs
- Topic pages generated from validated topic data
- Search may be deferred until the collection size or usage justifies it
- Article header with title, summary, publication/update dates, topics, and reading time
- Responsive table of contents for long articles
- Figures, captions, equations, code, citations, side notes, and related content
- Giscus comments retained where currently used

### Research/manuscripts

- Validated unique identifiers
- Title, authors, year, venue/status, abstract, topics, PDF, external URL, and related project fields
- Clear distinction between drafts, preprints, and published work
- Direct PDF access without forcing use of an embedded viewer

### Reading and personal collections

- Preserve the reading data and status model
- Treat remote book covers as enhancements with stable fallbacks
- Keep the route public even if it moves to secondary navigation

## 10. Content model requirements

Use Astro content collections with schemas for:

- `essays`
- `shorts`
- `projects`
- `publications`
- optional `pages` for editable biography/homepage copy

Common fields:

- stable slug
- title
- summary/description
- publish date and optional updated date in ISO format
- draft state
- topics as canonical slugs
- optional cover/social image with alt text
- related entry references

Builds must fail on invalid required fields, dates, duplicate identifiers, broken internal references, or missing alt text for editorial images.

## 11. Astro architecture

### Baseline

- Astro static output
- Astro components for layouts and non-interactive UI
- official MDX integration for current `.mdx` content
- official React integration for retained islands
- content collections for typed build-time data
- GitHub Pages deployment using the official Astro action

This follows Astro's documented model: `.astro` components render without client JavaScript by default, while framework components can be selectively hydrated as islands. Astro also provides an official migration path from Next.js and first-party support for MDX and GitHub Pages.

### Hydration policy

- `client:load` only for interaction required immediately above the fold
- `client:idle` for low-priority controls
- `client:visible` for demos, graphs, viewers, and media below the fold
- no directive for React components that can render static HTML only

### Component policy

- Organize UI as tokens, primitives, editorial patterns, exhibit patterns, and interactive islands.
- Use Astro components for structure and content; React islands own only live interaction engines.
- Keep new components local until repeated behavior or a stable product concept justifies promotion.
- Prefer slots/composition and semantic variants over boolean-prop accumulation.
- Maintain development-only component and motion reference routes covering every state and theme.
- Treat accessibility, reduced motion, loading fallback, and hydration behavior as part of every public component API.

### Package policy

Choose one package manager and one lockfile. At implementation kickoff, resolve current stable Astro and official integration versions from primary documentation and registry metadata, then run package and advisory audits before merging the migration foundation.

## 12. Non-functional requirements

| Attribute | Release requirement | Verification |
|---|---|---|
| Accessibility | WCAG 2.2 AA for core routes; complete keyboard operation; reduced-motion support | automated checks plus manual keyboard, zoom, screen-reader spot checks |
| Performance | Mobile p75 targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on core static pages | Lighthouse and field analytics after release |
| JavaScript | No global React application shell; zero framework JS on content/index pages unless a feature needs it | built asset inspection and per-route bundle report |
| Media | No autoplay with sound; posters for video; responsive images; large demos lazy loaded | network waterfall and slow-connection review |
| Reliability | Static core content remains usable if analytics, comments, covers, or embeds fail | blocked-third-party smoke test |
| Maintainability | One content schema per collection; one package manager; documented authoring workflow | CI schema/build checks and contributor walkthrough |
| Portability | Static `dist` output remains deployable outside GitHub Pages | local static-server smoke test |
| Privacy | No new tracking; preserve privacy-conscious analytics; no unnecessary visitor data | dependency and network-request audit |
| SEO | All current indexable URLs retained; complete sitemap; canonical metadata; no accidental noindex | URL manifest diff and crawler check |
| Localization | English only in v1; layout must tolerate longer text and avoid fixed text heights | long-content and text-zoom test |
| Availability | Inherits GitHub Pages availability; no runtime dependency for core pages | build artifact inspection |
| Recovery | Previous deploy can be restored by reverting the release commit | documented rollback rehearsal |
| Data integrity | Invalid or duplicate content fails CI instead of silently falling back | schema and reference tests |
| Security | Minimize dependencies and client scripts; audit resolved graph; no unsafe raw HTML by default | lockfile audit, headers review, dependency review |

## 13. Analytics and success measures

The redesign succeeds when:

- at least 80% of sampled first-time reviewers can state Prince's practice and name one project after a 15-second homepage scan
- selected-work click-through increases from the pre-launch baseline
- article-to-related-content navigation is measurable and used
- core static pages meet the performance targets above
- no indexed current URL returns 404 after migration
- new content can be added without editing route or loader code
- interactive essays retain feature parity

Before launch, capture a four-week baseline from existing Umami data where available. Do not add invasive session replay.

## 14. Delivery plan

### Phase 0 — definition and visual foundation

- Confirm the product statement, migration-safe navigation, and homepage chapter order
- Evaluate structurally different homepage directions and retire the rejected structures
- Establish typography, color, image treatment, spacing, and motion rules using real content
- Validate the first editorial and project-feature contracts on the production homepage
- Specify the evidence and interaction contracts for validation with `rigid-body-motions` in Phase 1
- Record the selected direction: retain the minimal professional structure and develop the reference influence at component level

Exit: the existing minimal editorial structure is approved as the baseline, with a component language validated at narrow and wide widths.

### Phase 1 — Astro foundation and proof slice

- Establish Astro, TypeScript, MDX, React, content collections, styling, and static deployment
- Implement global layout, metadata, tokens, and accessibility baseline
- Establish primitive, editorial, exhibit, and island component folders plus reference routes
- Migrate the homepage shell and writing routes
- Migrate one simple essay and `rigid-body-motions` as the complex proof
- Preserve URLs and validate preview deployment

Exit: the proof slice builds on GitHub Pages and the complex article retains its demonstrations.

### Phase 2 — content and route migration

- Normalize metadata and migrate all essays and shorts
- Migrate projects, publications, reading, RSS, sitemap, and tag/topic routes
- Convert static React components to Astro components
- Preserve retained interactive components as islands

Exit: route manifest parity and content parity.

### Phase 3 — flagship storytelling

- Build the enhanced project-story template
- Apply it to two flagship works using real media and outcomes
- Add relationship navigation among project, essay, manuscript, code, and demo
- Optimize images/video and define project-specific accents

Exit: two complete flagship stories at production quality.

### Phase 4 — verification and launch

- Accessibility, responsive, browser, performance, SEO, and link audits
- Compare current and new URL manifests
- Test with third-party services blocked
- Capture analytics baseline and configure post-launch monitoring
- Rehearse rollback, launch, and observe

Exit: all release requirements pass; no critical route or content regressions.

## 15. Acceptance criteria for v1

- All existing public content is present or explicitly redirected.
- Homepage communicates identity, current focus, selected work, recent ideas, research, and contact.
- Two flagship projects use the enhanced story format.
- Flagship stories are composed from the shared Exhibit components rather than route-specific page code.
- All collections are schema validated.
- Long-form MDX supports the current custom component set or a documented equivalent.
- Complex Three.js demonstrations work as isolated React islands.
- Core pages remain readable and navigable with JavaScript disabled.
- Keyboard, zoom, reduced-motion, narrow/mobile, and wide layouts pass review.
- Core Web Vitals targets are met in the release candidate.
- GitHub Pages preview and production deployment are documented and reproducible.

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| MDX component incompatibility | prove the most complex essay before bulk migration |
| redesign and migration expand into one large rewrite | deliver vertical slices and keep React islands initially |
| motion harms reading or accessibility | selective spectacle, reduced-motion parity, no scroll hijacking |
| large media harms performance | posters, responsive encodes, lazy loading, explicit media budgets |
| URL/SEO regression | generate and diff route manifests before launch |
| content cleanup changes meaning | normalize metadata separately from prose edits |
| Astro/React integration version drift | pin resolved stable versions and validate official compatibility at kickoff |

## 17. Phase 0 product decisions

1. Use **Prince** in conversational introduction copy, the full name in formal metadata and attribution, and `blackprince` only where the established technical handle is useful.
2. Treat **Oware Engine and a Ladder of RL Agents** and **Real-Time Traffic Density Estimation** as the first flagship candidates because each already connects substantial technical evidence with a write-up and external artifact.
3. Keep **Shorts** as a visible product label during migration. Consolidation under Writing is a later information-architecture decision.
4. Add no new personal-content category in v1. Reading remains the existing human-texture surface.
5. Default to the **system theme** while supporting explicit light and dark selection.
6. Keep the outcome intentionally balanced, with research understanding and collaboration as the strongest homepage signals.

## 18. Immediate next actions

1. Create `codex/phase-1-astro-foundation` from the accepted Phase 0 commit.
2. Record a complete current URL manifest before changing the build system.
3. Verify and pin the current supported Astro, MDX, and React integration versions from official documentation.
4. Use Bun as the single package manager and remove the competing npm lockfile in the Astro foundation change.
5. Implement Astro tokens, layouts, collections, and the accepted homepage proof.
6. Migrate one simple essay and validate the evidence/island contracts with `rigid-body-motions` before bulk conversion.

## 19. Primary technical references

- [Astro components and client islands](https://docs.astro.build/en/basics/astro-components/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
- [Migrating from Next.js to Astro](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro deployment overview](https://docs.astro.build/en/guides/deploy/)

## Appendix A — current-system evidence

See [SYSTEM_AUDIT.md](./SYSTEM_AUDIT.md) for the route, content, component, deployment, media, and migration inventory used to draft this PRD.

See [COMPONENT_AND_MOTION_SYSTEM.md](./COMPONENT_AND_MOTION_SYSTEM.md) for the TRIBE-derived component architecture, motion vocabulary, authoring contracts, and initial build order.

See [PHASES.md](./PHASES.md) for the backup branch, working branch sequence, and phase exit gates.
