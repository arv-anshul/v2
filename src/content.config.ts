import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// TODO: Sync this with Astro 6
// import { iconSchema } from "@/lib/data-loaders/common";
const iconSchema = z
  .string()
  .regex(/^(lucide:|simple-icons:)/)
  .toLowerCase();

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: iconSchema,
    author: z.enum(["Anshul Raj Verma"] as const),
    date: z.date(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // TODO: Use z.httpUrl
    projectUrl: z.string().optional(),
    date: z.date().optional(),
    icon: iconSchema.optional(),
  }),
});

export const collections = { blog, projects };
