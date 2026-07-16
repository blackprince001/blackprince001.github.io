---
type: Design System Reference
title: Component and motion system
description: Visual foundations, component contracts, and motion rules for the Astro redesign.
tags:
  - design-system
  - components
  - motion
timestamp: 2026-07-14
---

# Component and motion system

Status: Phase 3 accepted / v0.6
Prepared: 2026-07-14
Scope: Astro redesign and future technical writing

## Purpose

Build a reusable authoring system for essays, project stories, research explainers, and interactive demonstrations. The system should preserve the current site's minimal, professional document structure while allowing selected work to use stronger evidence, control, and comparison components without building a bespoke page each time.

The component system must protect four things:

1. clear editorial hierarchy
2. composable technical storytelling
3. accessible interaction and reduced-motion parity
4. static-first Astro delivery with selective React islands

## What TRIBE v2 is doing well

The rendered TRIBE v2 page uses a repeatable composition rather than an unstructured cinematic canvas.

- A fixed, minimal header separates identity from resource links.
- A high-impact hero pairs a central research statement with a large demonstration surface.
- Desktop content becomes a two-surface reader: a narrative rail of roughly 768px and a persistent visualization/control region.
- Chapters are close to viewport height, have strong titles, and expose previous/next stepping without preventing normal scrolling.
- Figures are staged as primary evidence, not decorations inserted between paragraphs.
- Controls use compact groups: mode select, segmented states, view toggles, playback, scrubber, and expand action.
- Resource actions repeat at the beginning and end: demo, paper, code, and model.
- Mobile collapses to one linear column rather than preserving the desktop spectacle at the expense of reading.

Observed visual characteristics at a 1280px viewport:

- black canvas with white text and low-contrast secondary copy
- approximately 48px display heading, 36px chapter headings, and 16px body copy
- compact 13–14px control labels
- pill actions and circular icon controls over translucent black surfaces
- short 150–200ms color/transform feedback on controls
- minimum-height chapters and desktop scroll-snap hints

We should translate the component craft, not Meta's page structure, brand font, brain imagery, exact black treatment, or control styling.

## Phase 0 direction decision

The three homepage studies established that a large-format TRIBE-like composition overwhelms the personal, professional character of this site. The redesign will therefore retain the current site's restrained editorial structure: familiar navigation, direct introduction, selected work, writing, and research in a clear document flow.

The useful influence from TRIBE is at component level:

- carefully framed technical media with captions and state labels
- compact segmented controls for changing evidence views
- comparison, playback, and inspection controls where the content requires them
- small technical labels, metrics, and architecture sequences
- grouped links that keep papers, code, demos, and write-ups connected
- short state-preserving transitions with complete reduced-motion behavior

These elements should feel like precise instruments placed inside a calm page. They must not turn every route into an exhibit or create a second visual identity.

Routine horizontal rules are not part of the visual language. Section changes should be communicated through whitespace, alignment, labels, and type hierarchy. Borders remain appropriate when they define the boundary or affordance of an actual object such as a media frame, control, input, or dialog.

## Our interpretation

Use one restrained site language with two levels of technical density.

### Notebook mode

Default for essays, shorts, reading, ordinary project pages, and indexes.

- calm paper/graphite surfaces
- conventional document flow
- optional table of contents and margin notes
- restrained figures and demonstrations within the reading column
- almost no entrance motion

### Exhibit mode

Opt-in for flagship projects and research explainers.

- high-contrast scene surface
- narrative chapters paired with a sticky or persistent evidence stage on wide screens
- guided comparisons, modes, figures, metrics, and demonstrations
- named, purposeful motion for explanation and continuity
- linear, non-sticky reading order on narrow screens

Exhibit mode is a layout capability, not a separate website or a license to animate everything.

## Architecture layers

### 1. Tokens

Tokens are CSS custom properties organized as primitive, semantic, and component layers.

Primitive tokens hold raw values. Semantic tokens describe purpose. Component tokens exist only where a component needs a stable local contract.

Required token groups:

- color: canvas, surface, surface-raised, text, text-muted, border, accent, focus, scrim
- typography: display, body, mono; size, leading, tracking, and weight scales
- spacing: page gutter, reading measure, section rhythm, control gaps
- shape: control, panel, media, and pill radii
- depth: sticky chrome, floating controls, modal, and media-stage elevation
- motion: durations, easing curves, spring behavior, and reduced-motion substitutions
- layout: reading measure, wide measure, exhibit narrative width, stage width, and header height

