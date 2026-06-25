/* =============================================================================
   Site-wide config — the single source of truth for brand, SEO defaults, and the
   data that drives site-wide schema (Organization/Person). Set this per project.
   (dev-architecture §8, seo-standard §2 & §5)
   ============================================================================= */

export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  /** Brand name — used in <title> template "{Page} | {Brand}". */
  name: "AMBI Studio",
  /** Short tagline / default description. */
  tagline: "Fast, modern websites that win you customers.",
  defaultDescription:
    "I design and build fast, modern websites for businesses that want their site to actually do a job — not just look nice.",

  /** Type of entity for site-wide schema: "Organization" or "LocalBusiness". */
  schemaType: "Organization" as "Organization" | "LocalBusiness",

  /** Default OG image (1200x630), relative to site root. */
  defaultOgImage: "/og-default.png",

  /** Locale for OG + html lang. */
  locale: "en",
  ogLocale: "en_US",

  /** Twitter handle for twitter:site (optional). */
  twitter: "",

  /** E-E-A-T: external profiles → schema `sameAs` + footer links (seo-standard §2).
      Sourced from 01a_personal-brand-intake.md §8. */
  sameAs: [
    "https://www.linkedin.com/in/example",
    "https://github.com/example",
  ],

  /** The person behind the brand → Person schema on About (seo-standard §2). */
  person: {
    name: "Ahsan",
    jobTitle: "Web Designer & Developer",
    qualifications: "",
  },

  /** Primary navigation. */
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
} as const;

export type SiteConfig = typeof siteConfig;
