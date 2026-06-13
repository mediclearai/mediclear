// netlify/functions/verify-session.mjs
//
// Looks up a completed Checkout Session straight from Stripe so the success page
// can confirm the subscription immediately (without waiting on the async webhook).
// The webhook remains the source of truth for granting access; this is just for display.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_TO_TIER = {
  price_1ThZvLAPsnWNgT661EXk3nM9: "Pro",
  price_1ThZyRAPsnWNgT66VUAR7CB8: "Clinical",
};

export default async (req) => {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "subscription.items.data.price"],
    });

    const sub = session.subscription;
    const priceId = sub?.items?.data?.[0]?.price?.id;

    const rawTier = session.metadata?.tier;
    const tier = rawTier
      ? rawTier.charAt(0).toUpperCase() + rawTier.slice(1)
      : PRICE_TO_TIER[priceId] || "your plan";

    return Response.json({
      status: session.status, // "complete"
      paymentStatus: session.payment_status, // "paid"
      subscriptionStatus: sub?.status || null, // "active" / "trialing"
      tier,
      email: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error("verify-session error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  path: "/api/verify-session",
};
