# Art Vasu — Marketing & Growth Plan

*Zero/minimal budget, ~5-8 hours/week. Organic channels only.*

## What the business actually looks like (this shapes everything below)

Before any tactics: this isn't a normal ecommerce store, and treating it like one will waste effort.

- **14 paintings total, only 9 currently available.** Every original sells exactly once — there's no "restock." A tactic that works for a store with unlimited inventory (paid ads driving cold traffic to one SKU) doesn't work here, because the SKU disappears the moment it sells.
- **Prices span £20–£450**, with most pieces in the £100–£250 range. That's a real but considered purchase — most buyers won't buy on the first visit.
- **Commissions are already offered** (4-6 week lead time, 50% deposit) — this is your only *repeatable, non-depleting* revenue stream. Marketing that leads to a commission enquiry is worth more long-term than marketing that sells one painting.
- **Prints are explicitly "not yet, pending demand"** in your own FAQ — this is a second untapped repeatable revenue stream once there's an email list to gauge demand from.

**The implication:** the goal of marketing here isn't just "sell this painting" — it's building an audience that (a) buys commissions repeatedly, (b) tells you when to launch prints, and (c) hears about new one-of-a-kind pieces the moment they're posted, since each one only gets one shot at a buyer.

---

## Two things must be fixed before spending a single hour on marketing

Driving traffic to a site that can't capture or measure it is wasted effort. These are 30-60 minutes of work each, not months.

### 1. The newsletter form is fake — it captures no emails

Confirmed by reading the code (`js/main.js`): clicking "Subscribe" shows a "thank you" toast and **discards the email address**. Nothing is stored anywhere. Every one of your own FAQ answers that says "join the newsletter to be the first to know" is currently a lie to your customers.

**Fix:** wire it to a free email tool — same integration pattern already used for the contact form:
- **Mailchimp free tier** (up to 500 contacts) or **Buttondown** (simpler, cheaper at scale) — both have a copy-paste embed form or a simple API call
- 30-60 minutes of work, no ongoing cost until you're well past 500 subscribers

This is the single highest-leverage fix on this list. Every other tactic below (Pinterest, Instagram, commissions) is more valuable once there's somewhere to capture the visitor who isn't ready to buy today.

### 2. There is no analytics on the site at all

Confirmed by checking the code — no Google Analytics, no Plausible, nothing. Right now you cannot answer "did that Instagram post bring anyone to the site" or "where do people drop off before buying." You'd be flying blind on every tactic below.

**Fix:** install **Plausible** (privacy-friendly, ~$9/month, no cookie banner needed) or **Google Analytics 4** (free, more setup, more data-privacy overhead). One `<script>` tag in the HTML `<head>`, I can do this in five minutes once you pick one.

---

## Channel strategy — where to spend the 5-8 hours/week

Based on how comparable independent artists actually sell in 2026 (not generic social media advice):

### Pinterest — the highest-leverage channel for this specific product (Recommended top priority)

Wall art is one of the best-performing categories on Pinterest because it's a **visual search engine**, not a social feed — a pin can bring traffic for years, not just the day you post it. Pinterest users also show unusually high purchase intent (85% have bought something because of a Pin they saw), which matters when your product is a considered £100-450 purchase, not an impulse buy.

**What to actually do:**
- Create boards by **specific style/room keyword**, not generic ones. "Mandala Art" tells Pinterest nothing useful — "Boho Living Room Wall Art," "Meditation Room Decor," "Colourful Mandala Paintings" are searchable.
- Post each painting as a **room mockup** (painting shown hanging in a styled room, not just on a plain background) — this format consistently outperforms plain product shots for wall art specifically.
- Link every pin directly to that painting's page (`painting.html?id=X`) — your Product schema and Open Graph tags are already correctly implemented, so unfurls/previews will look right without extra work.
- 3-5 pins/week is enough to start. This is the lowest-effort, highest-duration-of-payoff channel on this list.

### Instagram — you already have the audience infrastructure, use it properly

`@art.vasu` and the homepage's "From the Studio" gallery are already built. The gap is *how* it's being used.

- **Show process, not just the finished piece.** The single biggest shift in what works for independent artists in 2026: a photo of the finished painting alone under-performs. Short process videos/reels (painting a mandala layer by layer, sealing the canvas, packing an order) consistently outperform static posts and are what turns a follower into a buyer over months, not one post.
- **Set up Instagram Shopping product tags.** As of 2026, Instagram doesn't take a commission on tagged-product sales that complete on your own site (which is exactly your setup) — tag paintings in posts/reels so viewers can tap through directly to the painting page. Requires converting to a Business account and connecting a product catalog — worth the one-time setup given zero ongoing cost.
- Tag sparingly — 1-3 products per post, not every painting in frame. Overtagging measurably hurts engagement.

