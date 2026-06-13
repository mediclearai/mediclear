v// netlify/functions/stripe-webhook.mjs
//
// Subscription-aware webhook for Bridges Health.
// Handles: new subscriptions, renewals, failed payments, plan changes, cancellations.
//
// Required env vars:
//   STRIPE_SECRET_KEY     sk_live_...
//   STRIPE_WEBHOOK_SECRET whsec_...   (from the webhook endpoint you register in Stripe)
//
// Register this endpoint in Stripe → Developers → Webhooks at:
//   https://bridges.healthcare/api/stripe-webhook
// and subscribe to these events:
//   checkout.session.completed
//   invoice.paid
//   invoice.payment_failed
//   customer.subscription.updated
//   customer.subscription.deleted

import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Reverse lookup: price ID → tier (so we can re-label on renewals/plan changes)
const PRICE_TO_TIER = {
  price_1ThZvLAPsnWNgT661EXk3nM9: "pro", // $49/mo
  price_1ThZyRAPsnWNgT66VUAR7CB8: "clinical", // $299/mo
};

export default async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text(); // RAW body required for signature verification

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️  Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const subs = getStore("subscriptions");
  const processed = getStore("processed-events");

  // Idempotency — Stripe retries events; never double-process one
  const seen = await processed.get(event.id);
  if (seen) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      // ---- New subscription started ----
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;
        const userId = session.metadata?.userId || session.client_reference_id;
        const tier = session.metadata?.tier;
        await upsert(subs, userId, {
          tier,
          status: "active",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
        break;
      }

      // ---- Renewal succeeded → keep access live ----
      case "invoice.paid": {
        const invoice = event.data.object;
        await syncFromSubscription(subs, invoice.subscription, "active");
        break;
      }

      // ---- Renewal/charge failed → flag as past_due (don't revoke yet) ----
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await syncFromSubscription(subs, invoice.subscription, "past_due");
        break;
      }

      // ---- Plan change, status change, scheduled cancel, etc. ----
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        const tier =
          PRICE_TO_TIER[sub.items?.data?.[0]?.price?.id] || sub.metadata?.tier;
        await upsert(subs, userId, {
          tier,
          status: sub.status, // active | past_due | canceled | unpaid | ...
          stripeCustomerId: sub.customer,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
        break;
      }

      // ---- Subscription fully ended → revoke access ----
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await upsert(subs, sub.metadata?.userId, {
          status: "canceled",
          stripeSubscriptionId: sub.id,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      default:
        // Anything else: acknowledge and ignore
        break;
    }

    await processed.set(event.id, "1");
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // 500 → Stripe will retry, which is what we want on a transient failure
    return new Response("Handler error", { status: 500 });
  }
};

// Merge a patch into a user's stored subscription record
async function upsert(store, userId, patch) {
  if (!userId) {
    console.warn("Event had no userId — skipping write");
    return;
  }
  const existing = (await store.get(userId, { type: "json" })) || {};
  const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  await store.setJSON(userId, merged);
  console.log(`✅ ${userId} → ${merged.tier ?? "?"} / ${merged.status}`);
}

// Pull fresh truth from Stripe for renewal/failure events
async function syncFromSubscription(store, subscriptionId, status) {
  if (!subscriptionId) return;
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = sub.metadata?.userId;
  const tier =
    PRICE_TO_TIER[sub.items?.data?.[0]?.price?.id] || sub.metadata?.tier;
  await upsert(store, userId, {
    tier,
    status,
    stripeCustomerId: sub.customer,
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: sub.current_period_end,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  });
}

export const config = {
  path: "/api/stripe-webhook",
};
// netlify/functions/stripe-webhook.mjs
//
// Subscription-aware webhook for Bridges Health.
// Handles: new subscriptions, renewals, failed payments, plan changes, cancellations.
//
// Required env vars:
//   STRIPE_SECRET_KEY     sk_live_...
//   STRIPE_WEBHOOK_SECRET whsec_...   (from the webhook endpoint you register in Stripe)
//
// Register this endpoint in Stripe → Developers → Webhooks at:
//   https://bridges.healthcare/api/stripe-webhook
// and subscribe to these events:
//   checkout.session.completed
//   invoice.paid
//   invoice.payment_failed
//   customer.subscription.updated
//   customer.subscription.deleted

import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Reverse lookup: price ID → tier (so we can re-label on renewals/plan changes)
const PRICE_TO_TIER = {
  price_1ThZvLAPsnWNgT661EXk3nM9: "pro", // $49/mo
  price_1ThZyRAPsnWNgT66VUAR7CB8: "clinical", // $299/mo
};

export default async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text(); // RAW body required for signature verification

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️  Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const subs = getStore("subscriptions");
  const processed = getStore("processed-events");

  // Idempotency — Stripe retries events; never double-process one
  const seen = await processed.get(event.id);
  if (seen) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      // ---- New subscription started ----
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;
        const userId = session.metadata?.userId || session.client_reference_id;
        const tier = session.metadata?.tier;
        await upsert(subs, userId, {
          tier,
          status: "active",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
        break;
      }

      // ---- Renewal succeeded → keep access live ----
      case "invoice.paid": {
        const invoice = event.data.object;
        await syncFromSubscription(subs, invoice.subscription, "active");
        break;
      }

      // ---- Renewal/charge failed → flag as past_due (don't revoke yet) ----
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await syncFromSubscription(subs, invoice.subscription, "past_due");
        break;
      }

      // ---- Plan change, status change, scheduled cancel, etc. ----
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        const tier =
          PRICE_TO_TIER[sub.items?.data?.[0]?.price?.id] || sub.metadata?.tier;
        await upsert(subs, userId, {
          tier,
          status: sub.status, // active | past_due | canceled | unpaid | ...
          stripeCustomerId: sub.customer,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
        break;
      }

      // ---- Subscription fully ended → revoke access ----
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await upsert(subs, sub.metadata?.userId, {
          status: "canceled",
          stripeSubscriptionId: sub.id,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      default:
        // Anything else: acknowledge and ignore
        break;
    }

    await processed.set(event.id, "1");
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // 500 → Stripe will retry, which is what we want on a transient failure
    return new Response("Handler error", { status: 500 });
  }
};

// Merge a patch into a user's stored subscription record
async function upsert(store, userId, patch) {
  if (!userId) {
    console.warn("Event had no userId — skipping write");
    return;
  }
  const existing = (await store.get(userId, { type: "json" })) || {};
  const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  await store.setJSON(userId, merged);
  console.log(`✅ ${userId} → ${merged.tier ?? "?"} / ${merged.status}`);
}

// Pull fresh truth from Stripe for renewal/failure events
async function syncFromSubscription(store, subscriptionId, status) {
  if (!subscriptionId) return;
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = sub.metadata?.userId;
  const tier =
    PRICE_TO_TIER[sub.items?.data?.[0]?.price?.id] || sub.metadata?.tier;
  await upsert(store, userId, {
    tier,
    status,
    stripeCustomerId: sub.customer,
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: sub.current_period_end,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  });
}

export const config = {
  path: "/api/stripe-webhook",
};
