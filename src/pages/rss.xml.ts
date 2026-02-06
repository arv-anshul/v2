import { getCollection } from "astro:content";
import rss, { type RSSOptions } from "@astrojs/rss";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

export async function GET(context: RSSOptions) {
  const blog = await getCollection("blog");
  const parser = new MarkdownIt();
  parser.use(
    await Shiki({
      themes: {
        light: "light-plus",
        dark: "dark-plus",
      },
    })
  );

  return rss({
    title: "ARV's Blog",
    description:
      "A Data Scientist passionate about harnessing GenAI to solve real-world problems.",
    site: context.site,
    items: blog.map((post) => ({
      ...post.data,
      link: `/v2/blog/${post.id}`,
      content: sanitizeHtml(parser.render(post.body || ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
    customData: "<language>en-us</language>",
    trailingSlash: false,
  });
}
