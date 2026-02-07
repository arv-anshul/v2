// @ts-check

import mdx from "@astrojs/mdx";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import yaml from "@rollup/plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";

// https://astro.build/config
export default defineConfig({
  site: "https://arv-anshul.github.io",
  base: "/v2",
  server: {
    port: 3000,
  },
  integrations: [icon(), mdx()],
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
  redirects: {
    "/about": "/",
    "/resume":
      "https://cdn.jsdelivr.net/gh/arv-anshul/resume@main/pdf/basic.pdf",
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [[remarkGfm, { singleTilde: false }], remarkGithubAlerts],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [
        rehypePrettyCode,
        {
          theme: "dark-plus",
          transformers: [
            transformerCopyButton({
              visibility: "hover",
              feedbackDuration: 2500,
            }),
          ],
        },
      ],
    ],
  },
});
