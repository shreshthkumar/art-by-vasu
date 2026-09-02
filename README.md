# Art Vasu — Hand-Painted Folk & Mandala Art

A full e-commerce website for an independent artist selling original, one-of-a-kind folk and mandala paintings. Built as a plain HTML/CSS/JS site with no build step, backed by Netlify Functions for secure checkout, and editable through a browser-based CMS.

**Live site:** [artvasu.com](https://artvasu.com)

## What it does

- Showcases a rotating catalogue of original paintings — each one-of-a-kind, marked sold once purchased
- Takes real payments via Stripe Checkout, with server-side price/availability validation so the browser is never trusted with money
- Lets the site owner edit paintings, prices, and page copy through a CMS at `/admin/`, no code required
- Captures newsletter sign-ups and contact/commission enquiries, delivered by email
- Tracks visitor behaviour via Google Analytics

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, featured paintings, about snippet, testimonials, newsletter |
| `shop.html` | Full gallery with filtering, sorting, and cart |
| `painting.html?id=N` | Individual painting detail page, image carousel, related work |
| `about.html` | Artist story, process, facts |
| `contact.html` | Contact form, FAQ accordion, commission enquiries |
| `success.html` | Post-checkout order confirmation |
| `admin/` | Decap CMS editor (GitHub login required) |

## Stack

Plain HTML · CSS · Vanilla JS — no build step, no `package.json`, no framework. Content lives in `data/*.json` and is fetched at runtime.

| Layer | Tool |
|---|---|
| Hosting + serverless functions | Netlify |
| Payments | Stripe Checkout (server-authoritative via `netlify/functions/create-checkout-session.mjs`) |
| CMS | Decap CMS, authenticated via GitHub OAuth |
| Contact form + newsletter capture | Web3Forms |
| Analytics | Google Analytics 4 |
| DNS | Cloudflare (pointing to Netlify) |

Full architecture detail — how checkout works end to end, where credentials live, known limitations — is documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md). A plain-English version for the site owner is in [`OVERVIEW-FOR-OWNER.md`](./OVERVIEW-FOR-OWNER.md). Growth/marketing strategy is in [`MARKETING-PLAN.md`](./MARKETING-PLAN.md).

## Customisation

- Edit paintings, prices, availability, and page copy via `/admin/` (recommended), or directly in `data/*.json`
- Add new painting photos to `images/` (WebP recommended — see the format already used by existing images)
- Update the contact email in `data/contact.json`
- Update personal facts and story in `about.html` / `data/about.json`

## Local development

No build step — open any `.html` file directly, or serve the folder with any static server (e.g. `python3 -m http.server`). Netlify Functions (checkout, CMS auth) require `netlify dev` to run locally, since they're not available from a plain static server.

## Instagram

[@art.vasu](https://www.instagram.com/art.vasu/)
