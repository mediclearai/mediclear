// src/SuccessPage.jsx
//
// Shown after Stripe Checkout (success_url = /success?session_id={CHECKOUT_SESSION_ID}).
// Confirms the subscription by calling /api/verify-session, then sends the user back into the app.

import { useEffect, useState } from "react";

const APP_PATH = "/"; // where "Go to your dashboard" should land

export default function SuccessPage() {
  const [state, setState] = useState("loading"); // loading | ok | error
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!sessionId) {
      setState("error");
      setMessage("No checkout session found. If you were charged, your plan is still active — check your email for the receipt.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/verify-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not verify your subscription");
        setInfo(data);
        setState("ok");
      } catch (err) {
        console.error("verify error:", err);
        setState("error");
        setMessage("We couldn't confirm your subscription just now. If you completed payment, it's active — check your email for the receipt.");
      }
    })();
  }, []);

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.card}>
        {state === "loading" && (
          <>
            <div className="spinner" style={styles.spinner} />
            <h1 style={styles.title}>Confirming your subscription…</h1>
            <p style={styles.sub}>One moment.</p>
          </>
        )}

        {state === "ok" && (
          <>
            <div style={styles.check}>✓</div>
            <h1 style={styles.title}>You're on {info.tier}.</h1>
            <p style={styles.sub}>
              Your subscription is active{info.email ? `, and a receipt is on its way to ${info.email}` : ""}.
            </p>
            <a href={APP_PATH} className="cta" style={styles.cta}>
              Go to your dashboard
            </a>
          </>
        )}

        {state === "error" && (
          <>
            <div style={styles.warn}>!</div>
            <h1 style={styles.title}>Almost there</h1>
            <p style={styles.sub}>{message}</p>
            <a href={APP_PATH} className="cta" style={styles.cta}>
              Go to your dashboard
            </a>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(1200px 600px at 50% -10%, #1a1530 0%, #0a0a12 55%)",
    color: "#fff",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#14121f",
    border: "1px solid #2a2540",
    borderRadius: 22,
    padding: "44px 32px",
    textAlign: "center",
  },
  check: {
    width: 64,
    height: 64,
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#10d191,#3b82f6)",
    color: "#fff",
    fontSize: 34,
    fontWeight: 800,
    lineHeight: "64px",
  },
  warn: {
    width: 64,
    height: 64,
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#f59e0b,#7c3aed)",
    color: "#fff",
    fontSize: 34,
    fontWeight: 800,
    lineHeight: "64px",
  },
  spinner: {
    width: 44,
    height: 44,
    margin: "0 auto 24px",
    borderRadius: "50%",
    border: "4px solid #2a2540",
    borderTopColor: "#7c3aed",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  sub: { fontSize: 15, color: "#9b96a8", margin: "0 0 28px", lineHeight: 1.5 },
  cta: {
    display: "inline-block",
    textDecoration: "none",
    border: "none",
    borderRadius: 12,
    padding: "15px 28px",
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(90deg,#7c3aed,#3b82f6)",
  },
};

const css = `
  .spinner { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .cta { transition: transform .15s ease, box-shadow .15s ease; }
  .cta:hover { transform: translateY(-1px); box-shadow: 0 12px 32px -8px rgba(124,58,237,.6); }
  @media (prefers-reduced-motion: reduce) {
    .spinner { animation: none; }
    .cta { transition: none; }
  }
`;