Tokens must be semantic: `--surface-exhibit`, not `--black`; `--text-muted`, not `--gray-500` at component call sites.

### 2. Primitives

Small components with stable semantics and little product opinion:

- `Container`
- `Stack`
- `Cluster`
- `Grid`
- `VisuallyHidden`
- `Action`
- `IconAction`
- `Tag`
- `Divider`
- `Surface`
- `MediaFrame`

Use native elements and Astro components by default. A primitive becomes React only when its behavior requires client state.

### 3. Editorial patterns

Reusable combinations for most pages:

- `SiteHeader`
- `SiteFooter`
- `PageIntro`
- `ArticleHeader`
- `ArticleShell`
- `ArticleProse`
- `TableOfContents`
- `Figure`
- `FigureGroup`
- `Sidenote`
- `Callout`
- `ProcessSteps`
- `MetricGroup`
- `ResourceLinks`
- `RelatedContent`

### 4. Exhibit patterns

Patterns inspired by the structure of TRIBE v2 but owned by this project:

- `ResearchHero` — statement, summary, hero media, and primary resources
- `ExhibitShell` — narrative rail plus evidence stage on wide screens
- `ResearchChapter` — addressable chapter with title, body, evidence slot, and optional stepping
- `ChapterStepper` — previous/next anchor navigation; normal document scrolling remains available
- `EvidenceStage` — sticky figure, video, chart, model, or interactive demonstration
- `DemoFrame` — loading, fallback, error, active, and expanded states around an island
- `ModeSwitcher` — select or tabs for meaningful dataset/view modes
- `SegmentedControl` — small mutually exclusive state choice
- `CompareStage` — true/predicted, before/after, baseline/model, or A/B comparison
- `MediaSequence` — previous/next/playback/scrubber for ordered evidence
- `ArchitectureSequence` — numbered pipeline or system stages connected to a figure
- `FindingCards` — a small set of named improvements or findings; not a generic card grid
- `MetricStory` — metric, context, comparison, and source
- `ResearchCTA` — repeated links to demo, paper, source, data, or model

### 5. Interactive islands

React remains appropriate for:

- Three.js and React Three Fiber demonstrations
- graphing and simulations
- direct manipulation and scrubbers with complex state
- quizzes and code runners
- full PDF viewing
- complex compare views

The Astro pattern owns the accessible label, fallback, caption, loading state, and surrounding layout. The React island owns only the interactive engine.

## Component boundary rules

1. Keep a component local until its meaning or behavior repeats.
2. Promote a pattern after two real uses confirm a stable concept; visual similarity alone is insufficient.
3. Prefer slots and children over growing sets of boolean props.
4. Use explicit semantic variants such as `tone="exhibit"` or `layout="split"`; avoid flags such as `dark`, `rounded`, `animated`, and `compact` that can conflict.
5. Separate content data from presentation state.
6. Wrap third-party primitives behind project-owned components before they become authoring APIs.
7. Every public component documents default, focus, active, disabled, loading, empty, error, expanded, and reduced-motion behavior where applicable.
8. A component is not reusable until it has an example using real site content.

## Phase 2 implemented editorial primitives

- `TagPill` is the single taxonomy and status presentation across writing, shorts, projects, manuscripts, reading, and article metadata. It uses a compact text-only badge, a deterministic restrained tone per label, and supports static, link, and filter-button semantics.
- `FloatingToc` adapts the compact indicator-bar pattern to a press-mode Astro control. It tracks H2/H3 position, exposes a native navigation list, closes with Escape and outside press, restores focus, and becomes a labeled floating control on narrow screens.
- Writing search remains a small progressive-enhancement script: the complete article list exists in static HTML, while title, summary, and tag filtering update an announced result count.
- Projects retain the established featured/open-source hierarchy. The full archive restores the backup design's text-and-media split, two-up supporting media, responsive remainder gallery, image viewer, local video controls, and privacy-enhanced YouTube embeds. Homepage summaries deliberately retain the quieter single-image treatment. The repository archive progressively loads, sorts, and paginates GitHub data with an explicit fallback link.
- Article tables are centered as objects and center their cell content while retaining horizontal overflow for genuinely wide data.

## Phase 3 implemented exhibit primitives

