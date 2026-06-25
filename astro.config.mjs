import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// IMPORTANT: set `site` per project — canonical URLs, sitemap, and OG tags depend on it.
// (dev-architecture §10–11, seo-standard §1 & §5)
const SITE = process.env.SITE_URL ?? "https://example.com";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Trailing-slash policy kept consistent site-wide (seo-standard §4).
  trailingSlash: "never",
  build: {
    // Cleaner URLs: /about instead of /about/index.html
    format: "file",
  },
  integrations: [
    mdx(),
    sitemap({
      // Exclude utility/noindex routes from the sitemap (seo-standard §1).
      filter: (page) => !/\/(404|thank-you|admin)(\/|$)/.test(page),
    }),
  ],
  vite: {
    // Tailwind v4 is a Vite plugin (no JS tailwind.config; theme lives in CSS — see src/styles).
    plugins: [tailwindcss()],
  },
  // Astro's built-in image service (sharp): WebP/AVIF, responsive srcset (seo-standard §3).
  image: {
    responsiveStyles: true,
  },
});
