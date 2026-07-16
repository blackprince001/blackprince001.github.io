import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkNormalizePublicPaths from "./src/lib/remark-normalize-public-paths.mjs";

export default defineConfig({
  site: "https://blackprince001.github.io",
  output: "static",
  vite: {
    build: {
      // Complex Three.js islands share one deliberately lazy chunk. The generated-site
      // audit enforces a stricter raw and gzip budget for every emitted asset.
      chunkSizeWarningLimit: 850,
    },
  },
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkNormalizePublicPaths, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  integrations: [mdx(), react(), sitemap()],
});
