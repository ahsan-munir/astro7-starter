---
title: "Why Fast Sites Win"
description: "Core Web Vitals aren't a vanity metric — they're a ranking and conversion lever. Here's how this starter hits the budget by default."
pubDate: 2026-05-30
author: "Ahsan"
tags: ["performance", "seo", "core-web-vitals"]
draft: false
---

A site that loads in under two seconds doesn't just feel better — it ranks better and
converts better. This starter is built to the locked Core Web Vitals budget:

- **LCP < 2.0s** — the hero image is preloaded; fonts use `font-display: swap`.
- **CLS < 0.1** — every image carries explicit `width`/`height`, so nothing shifts.
- **INP < 200ms** — zero JS by default; islands only where interactivity is required.

Because these techniques are baked into the layout and components, every site built
from this starter inherits them. The QA checklist just verifies they fired.