### Email — the retention layer that ties everything together

Once the newsletter actually works (see above), this becomes your most valuable owned asset — unlike Instagram/Pinterest followers, you actually own this list and it can't disappear if a platform changes its algorithm.

- **Abandoned cart email** is the single highest-return automation in ecommerce generally — but it requires a customer to have entered an email at some point. Given your checkout is Stripe Checkout (redirects off-site), you won't naturally capture emails from an abandoned cart the way most stores do. Realistic proxy for you: convert the newsletter into a "notify me before this sells" mechanism per painting page, or a simple "get first access to new work" popup — either captures the email you'd otherwise lose.
- **Segment your list from day one**: even a simple split (people who've bought before vs. never bought) lets you email past buyers first about new pieces and commission availability — repeat buyers are dramatically cheaper to sell to than new visitors.
- Cadence: one email per new painting or small batch of new work, plus occasional process/story content. Don't over-email a considered-purchase audience.

### Marketplaces (Etsy) — worth a deliberate decision, not a default

The current expert consensus for independent artists is genuinely **both**, not either/or: Etsy for discovery (90M+ active buyers already searching), your own site for retention and margin. Etsy's ~12-15% total fee is real, but for a brand-new site with no existing traffic, it can be the fastest path to first sales while Pinterest/Instagram/email build up.

**Recommendation given your situation:** you already have a working, fast, well-optimized own-site — most artists starting fresh don't have that. Given zero ad budget, an Etsy listing *could* provide faster initial traffic than waiting for organic Pinterest/Instagram to compound, at the cost of ~12-15% margin on those specific sales. This is a judgment call, not a must-do — worth revisiting once you have 2-3 months of data on how much organic traffic Pinterest/Instagram alone generate.

---

## What NOT to do

- **Don't run paid ads yet.** With zero budget specified and inventory that depletes per-sale, paid traffic to a specific painting that might sell before the ad even finishes its learning phase is a bad match. Reconsider only once commissions/prints exist as a repeatable, ad-safe product.
- **Don't post finished paintings only.** The research is consistent: process content outperforms product photography alone for this category in 2026.
- **Don't discount originals to move them.** Discounting is normal ecommerce psychology; a one-of-a-kind original often sells *better* at a stable, confident price to the right buyer than a discounted one to the wrong buyer. Save any discount instinct for the (currently nonexistent, but planned) prints line, where volume economics actually apply.

---

## Suggested order of operations

1. **Fix the newsletter capture** (30-60 min) — everything else compounds on top of this
2. **Install analytics** (Plausible or GA4, ~5 min once you pick one) — so you can measure whether any of this works
3. **Set up Pinterest boards + first 10-15 pins** using existing painting photos (room-mockup format if possible)
4. **Convert Instagram to Business + connect product catalog + start tagging paintings** in existing posts
5. **Start a lightweight process-content habit** — even phone-quality video of painting/packing, posted 2-3x/week
6. **Once the list has a few dozen subscribers**, send the first "new painting" email and gauge open/click rates
7. **Revisit Etsy as a discovery channel** after 6-8 weeks of organic data, if traffic is still thin

---

## What I can build vs. what's on you

| Task | Who does it |
|---|---|
| Wire the newsletter form to Mailchimp/Buttondown | I can do this — code change |
| Install analytics tracking script | I can do this — code change |
| Add Instagram Shopping catalog integration hooks (if needed beyond Meta's own dashboard setup) | I can help with code; the Meta Business/Commerce Manager setup itself is a dashboard task for you |
| Create Pinterest boards, pins, captions | You (or I can draft copy/descriptions if useful) |
| Record and post process videos | You — this needs to be genuine, in-studio content |
| Write and send emails | You, or I can draft copy for you to personalize |
| Etsy listing setup | You — dashboard/account task |

Sources: [Shopify — How To Sell Art Online 2026](https://www.shopify.com/blog/211990409-how-to-sell-art-online), [Gelato — Pinterest for Artists](https://www.gelato.com/blog/pinterest-for-artists), [Hootsuite — Pinterest Marketing 2026](https://blog.hootsuite.com/pinterest-marketing/), [Nevuto — Instagram Shop 2026](https://www.nevuto.com/blog/instagram-shop-complete-guide-2026), [Gainsty — Instagram Product Tagging 2026](https://www.gainsty.com/blog/instagram-product-tagging), [LitCommerce — Etsy vs Own Website 2026](https://litcommerce.com/blog/etsy-vs-own-website/), [Klaviyo — Abandoned Cart Email Best Practices](https://www.klaviyo.com/blog/abandoned-cart-email)