- `ResearchHero` combines the core claim, compact taxonomy, repeatable resources, and primary system evidence without introducing a separate visual identity.
- `MetricGroup` presents a measured result together with its label and interpretive context; a large number is never left to imply its own meaning.
- `ResearchChapter` and `EvidenceStage` form the stable wide-screen narrative/evidence pair. Sticky behavior belongs to the chapter boundary and is removed on narrow screens.
- `ResourceLinks` provides the same write-up, source, and deployment actions at the beginning and end of a story.
- Flagship content is typed data, while structure stays in Astro components. Oware and Flood-It are the two validating uses required before these patterns are considered reusable.
- Chapter reveals use a short opacity/translation transition only after enhancement is ready. Reduced motion and no-JavaScript rendering both retain complete, visible content.

## Suggested project structure

```text
src/
  components/
    primitives/
    editorial/
    exhibit/
    islands/
  layouts/
    BaseLayout.astro
    ArticleLayout.astro
    ExhibitLayout.astro
  styles/
    tokens.css
    global.css
    prose.css
    motion.css
  content/
    essays/
    shorts/
    projects/
    publications/
  pages/
    system/
      components.astro
      motion.astro
```

The `/system` routes are development-only documentation and test fixtures. They should display every component state, theme, viewport behavior, and motion reduction.

## Authoring model

A regular essay should require only frontmatter and Markdown. Rich components are opt-in.

Conceptual exhibit composition:

```mdx
<ResearchHero
  eyebrow="Robotics · Geometry"
  title="Rigid Body Motions"
  summary="A visual guide to frames, rotations, twists, and screws."
  resources={resources}
>
  <RotationFrameDemo />
</ResearchHero>

<ExhibitShell>
  <ResearchChapter id="frames" title="Start with the frame">
    The narrative remains ordinary MDX.
    <Figure src={frameImage} alt="..." />
  </ResearchChapter>

  <ResearchChapter id="axis-angle" title="One axis, one angle">
    <ArchitectureSequence items={axisAngleSteps} />
    <AxisAngleDemo />
  </ResearchChapter>
</ExhibitShell>
```

The final Astro/MDX API may differ, but the author should compose domain concepts—not layout divs, animation classes, or hydration internals.

## Motion principles

Motion exists to:

- preserve spatial continuity
- show state change
- explain a technical relationship
- provide immediate feedback
- prevent a jarring replacement

If a motion does none of those, remove it.

Ordinary UI motion should be short. Long motion is reserved for explanatory sequences the visitor intentionally enters.

## Motion vocabulary and specifications

| Pattern | Named motion | Trigger and behavior | Timing | Reduced-motion equivalent |
|---|---|---|---|---|
| Button/action | Press feedback | acknowledge pointer-down with restrained scale and color; hover only for fine pointers | 100–140ms, strong ease-out | color/contrast feedback without scale |
| Popover/menu | Origin-aware animation | fade and scale from the trigger's transform origin | 140–190ms enter, faster exit | short fade |
| Hero content | Reveal + short stagger | reveal title, summary, and actions in reading order once the hero is ready | 350–550ms; 40–60ms stagger | content appears immediately or fades together |
| Figure entrance | Reveal | clip or mask uncovers evidence once when it enters the reading context | 450–700ms explanatory ease-out | 150ms opacity fade |
| Mode change | Crossfade | old and new evidence overlap briefly; optional blur up to 2px hides the seam | 160–240ms | faster crossfade or instant replacement |
| Chapter change | Direction-aware transition | optional guided stepping moves in the navigation direction; normal scroll is never hijacked | 220–320ms | instant anchor jump with focus update |
| Expand demo | Shared element/view transition | the same demo frame expands into a dialog or full viewport and returns to its origin | 280–420ms ease-in-out | crossfade between inline and expanded states |
| Responsive/reordered content | Layout animation | preserve identity when a control group or selected indicator changes position | 160–240ms ease-in-out | instant layout change |
| Pipeline stages | Stagger/orchestration | stages enter in causal order only when the sequence is being explained | 40–80ms between stages | show all stages together |
| Compare slider | Direct manipulation | divider tracks pointer 1:1; no transition while dragging; preserve grab offset | pointer-synchronous | range input and buttons remain fully functional |
| Scrubber release | Spring | only when snapping is required; critically damped by default and velocity-aware | response 0.3–0.4, no bounce by default | immediate snap |
| Metric update | Number ticker | only for a value that changes after user input; use tabular numbers | 250–500ms | replace value instantly with live-region announcement when needed |

## Motion implementation policy

Preferred order:

1. CSS transitions for hover, press, selection, and simple state changes
2. CSS `@starting-style`, clip paths, and masks for predetermined entrances
3. Web Animations API for programmatic but compositor-friendly sequences
4. browser View Transitions for shared-element page or expansion continuity where support and fallback are acceptable
5. Motion/Framer Motion only inside React islands that require interruption, velocity, springs, or complex layout state
6. requestAnimationFrame only for direct manipulation or visualization loops that cannot use the options above

