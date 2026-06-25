/* =============================================================================
   JSON-LD schema builders. (seo-standard §2)
   Schema is emitted BY components/templates, not hand-written per project:
   add the section → get the schema. These helpers return plain objects that
   components serialize into <script type="application/ld+json">.
   ============================================================================= */
import { siteConfig } from "./site";

type Json = Record<string, unknown>;

/** Absolute URL from a path, given the site origin. */
export function abs(path: string, site: string | URL): string {
  return new URL(path, site).toString();
}

/** Organization / LocalBusiness — site-wide (rendered in the layout). */
export function organizationSchema(site: string | URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": siteConfig.schemaType,
    name: siteConfig.name,
    url: abs("/", site),
    description: siteConfig.defaultDescription,
    sameAs: siteConfig.sameAs,
  };
}

/** WebSite — home page. */
export function websiteSchema(site: string | URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: abs("/", site),
  };
}

/** Person — About page (E-E-A-T). */
export function personSchema(site: string | URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.person.name,
    jobTitle: siteConfig.person.jobTitle,
    ...(siteConfig.person.qualifications
      ? { hasCredential: siteConfig.person.qualifications }
      : {}),
    url: abs("/about", site),
    sameAs: siteConfig.sameAs,
  };
}

/** BreadcrumbList — inner pages. */
export function breadcrumbSchema(
  items: { name: string; href: string }[],
  site: string | URL,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.href, site),
    })),
  };
}

/** BlogPosting — blog article template. */
export function blogPostingSchema(
  post: {
    title: string;
    description: string;
    slug: string;
    pubDate: Date;
    updatedDate?: Date;
    author: string;
    image?: string;
  },
  site: string | URL,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: abs(`/blog/${post.slug}`, site),
    datePublished: post.pubDate.toISOString(),
    ...(post.updatedDate ? { dateModified: post.updatedDate.toISOString() } : {}),
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": siteConfig.schemaType, name: siteConfig.name },
    ...(post.image ? { image: abs(post.image, site) } : {}),
  };
}

/** FAQPage — emitted by the FAQ gallery section. */
export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Service — emitted by the Services gallery section / service pages. */
export function serviceSchema(
  services: { name: string; description: string }[],
  site: string | URL,
): Json[] {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@type": siteConfig.schemaType, name: siteConfig.name, url: abs("/", site) },
  }));
}
