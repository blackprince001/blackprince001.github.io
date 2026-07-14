import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://blackprince001.github.io",
  output: "static",
  integrations: [mdx(), react(), sitemap()],
});
