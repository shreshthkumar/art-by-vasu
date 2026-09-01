import { readFile } from 'node:fs/promises';

const MAX_ITEMS = 10;

const SHIPPING = {
  uk: {
    rateEnv: 'STRIPE_SHIPPING_RATE_UK',
    allowedCountries: ['GB'],
  },
  europe: {
    rateEnv: 'STRIPE_SHIPPING_RATE_EU',
    allowedCountries: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
      'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
      'SI', 'ES', 'SE', 'NO', 'CH', 'IS',
    ],
  },
  international: {
    rateEnv: 'STRIPE_SHIPPING_RATE_INTL',
    // Everything else Art Vasu ships to.
    allowedCountries: [
      'US', 'CA', 'AU', 'NZ', 'IN', 'AE', 'SG', 'JP', 'HK', 'ZA',
    ],
  },
};

let paintingsCache = null;

async function loadPaintings() {
  if (paintingsCache) return paintingsCache;
  const raw = await readFile(new URL('../../data/paintings.json', import.meta.url), 'utf8');
  const { paintings } = JSON.parse(raw);
  paintingsCache = paintings;
  return paintings;
}

function formEncode(params, prefix, pairs) {
  if (params === null || params === undefined) return;
  if (Array.isArray(params)) {
    params.forEach((value, i) => formEncode(value, `${prefix}[${i}]`, pairs));
  } else if (typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      formEncode(value, prefix ? `${prefix}[${key}]` : key, pairs);
    });
  } else {
    pairs.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(params))}`);
  }
}

function toFormBody(obj) {
  const pairs = [];
  formEncode(obj, '', pairs);
  return pairs.join('&');
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const rawIds = Array.isArray(body?.ids) ? body.ids : [];
  const ids = [...new Set(rawIds.map((id) => Number(id)).filter(Number.isInteger))].slice(0, MAX_ITEMS);

  if (ids.length === 0) {
    return jsonResponse(400, { error: 'No valid painting ids provided' });
  }

  const region = SHIPPING[body?.region] ? body.region : 'uk';
  const shippingConfig = SHIPPING[region];
  const shippingRateId = process.env[shippingConfig.rateEnv];

  if (!shippingRateId) {
    console.error(`Missing env var ${shippingConfig.rateEnv}`);
    return jsonResponse(502, { error: 'Checkout is temporarily unavailable' });
  }

  const paintings = await loadPaintings();

  const unknown = [];
  const unavailable = [];
  const lineItems = [];
  const titles = [];

  const origin = process.env.DEPLOY_PRIME_URL || process.env.URL || '';

  for (const id of ids) {
    const painting = paintings.find((p) => p.id === id);

    if (!painting) {
      unknown.push(id);
      continue;
    }
    if (painting.available !== true) {
      unavailable.push(id);
      titles.push(painting.title);
      continue;
    }
    if (typeof painting.price !== 'number' || painting.price <= 0) {
      unavailable.push(id);
      titles.push(painting.title);
      continue;
    }

    const productData = {
      name: painting.title,
      description: `${painting.size} · ${painting.medium}`,
    };
    if (painting.image) {
      // formEncode below applies encodeURIComponent — pass the raw URL, don't pre-encode it.
      productData.images = [`${origin}/${painting.image}`];
    }

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(painting.price * 100),
        product_data: productData,
      },
    });
    titles.push(painting.title);
  }

  if (unknown.length > 0 || unavailable.length > 0) {
    return jsonResponse(409, { unknown, unavailable, titles });
  }

  if (lineItems.length === 0) {
    return jsonResponse(400, { error: 'Nothing available to check out' });
  }

  // unknown/unavailable are both empty here, so every id in `ids` is valid and purchasable.
  const sessionParams = {
    mode: 'payment',
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: shippingConfig.allowedCountries,
    },
    shipping_options: [{ shipping_rate: shippingRateId }],
    success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop.html?checkout=cancelled`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    metadata: {
      painting_ids: ids.join(','),
      painting_titles: titles.join(', '),
    },
    payment_intent_data: {
      metadata: {
        painting_ids: ids.join(','),
      },
    },
  };

  let stripeResponse;
  try {
    stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: toFormBody(sessionParams).replace(/%7B/g, '{').replace(/%7D/g, '}'),
    });
  } catch (err) {
    console.error('Stripe request failed', err);
    return jsonResponse(502, { error: 'Could not reach payment provider' });
  }

  const session = await stripeResponse.json();

  if (!stripeResponse.ok) {
    console.error('Stripe error', session?.error?.message);
    return jsonResponse(502, { error: 'Could not create checkout session' });
  }

  return jsonResponse(200, { url: session.url });
};
