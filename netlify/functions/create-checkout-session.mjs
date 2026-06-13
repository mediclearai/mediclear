// netlify/functions/create-checkout-session.mjs
//
// Creates a SUBSCRIPTION-mode Stripe Checkout Session for Bridges Health.
// Tiers: Pro ($49/mo) and Clinical ($299/mo).
//
// Required env vars (set in Netlify → Site settings → Environment variables):
//   STRIPE_SECRET_KEY   sk_live_...
//   SITE_URL            https://bridges.healthcare   (optional; falls back below)

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Tier → live price ID (from your new standalone Stripe account)
const TIERS = {
  pro: {
    priceId: "price_1ThZvLAPsnWNgT661EXk3nM9", // $49/mo
    label: "Pro",
  },
  clinical: {
    priceId: "price_1ThZyRAPsnWNgT66VUAR7CB8", // $299/mo
    label: "Clinical",
  },
};

const SITE_URL = process.env.SITE_URL || "https://bridges.healthcare";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { userId, tier, email } = await req.json();

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const plan = TIERS[tier];
    if (!plan) {
      return Response.json({ error: `Unknown tier: ${tier}` }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],

      // Metadata on the SESSION → available on checkout.session.completed
      metadata: { userId, tier },

      // Metadata on the SUBSCRIPTION → so renewal/cancel events also carry userId.
      // (Renewal/cancel events reference the subscription, not the session,
      //  so without this you'd lose track of which user they belong to.)
      subscription_data: {
        metadata: { userId, tier },
      },

      client_reference_id: userId,
      customer_email: email || undefined,

      // Lets your $99 pilot coupon (as a promotion code) be applied at checkout
      allow_promotion_codes: true,

      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  path: "/api/create-checkout-session",
};
