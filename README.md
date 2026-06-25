# AMBI Astro Starter

The locked starter every AMBI site is built from. It encodes three standards so each
new project inherits them **by construction** — you build by picking sections and
swapping the token file, not by re-solving SEO/perf/structure each time.

- **`00_dev-architecture.md`** — how it's built, hosted, edited, handed over.
- **`00_seo-standard.md`** — the technical SEO rules, baked into the layout/components.
- **`00_section-gallery.md`** — the kit of section parts, 1:1 with components.

> **New project = "Use this template" → new repo.** Then set `siteConfig`, swap
> `tokens.css`, write the real copy, and pick sections per page.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro check + static build → dist/
pnpm preview      # preview the production build
```

Requires **Node 20+** (see `.nvmrc`) and **pnpm** (pinned via `packageManager`).

### Per-project setup checklist

1. **`astro.config.mjs`** → set `site` (or the `SITE_URL` env var). Canonicals, sitemap,
   and OG tags depend on it.
2. **`src/lib/site.ts`** → brand name, nav, `sameAs` profiles, person details.
3. **`src/styles/tokens.css`** → swap colors/fonts/spacing = full rebrand.
4. **`src/content/`** → write real page + blog copy (Markdown).
5. Replace placeholder assets in `public/` (`favicon.svg`, `og-default.png`,
   `apple-touch-icon.png`).

---

## Content model — no CMS (Astro Markdown)

This starter ships the **no-CMS route** (dev-architecture §8 / §14): all text is managed
as **Markdown/MDX content collections** in `src/content/`, edited in Git by the developer.
There is **no Decap, no `/admin`, no Netlify Identity**.

- Schemas (the editable-field contract) live in `src/content.config.ts`.
- `pages/` holds editable page copy; `blog/` holds articles.
- **Adopt-if-needed:** to let a client self-edit, layer Decap on top of these same
  collections later — components don't change.

---

## How the standards map to the code

| Standard | Where it lives |
|---|---|
| Tech stack, repo structure (arch §1, §4) | `package.json`, `tsconfig.json`, `src/` tree |
| No-CMS content model (arch §3, §8) | `src/content.config.ts`, `src/content/` |
| Section ↔ component 1:1 (arch §5, gallery) | `src/components/sections/*` (variant props) |
| Design tokens / theming (arch §7) | `src/styles/tokens.css` + `global.css` `@theme` |
| SEO head: canonical, OG, robots, titles (seo §1, §5) | `src/components/seo/SEO.astro` |
| Schema / JSON-LD auto-emitted (seo §2) | `src/lib/schema.ts`, emitted by sections/templates |
| Sitemap + robots (seo §1) | `@astrojs/sitemap`, `src/pages/robots.txt.ts` |
| Core Web Vitals (seo §3) | `astro:assets`, font preload + swap, zero-JS default |
| Accessibility (arch §10) | skip link, focus states, semantic HTML, `<details>` FAQ |

### Schema coverage (emitted automatically)

`Organization`/`LocalBusiness` (layout, site-wide) · `WebSite` (home) · `Person` (about) ·
`BreadcrumbList` (inner pages) · `BlogPosting` (article template) · `FAQPage` (FAQ
section) · `Service` (Services section) · `Review` (Testimonial — only with
`verifiedReviews`).

---

## Sections (kit of parts)

`Hero` (variant `01`/`02`) · `Trust` · `Problem` · `Services` · `Why` · `Process` ·
`Work` · `Testimonial` · `Cta` · `Faq` · `Contact`.

Each is one presentational component fed by typed props; variations are `variant` props,
never forks. Add a new gallery variation → add a variant here (+ screenshot in the
gallery assets), never a one-off in a client repo.

---

## Hosting & deployment (arch §11)

- **Primary: Netlify.** Continuous deploy from the repo; `main` → production, deploy
  previews on PRs. Build command `pnpm build`, publish `dist/`.
- **Fallback: Cloudflare Pages.** Same build; use when cost/scale or client preference
  favors it.
- `dist/` is built by the host — never committed (see `.gitignore`).

### Contact form

`Contact.astro` posts to a configurable `action`. Wire it to Netlify Forms or Formspree
per project; it's an inert demo form until then.

---

**Owner:** Ahsan · Built to the LOCKED AMBI standards. Document any per-project deviation
in that project's notes.
