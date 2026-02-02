// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import yaml from "@rollup/plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

// https://astro.build/config
export default defineConfig({
  site: "https://arv-anshul.github.io",
  server: {
    port: 3000,
  },
  integrations: [
    react(),
    icon(),
    mdx({
      extendMarkdownConfig: false,
      syntaxHighlight: false,
      remarkPlugins: [
        remarkGfm, // Tables, strikethrough, autolinks, etc.
        remarkSmartypants, // Smart quotes, dashes
      ],
      rehypePlugins: [
        rehypeSlug, // Add IDs to headings
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: { className: ["heading-link"] },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
          },
        ],
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
});
