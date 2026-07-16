# blackprince

Prince Kwabena Appiah Boadu’s static portfolio, research archive, and technical journal. The production site is built with Astro; React is retained only for interactive article islands such as simulations, graphs, quizzes, and code runners.

## Local development

The project uses Bun 1.3.14 and a single `bun.lock`.

```bash
bun install --frozen-lockfile
bun run dev
```

The local site runs at `http://localhost:4321`.

## Verification

```bash
bun run verify
bun audit --production
```

`verify` type-checks Astro/shared source, builds the complete static artifact, and audits all generated pages for internal link/media integrity, metadata, headings/landmarks, alt text, deferred video, machine-readable endpoints, zero-framework-JS core routes, and asset budgets.

## Content authoring

- Long-form writing: `src/content/*.mdx`
- Shorts: `src/content/shorts/*.mdx`
- Projects: `src/data/featured-projects.json`
- Flagship case studies: `src/lib/flagship-stories.ts`
- Manuscripts: `src/data/publications.json`
- Reading: `src/data/reading.json`

Public media belongs in `public/`. Existing MDX may use the legacy `../asset` convention; the Astro processor normalizes it to a root-relative public URL and the generated-site audit verifies the target.

Use Astro components for structure and static presentation. Add a React island only when the feature requires client state or a browser-only rendering engine, and prefer `client:visible` for heavy demonstrations below the fold.

## Delivery

Pull requests build and retain an Astro preview artifact. A push to `master` runs the same verification gate and deploys `dist` to GitHub Pages.

The redesign decisions, phase checkpoints, and release/rollback procedure live in [`docs/redesign`](./docs/redesign/index.md).
