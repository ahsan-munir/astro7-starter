import type { APIRoute } from "astro";

/**
 * robots.txt — generated, references the sitemap, blocks utility paths.
 * (seo-standard §1)
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site).toString();
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /thank-you

Sitemap: ${sitemap}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
