import { type CollectionEntry, getCollection } from "astro:content";
import { extractResourceUrls, Renderer } from "@takumi-rs/core";
import { fetchResources } from "@takumi-rs/helpers";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import type { GetStaticPaths } from "astro";
import { html } from "satori-html";
import getIconSVGString from "@/lib/icon-svg";

async function getImageBuffer(
  url: string,
  data: CollectionEntry<"blog">["data"]
) {
  // Convert <svg> component into data URI to render it via <img> tag
  const calendarIcon = await getIconSVGString("lucide:calendar");
  const calendarIconUri = `data:image/svg+xml,${encodeURIComponent(calendarIcon.replace(/currentColor/g, "#a1a1aa"))}`;

  const userIcon = await getIconSVGString("lucide:user-pen");
  const userIconUri = `data:image/svg+xml,${encodeURIComponent(userIcon.replace(/currentColor/g, "#a1a1aa"))}`;

  const mainIcon = await getIconSVGString(data.icon);
  const iconDataUri = `data:image/svg+xml,${encodeURIComponent(mainIcon.replace(/currentColor/g, "#ffffff"))}`;

  const markup = html`
      <!-- Card -->
      <div tw="flex flex-col justify- w-full h-full rounded-3xl border-4 border-zinc-700 bg-zinc-900 p-10 pb-6">
        <!-- Header row -->
        <div tw="flex justify-between items-start w-full">
          <!-- Title + Meta -->
          <div tw="flex flex-col">
            <h1 tw="text-7xl mt-0 mb-2 font-bold text-white leading-tight">${data.title}</h1>
            <div tw="flex gap-2 items-center text-zinc-400">
              <img src="${calendarIconUri}" tw="h-6 w-6" />
              <span tw="text-lg mr-4"> ${data.date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })} </span>
              <img src="${userIconUri}" tw="h-6 w-6" />
              <span tw="text-lg">${data.author}</span>
            </div>
          </div>
          <!-- Icon -->
          <div tw="flex items-center justify-center w-28 h-28 rounded-xl bg-zinc-800">
            <img src="${iconDataUri}" tw="h-20 w-20" />
          </div>
        </div>
        <!-- Description -->
        <p tw="text-2xl mb-auto text-zinc-400 leading-relaxed overflow-hidden"> ${data.description} </p>
        <!-- Footer -->
        <p tw="text-zinc-600 text-2xl mb-0 text-end">${url.replace("/og.webp", "")}</p>
      </div>
  `;

  const node = await fromJsx(markup);
  const urls = extractResourceUrls(node);
  const fetchedResources = await fetchResources(urls);

  const renderer = new Renderer();
  const png = await renderer.render(node, {
    width: 1200,
    height: 630,
    fetchedResources,
    format: "webp",
  });
  return png.buffer as ArrayBuffer;
}

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { post: post.id },
    props: post.data,
  }));
}) satisfies GetStaticPaths;

export const GET = async ({
  request,
  props,
}: {
  props: CollectionEntry<"blog">["data"];
  request: Request;
}) => {
  const imageBuffer = await getImageBuffer(request.url, props);
  return new Response(imageBuffer);
};
