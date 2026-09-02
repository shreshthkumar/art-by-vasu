# Art Vasu Website — What You Have Now

**In one sentence:** Your website can now take real payments online, is fast, secure, and shows up properly on Google and social media — and you can update everything yourself without needing a developer.

## What changed

Your site used to just show a "coming soon" message where checkout should be. Now customers can actually buy a painting, pay by card, and you get notified. On top of that, the site loads much faster, looks correct when shared on WhatsApp/Instagram/Google, and has proper security protections in place.

## The tools involved (and what each one does for you)

| Tool | Think of it as... |
|---|---|
| **Netlify** | The "landlord" — hosts your website and keeps it running 24/7 |
| **Stripe** | Your payment processor — handles card payments securely, like a card machine for your website |
| **GitHub** | The filing cabinet — stores every version of your website, so nothing is ever truly lost |
| **Decap CMS** (at artvasu.com/admin) | Your editing dashboard — where you change prices, mark things sold, update text |
| **Cloudflare** | Points your domain name to the right place |
| **Web3Forms** | Delivers contact form messages straight to your inbox |

## How a sale works, step by step

1. Customer adds a painting to their cart and clicks checkout
2. They're taken to Stripe's secure payment page and pay by card
3. Money lands in your Stripe account
4. You get an email telling you which painting sold
5. **You go into your admin panel and manually mark that painting as "sold"** — this last step is on you, it doesn't happen automatically

## The one thing to remember

Because marking a painting sold is manual, there's a small window where two people could both try to buy the same one-of-a-kind piece before you catch it. At your current sales volume this is very unlikely, but check your email promptly after a notification and update the listing.

## Where to go for what

| I want to... | Go here |
|---|---|
| Change a price or mark a painting sold | artvasu.com/admin |
| Check a payment or issue a refund | Stripe |
| See if the site is working | Netlify |
| Something's broken and I don't know why | Ask me, or check Netlify's "Deploys" tab for errors |

Full technical detail lives in `ARCHITECTURE.md` in your project files if you (or a future developer) ever need it — this summary is the version for everyday use.
