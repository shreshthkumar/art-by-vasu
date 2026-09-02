# Art Vasu — Architecture Overview

## High-level picture

```
Customer/Visitor
      │
      ▼
Cloudflare (DNS only, not proxied)
      │
      ▼
Netlify (hosting + CDN + serverless functions)
      │
      ├── Static files (HTML/CSS/JS/images) ← from GitHub repo
      ├── Netlify Functions (serverless)
      │     ├── create-checkout-session.mjs → Stripe API
      │     ├── auth.mjs / auth-callback.mjs → GitHub OAuth
      │
      ▼
GitHub repo (shreshthkumar/art-by-vasu) ← source of truth for everything
      │
      ▼
Decap CMS (/admin/) ← non-technical editing interface, commits straight to GitHub
```

Third parties bolted on: **Stripe** (payments), **Web3Forms** (contact form email), **Ionos** (mailbox only — unrelated to the site).

---

## Tools and services used

| Layer | Tool | Purpose |
|---|---|---|
| Hosting/CDN | **Netlify** | Serves the static site, runs serverless functions, issues/renews HTTPS cert |
| DNS | **Cloudflare** | Points `artvasu.com` at Netlify. SSL mode: Full (strict). Proxy: **off** (grey cloud) |
| Domain registrar | **Ionos** | Where the domain was bought; also hosts your `contact@artvasu.com` mailbox (MX records) |
| Source control | **GitHub** (`shreshthkumar/art-by-vasu`) | Every file — code, content, config — lives here. Netlify auto-deploys on every push to `main` |
| CMS | **Decap CMS** at `/admin/` | Editing interface for a non-technical user; authenticates via GitHub OAuth |
| Payments | **Stripe** (Checkout, hosted page) | Card processing, live mode |
| Contact form | **Web3Forms** | Takes form submissions, emails them to you — no backend needed |
| Frontend | Plain HTML/CSS/vanilla JS | No framework, no build step, no `package.json` |
| Functions runtime | **Netlify Functions** (Node, `.mjs`) | Only 3 functions total, all dependency-free (no npm packages) |

---

## The codebase, in plain terms

- **Pages**: `index.html`, `shop.html`, `painting.html`, `about.html`, `contact.html`, `success.html`, plus `admin/index.html` for the CMS.
- **Content**: everything editable lives in `data/*.json` (paintings, homepage copy, about page, contact/FAQ, shop settings, site-wide brand info). Pages fetch these at runtime.
- **Styling**: one file, `css/styles.css`.
- **Behavior**: `js/main.js` (cart, nav, toasts), `js/shop.js`, `js/painting.js`, `js/checkout.js`, `js/cms-loader.js`.
- **Serverless functions**: `netlify/functions/create-checkout-session.mjs`, `auth.mjs`, `auth-callback.mjs`.
- **Config**: `netlify.toml` (build settings, redirects, security headers), `admin/config.yml` (CMS schema and backend).

---

## How a purchase actually works

1. Visitor adds paintings to a cart stored in their browser (`localStorage`) — no server involved yet.
2. On "Proceed to Checkout," the browser sends only **painting IDs** and a shipping region to `create-checkout-session.mjs`.
3. That function reads `data/paintings.json` **on the server** (bundled into the function itself) — it independently looks up the real price and checks `available`. The browser's price is never trusted.
4. If everything checks out, it asks Stripe to create a Checkout Session and returns Stripe's hosted payment URL. The customer pays on `checkout.stripe.com`, not on your site.
5. On success, they land on `success.html`, which shows their order and clears the cart.
6. Stripe emails you a payment notification containing the `painting_ids` metadata — that's how you know which piece(s) sold.

**Important limitation to know**: marking a painting "sold" is **manual** — you flip the `Available for Sale` toggle in Decap CMS yourself after reading the email. There's no automatic webhook. This means there's a small window where two people could both complete payment for the same one-of-a-kind piece before you catch it. Fine at current volume; worth revisiting if sales pick up.

---

## Where to manage things day-to-day

| I want to... | Go to |
|---|---|
| Edit painting prices, mark something sold, update page text | **`https://artvasu.com/admin/`** (Decap CMS) — log in with GitHub |
| See a payment / issue a refund | **Stripe Dashboard** → Payments |
| Change shipping rates | **Stripe Dashboard** → Products → Shipping rates (remember: test and live mode have *separate* rates) |
| Check if the site is down / see a deploy log | **Netlify Dashboard** → your site → Deploys |
| Change environment variables (API keys) | **Netlify Dashboard** → Site configuration → Environment variables |
| Point the domain somewhere else / change DNS | **Cloudflare Dashboard** → DNS → Records |
| See raw code / revert a change | **GitHub** → `shreshthkumar/art-by-vasu` |
| Fix contact form issues | **Web3Forms Dashboard** (only if you ever add domain restrictions — currently none are set) |
| Manage your email inbox | **Ionos** (unrelated to the website itself) |

---

## Credentials and where they live

None of these are in the code — all set as **Netlify environment variables**:

| Variable | What it's for |
|---|---|
| `STRIPE_SECRET_KEY` | Live Stripe API key — creates checkout sessions |
| `STRIPE_SHIPPING_RATE_UK` / `_EU` / `_INTL` | Live-mode shipping rate IDs |
| `GITHUB_OAUTH_ID` / `GITHUB_OAUTH_SECRET` | Lets Decap CMS authenticate editors via GitHub |

The Web3Forms key is the one exception — it's a public-by-design key sitting in `contact.html`, safe to expose.

**If you ever need to rotate a key**: update it in Netlify's Environment variables, then trigger a redeploy (Deploys → Trigger deploy). For Stripe specifically, if you rotate the secret key you do **not** need to touch the shipping rate IDs — those are independent.

---

## Security measures in place

- HTTPS enforced everywhere (Netlify-managed certificate)
- Security headers (CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) via `netlify.toml`
- Checkout is server-authoritative — prices/availability can't be manipulated from the browser
- No secret keys ever reach client-side code
- CMS content is HTML-escaped before rendering, closing a stored-XSS path
- No public write access to any content file — GitHub OAuth is the only way in

## SEO/GEO measures in place

- `sitemap.xml` and `robots.txt`
- Product structured data (JSON-LD) on every painting page — price, availability, images
- Organization schema on the homepage
- Canonical URLs and Open Graph/Twitter Card tags on every page, so shared links show proper previews

---

## Known limitations / things to revisit later

- **No automated sold-marking** — see purchase flow above. A Stripe webhook would close this gap if it ever becomes a problem.
- **No `package.json` / npm dependencies anywhere, by design** — keeps every CMS save deploy-safe (nothing to `npm install`, nothing to break). If you ever need the Stripe SDK or another library, this tradeoff should be revisited deliberately, not accidentally.
- **`artvasu.com` (no `www`) is the canonical domain.** `www.artvasu.com` redirects to it. If you ever recreate the GitHub OAuth App or change `admin/config.yml`'s `base_url`, keep both consistent with the apex domain — a mismatch previously broke CMS login.
- **Test mode vs live mode are entirely separate in Stripe** — different API keys, different shipping rate IDs. Never mix values from one mode into the other.
