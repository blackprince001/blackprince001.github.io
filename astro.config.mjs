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
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkNormalizePublicPaths, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  integrations: [mdx(), react(), sitemap()],
});