Rules:

- animate `transform` and `opacity` by default
- never use `transition: all`
- never enter from `scale(0)`
- never use `ease-in` for responsive UI entry
- keep ordinary UI transitions below 300ms
- do not animate frequent keyboard-triggered actions
- do not block interaction during stagger or transition
- gate hover motion behind `(hover: hover) and (pointer: fine)`
- start interruptible motion from the currently presented value, not an old target
- use critically damped springs unless a real gesture supplied momentum
- no default parallax, autoplaying ambient loop, typewriter effect, or scroll hijacking

Motion tokens:

```css
:root {
  --motion-instant: 0ms;
  --motion-press: 120ms;
  --motion-ui: 180ms;
  --motion-layout: 240ms;
  --motion-explain: 520ms;
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

Values are starting points to tune during the Astro proof slice, not immutable truths.

## Exhibit layout behavior

### Wide

- narrative rail and evidence stage sit side by side
- evidence stage may remain sticky within the current chapter group
- chapters use generous vertical rhythm and may use proximity-based snap only as an enhancement
- stage controls stay adjacent to the evidence they affect

### Medium

- evidence may alternate above or below its chapter
- sticky behavior is used only if it does not crowd the reading measure
- control groups wrap without hiding options

### Narrow

- one linear document order
- evidence follows the paragraph that introduces it
- no required sticky stage or scroll snap
- expanded demos use a proper dialog/fullscreen surface with an obvious close action
- all compare and scrub controls remain usable with touch and keyboard

## Accessibility contract

- Chapter stepping is supplemental; headings and normal document navigation remain primary.
- Each evidence stage has a heading or accessible label, caption, and non-interactive explanation.
- Compare stages use a native range input or equivalent keyboard-operable control.
- Media sequences expose previous, next, play/pause, position, and status programmatically.
- Animations never hide focus or change context without user action.
- Reduced motion removes large travel, parallax, spring overshoot, and stagger delay.
- Reduced transparency replaces blurred chrome with a more opaque surface.
- Increased contrast strengthens surfaces, borders, focus, and selected state.
- Video receives captions/transcripts where speech or meaningful audio exists.
- Canvas/WebGL demonstrations include a textual explanation and fallback image.

## Performance contract

- Notebook pages ship no component-library runtime.
- Exhibit patterns are Astro HTML/CSS unless they need live state.
- React islands hydrate when visible or on explicit launch unless immediate interaction requires otherwise.
- Each island has a static poster/fallback before hydration.
- Do not load a 3D engine, PDF engine, or code runner on pages that do not use it.
- Pause offscreen animation and rendering loops.
- Avoid simultaneous blur, large shadow, and full-screen transforms on low-power devices.
- A new motion effect must be profiled in the context where media and visualization are also running.

## Initial component build order

1. Token foundation and theme contract
2. `Container`, `Stack`, `Cluster`, `Action`, `IconAction`, `Surface`, `MediaFrame`
3. `ArticleShell`, `ArticleHeader`, `Figure`, `ResourceLinks`, `RelatedContent`
4. `ResearchHero`, `ExhibitShell`, `ResearchChapter`, `EvidenceStage`
5. `ModeSwitcher`, `SegmentedControl`, `ChapterStepper`, `DemoFrame`
6. `CompareStage`, `MediaSequence`, `ArchitectureSequence`, `MetricStory`
7. Adapt existing Three.js, graph, quiz, and code-runner components behind island wrappers
8. Build the component and motion reference routes using real content

## Proof components for the Astro foundation

Use `rigid-body-motions` to validate:

- `ResearchHero`
- `ExhibitShell`
- `ResearchChapter`
- `EvidenceStage`
- `ArchitectureSequence`
- `DemoFrame`
- `ChapterStepper`
- `ResourceLinks`
- one shared-element demo expansion
- one staged figure reveal
- reduced-motion and no-JavaScript fallbacks

## Completion criteria

- A normal essay does not inherit exhibit complexity.
- Exhibit mode works as a readable linear document without JavaScript.
- Component APIs contain domain language rather than styling flags.
- Every interactive pattern has keyboard, touch, focus, loading, error, and reduced-motion behavior.
- Motion reference examples document trigger, target, origin, properties, easing/spring, interruption, and fallback.
- No animation blocks reading or delays a frequent action.
- The complex robotics proof page stays within the performance budgets in the PRD.
