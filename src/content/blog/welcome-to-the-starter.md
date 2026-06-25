---
title: "Welcome to the AMBI Astro Starter"
description: "How content works in this starter: pure Astro Markdown, edited in Git, with SEO and schema baked in by construction."
pubDate: 2026-06-24
author: "Ahsan"
tags: ["starter", "astro", "workflow"]
draft: false
seo:
  description: "A walkthrough of the no-CMS content model in the AMBI Astro starter — Markdown content collections, type-safe schemas, and automatic SEO."
---

This starter ships with the **no-CMS content model**: every piece of text lives as
Markdown (or MDX) inside `src/content/`, type-checked against the schema in
`src/content.config.ts`, and edited in Git by the developer.

## Why no CMS?

For projects where the client won't self-edit — or the site is essentially static —
skipping Decap removes a whole layer of auth, config, and moving parts while keeping
everything else identical. If a project later needs client self-editing, Decap can be
layered on top of these same collections without changing the components.

## What you get for free

- **Type-safe content** — the schema rejects malformed front-matter at build time.
- **Automatic SEO** — canonical, title template, OG/Twitter cards, robots meta.
- **Automatic schema** — this post emits `BlogPosting` JSON-LD with no extra work.
- **Optimized images** — `astro:assets` emits WebP/AVIF with explicit dimensions.

Write a new article by dropping another `.md` file in this folder. That's the whole flow.
