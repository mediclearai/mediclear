// src/PricingPage.jsx
//
// Subscription pricing page for Bridges Health — Pro ($49/mo) and Clinical ($299/mo).
// Replaces the old credit-pack page (CreditPurchasePage.jsx).
// Calls /api/create-checkout-session with { userId, tier } and redirects to Stripe Checkout.

import { useState } from "react";

const PLANS = [
  {
    key: "pro",
    name: "Pro",
    headline: "Solo provider",
    price: "$49",
    cadence: "/month",
    blurb: "For individual practices and solo clinicians.",
    features: [
      "1 provider seat",
      "Plain-language lab reports",
      "All 12 languages",
    ],
    cta: "Subscribe to Pro",
    highlighted: false,
  },
  {
    key: "clinical",
    name: "Clinical",
    headline: "Your whole clinic",
    price: "$299",
    cadence: "/month",
    blurb: "For clinics and community health centers.",
    features: [
      "Whole team — multiple seats",
      "Higher report volume",
      "Priority support",
      "All 12 languages",
    ],
    cta: "Subscribe to Clinical",
    highlighted: true,
    badge: "Recommended",
  },
];

// Mirrors your existing localStorage userId pattern
function getUserId() {
  let id = localStorage.getItem("bridges_user_id");
  if (!id) {
    id =
      "user_" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
    localStorage.setItem("bridges_user_id", id);
  }
  return id;
}

export default function PricingPage() {
  const [loading, setLoading] = useState(null); // which tier is loading
  const [error, setError] = useState(null);

  async function handleSubscribe(tier) {
    setLoading(tier);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout");
      // Same-tab redirect so the back button and success_url behave correctly
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <header style={styles.header}>
        <p style={styles.eyebrow}>BRIDGES HEALTH</p>
        <h1 style={styles.title}>Plans that scale with your patients</h1>
        <p style={styles.subtitle}>
          Plain-language lab reports in 12 languages. Cancel anytime.
        </p>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className="plan-card"
            style={{
              ...styles.card,
              ...(plan.highlighted ? styles.cardHighlighted : {}),
            }}
          >
            {plan.badge && <span style={styles.badge}>{plan.badge}</span>}

            <p
              style={{
                ...styles.planEyebrow,
                color: plan.highlighted ? "#7c3aed" : "#a78bfa",
              }}
            >
              {plan.name.toUpperCase()}
            </p>

            <h2
              style={{
                ...styles.headline,
                color: plan.highlighted ? "#15121f" : "#ffffff",
              }}
            >
              {plan.headline}
            </h2>

            <div style={styles.priceRow}>
              <span style={styles.price}>{plan.price}</span>
              <span
                style={{
                  ...styles.cadence,
                  color: plan.highlighted ? "#5b5570" : "#8b8699",
                }}
              >
                {plan.cadence}
              </span>
            </div>

            <p
              style={{
                ...styles.blurb,
                color: plan.highlighted ? "#4a4458" : "#9b96a8",
              }}
            >
              {plan.blurb}
            </p>

            <ul style={styles.features}>
              {plan.features.map((f) => (
                <li
                  key={f}
                  style={{
                    ...styles.feature,
                    color: plan.highlighted ? "#2a2636" : "#cfcad8",
                  }}
                >
                  <span style={styles.check}>✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              className="plan-cta"
              style={styles.cta}
              disabled={loading === plan.key}
              onClick={() => handleSubscribe(plan.key)}
            >
              {loading === plan.key ? "Redirecting…" : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 50% -10%, #1a1530 0%, #0a0a12 55%)",
    color: "#fff",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "48px 20px 80px",
    boxSizing: "border-box",
  },
  header: { maxWidth: 720, margin: "0 auto 40px", textAlign: "center" },
  eyebrow: {
    letterSpacing: "0.25em",
    fontSize: 12,
    fontWeight: 700,
    color: "#a78bfa",
    margin: "0 0 12px",
  },
  title: {
    fontSize: 32,
    lineHeight: 1.12,
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  subtitle: { fontSize: 16, color: "#9b96a8", margin: 0 },
  grid: {
    display: "grid",
    gap: 22,
    maxWidth: 760,
    margin: "0 auto",
    gridTemplateColumns: "1fr",
  },
  card: {
    position: "relative",
    background: "#14121f",
    border: "1px solid #2a2540",
    borderRadius: 20,
    padding: "34px 24px",
  },
  cardHighlighted: {
    background: "linear-gradient(180deg, #f3f0ff 0%, #e9e6fb 100%)",
    border: "1px solid #b9a9ff",
    boxShadow: "0 24px 64px -22px rgba(124,58,237,0.55)",
  },
  badge: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(90deg,#7c3aed,#3b82f6)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "5px 14px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },
  planEyebrow: {
    letterSpacing: "0.22em",
    fontSize: 12,
    fontWeight: 700,
    margin: "0 0 10px",
    textAlign: "center",
  },
  headline: {
    fontSize: 28,
    fontWeight: 800,
    margin: "0 0 16px",
    textAlign: "center",
    letterSpacing: "-0.02em",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 4,
    marginBottom: 8,
  },
  price: { fontSize: 40, fontWeight: 800, color: "#10d191" },
  cadence: { fontSize: 15, fontWeight: 600 },
  blurb: { fontSize: 14, textAlign: "center", margin: "0 0 20px" },
  features: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 26px",
    display: "grid",
    gap: 11,
  },
  feature: { fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
  check: { color: "#10d191", fontWeight: 800 },
  cta: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "16px",
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(90deg,#7c3aed,#3b82f6)",
  },
  error: {
    maxWidth: 760,
    margin: "0 auto 20px",
    background: "#3a1d2a",
    border: "1px solid #7a3a52",
    color: "#ffb4c8",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    textAlign: "center",
  },
};

const css = `
  .plan-cta { transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease; }
  .plan-cta:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px -8px rgba(124,58,237,.6); }
  .plan-cta:active:not(:disabled) { transform: translateY(0); }
  .plan-cta:disabled { opacity: .6; cursor: default; }
  @media (prefers-reduced-motion: reduce) {
    .plan-cta { transition: none; }
  }
`;
