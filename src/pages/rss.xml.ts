import { getCollection } from "astro:content";
import rss, { type RSSOptions } from "@astrojs/rss";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

export async function GET(context: RSSOptions) {
  const parser = new MarkdownIt();
  parser.use(
    await Shiki({
      langAlias: {
        math: "latex",
      },
      themes: {
        light: "light-plus",
        dark: "dark-plus",
      },
    })
  );

  const blog = await getCollection("blog");
  const projects = await getCollection("projects");

  // Combine both collections
  const allContent = [
    ...blog.map((post) => ({
      ...post.data,
      link: `/v2/blog/${post.id}`,
      content: sanitizeHtml(parser.render(post.body || ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      // Add a category or type field to distinguish content types
      category: "blog",
    })),
    ...projects.map((project) => ({
      ...project.data,
      link: `/v2/projects/${project.id}`,
      content: sanitizeHtml(parser.render(project.body || ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      // Add a category or type field
      category: "project",
    })),
  ];

  // Sort by date (newest first)
  allContent.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "ARV's Blog",
    description:
      "A Data Scientist passionate about harnessing GenAI to solve real-world problems.",
    site: context.site,
    items: allContent,
    customData: "<language>en-us</language>",
    trailingSlash: false,
  });
}
