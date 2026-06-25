# Decap CMS — the three backends, explained

This folder turns the starter into a self-editable site. The client logs in at
`/admin`, edits the `pages` and `blog` content, and Decap **commits the changes
back to Git** — which triggers a rebuild and deploy. No database, no server.

The **fields** (`config.yml`) are the same no matter which backend you pick.
Only the `backend:` block and the login mechanism change. Below are all three,
when to use each, and the exact steps.

> The fields in `config.yml` mirror `src/content.config.ts`. If you edit one,
> edit the other, or the CMS can save front-matter that fails the build.

---

## 0. Preview it right now (local backend) — no auth, no host

This works today, before you decide anything. `local_backend: true` is already
in `config.yml`.

```bash
npx decap-server   # terminal 1 — the local Git proxy (port 8081)
pnpm dev           # terminal 2 — Astro on http://localhost:4321
```

Open <http://localhost:4321/admin>. No login. Edits write **straight to your
local files** (commit them yourself with Git). This is purely for development /
trying the editor UI — it is NOT a production backend.

When you ship, the production backend (one of the two below) takes over; keep
`local_backend: true` for dev convenience or remove it.

---

## Which backend for a real client? (quick guide)

| Backend | Host | Setup effort | Best for |
|---|---|---|---|
| **GitHub OAuth** | Any (Vercel, Cloudflare, Netlify…) | Medium (needs an OAuth proxy) | You control hosting; want host-independence |
| **Netlify Identity (git-gateway)** | Netlify only | Low (all in dashboard) | Site is on Netlify; want the simplest invite-a-user flow |
| Local backend | n/a (dev only) | None | Trying the editor; you edit, not the client |

Rule of thumb: **on Netlify → git-gateway. Anywhere else → GitHub OAuth.**

---

## 1. GitHub OAuth  (host-independent — current default in `config.yml`)

The client logs in **with their GitHub account**. They must be a collaborator on
the repo. Works on any host. The catch: GitHub's OAuth needs a server to do the
token exchange, so you run a tiny **OAuth proxy** (deploy-once, reuse forever).

`config.yml` is already set to this:

```yaml
backend:
  name: github
  repo: ahsan-munir/astro7-starter
  branch: main
```

### Steps
1. **Create a GitHub OAuth app**
   GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*.
   - Homepage URL: your site, e.g. `https://yoursite.com`
   - Authorization callback URL: your proxy's callback (from step 2)
   - Save the **Client ID** and **Client Secret**.
2. **Deploy an OAuth proxy.** Easiest options (pick one, deploy once):
   - Cloudflare Workers: `https://github.com/sterlingwes/decap-proxy`
   - Vercel/Netlify Function: `https://github.com/ublabs/netlify-cms-oauth` (works for Decap too)
   Set the proxy's env vars to your Client ID + Secret. Note its base URL.
3. **Point Decap at the proxy** — add `base_url` (and `auth_endpoint` if the
   proxy docs require it) under `backend:`:
   ```yaml
   backend:
     name: github
     repo: ahsan-munir/astro7-starter
     branch: main
     base_url: https://your-oauth-proxy.example.com
   ```
4. **Add the client** as a repo collaborator (Settings → Collaborators).
5. Deploy the site. They visit `/admin` → "Login with GitHub".

You can keep `local_backend: true` for your own dev; it's ignored in production.

---

## 2. Netlify Identity + Git Gateway  (easiest, Netlify-only)

The client logs in with an **email/password you invite them with** — no GitHub
account needed. Netlify's "Git Gateway" is the proxy, so there's nothing to
self-host. Only works when the site is **deployed on Netlify**.

### Swap in `config.yml`
Replace the `backend:` block with:

```yaml
backend:
  name: git-gateway
  branch: main
```

Keep the Netlify Identity `<script>` in `index.html` (it's already there). You
also want this snippet on your **public site** so first-time invite links land
correctly — add to `src/layouts/BaseLayout.astro` `<head>` (or just the home page):

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

### Steps (all in the Netlify dashboard)
1. Deploy the repo to Netlify.
2. Site config → **Identity** → *Enable Identity*.
3. Identity → Registration → set to **Invite only** (recommended).
4. Identity → Services → **Enable Git Gateway**.
5. Identity → **Invite users** → enter the client's email.
6. Client accepts the invite, sets a password, lands on `/admin`. Done.

---

## 3. Local backend  (dev only)

Covered in section 0. It's `local_backend: true` + `npx decap-server`. Use it to
demo the editor or test field changes without touching production auth.

---

## Notes for this starter specifically

- **Sitemap** already excludes `/admin` (`astro.config.mjs`), and `index.html`
  here is `noindex` — the admin won't leak into search.
- **Media:** uploads go to `src/assets/uploads` so Astro can optimize them. The
  blog `cover` field expects an image Astro can process; uploads through the CMS
  satisfy that. If you prefer un-optimized public images, change `media_folder`
  to `public/uploads` and `public_folder` to `/uploads`.
- **`pages` collection** is folder-based with `create: true`, so the client can
  add new page entries — but a new page entry only renders if a matching Astro
  route reads it. The shipped routes are `home` and `about`. Tell clients which
  entries are "live" or lock `create: false` on `pages` if you don't want them
  inventing orphan entries.
- After any client edit, the site **rebuilds and redeploys** automatically (that's
  the Git commit doing its job) — make sure your host has CI/deploy-on-push on.
