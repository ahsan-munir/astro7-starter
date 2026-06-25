import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* =============================================================================
   Content collections — type-safe, Markdown/MDX, edited in Git.
   (dev-architecture §3, §4, §8 "No-CMS option")

   This starter ships the NO-CMS route: all text is managed here as Markdown/MDX
   content, edited by the developer in Git. There is no Decap, no /admin, no
   Netlify Identity. To adopt Decap later (client self-editing), add public/admin
   config pointing at these same collections — the schema below is the contract.
   ============================================================================= */

// Reusable SEO block — every page/post supplies these (seo-standard §5).
// Kept `.optional()` (not `.default({})`) so the inferred type stays a full
// object shape; pages access fields with optional chaining (`seo?.title`).
const seo = z
  .object({
    title: z.string().optional(), // falls back to entry `title`
    description: z.string().max(170).optional(),
    ogImage: z.string().optional(), // path/URL to 1200x630 OG image
    noindex: z.boolean().optional(), // robots noindex (seo-standard §1)
    canonical: z.string().url().optional(),
  })
  .optional();

// pages — editable page content/data, one entry per route.
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seo,
    draft: z.boolean().default(false),
  }),
});

// blog — client/author articles → BlogPosting schema + blog/[slug] route.
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(), // optimized via astro:assets (seo-standard §3)
      coverAlt: z.string().default(""),
      author: z.string().default("Ahsan"),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      seo,
    }),
});

export const collections = { pages, blog };
