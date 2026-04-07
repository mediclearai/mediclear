import { useState, useEffect, useRef } from "react";

const LANGS = [
  {code:"en",label:"English",flag:"🇬🇧"},{code:"fr",label:"Français",flag:"🇫🇷"},
  {code:"ar",label:"العربية",flag:"🇸🇦"},{code:"sw",label:"Kiswahili",flag:"🇰🇪"},
  {code:"ha",label:"Hausa",flag:"🇳🇬"},{code:"hi",label:"हिन्दी",flag:"🇮🇳"},
  {code:"pt",label:"Português",flag:"🇧🇷"},{code:"zh",label:"中文",flag:"🇨🇳"},
  {code:"de",label:"Deutsch",flag:"🇩🇪"},{code:"es",label:"Español",flag:"🇪🇸"},
  {code:"ja",label:"日本語",flag:"🇯🇵"},{code:"ru",label:"Русский",flag:"🇷🇺"},
];

const PLANS = [
  { id:"starter", name:"Starter", price:49, yearPrice:39, color:"#3b82f6",
    desc:"For individual practitioners & small clinics",
    features:["500 interpretations/month","5 languages","REST API access","Email support","Basic analytics","Standard response time"],
    notIncluded:["White-label branding","Webhooks","Priority support"] },
  { id:"growth", name:"Growth", price:299, yearPrice:239, color:"#059669",
    badge:"Most Popular", desc:"For growing clinics, pharmacies & health platforms",
    features:["5,000 interpretations/month","All 12 languages","REST API + Webhooks","White-label branding","Priority support (4h SLA)","Advanced analytics","Custom disclaimer text","Zapier integration"],
    notIncluded:["Dedicated endpoint","On-premise option"] },
  { id:"enterprise", name:"Enterprise", price:null, yearPrice:null, color:"#7c3aed",
    badge:"Best Value", desc:"For hospital networks, device makers & large platforms",
    features:["Unlimited interpretations","All 12 languages","Dedicated API endpoint","Full white-label + custom domain","24/7 SLA guarantee","Dedicated account manager","On-premise deployment","HIPAA BAA included","Regulatory support","Custom language additions"],
    notIncluded:[] },
];

const TESTIMONIALS = [
  {name:"Dr. Fatima Al-Rashid",role:"Chief Medical Officer",org:"Gulf Health Network",country:"🇦🇪",text:"MediClear transformed how our patients engage with results. A patient in tears because she couldn't read her biopsy report — she finally understood, in Arabic, that it was benign. That moment made everything worth it.",avatar:"F"},
  {name:"Emmanuel Okafor",role:"Pharmacy Director",org:"MedExpress Pharmacies",country:"🇳🇬",text:"We integrated the API in one afternoon. Now every receipt includes a plain-language explanation in Hausa. Patient satisfaction scores went up 34% in the first month.",avatar:"E"},
  {name:"Dr. Priya Sharma",role:"Lab Director",org:"PathLabs India",country:"🇮🇳",text:"The accuracy is remarkable. It handles complex haematology reports and explains them in Hindi at exactly the right level — credible enough for doctors, simple enough for patients.",avatar:"P"},
  {name:"Sophie Marchetti",role:"CTO",org:"HealthLink Europe",country:"🇫🇷",text:"The API documentation is the cleanest I've seen in health tech. We shipped our integration in 3 days. The Growth plan pays for itself with one fewer nurse call per day.",avatar:"S"},
];

const SAMPLES = [
  {label:"Blood Count (CBC)", text:`Patient: Jane Doe | DOB: 1985-03-12
Test: Complete Blood Count | Date: 2026-04-06

Hemoglobin: 10.2 g/dL [LOW]    Ref: 12.0–16.0
WBC: 12,400 /μL [HIGH]          Ref: 4,500–11,000
Platelets: 148,000 /μL          Ref: 150,000–400,000
MCV: 72 fL [LOW]                Ref: 80–100
Neutrophils: 78% [HIGH]         Ref: 40–70%`},
  {label:"Lipid Panel", text:`Patient: John Smith | Age: 52
Test: Fasting Lipid Panel | Date: 2026-04-06

Total Cholesterol: 238 mg/dL [HIGH]   Ref: <200
LDL Cholesterol: 162 mg/dL [HIGH]     Ref: <100
HDL Cholesterol: 38 mg/dL [LOW]       Ref: >40
Triglycerides: 198 mg/dL [HIGH]       Ref: <150
Fasting Glucose: 112 mg/dL [HIGH]     Ref: 70–100`},
  {label:"Thyroid Panel", text:`Patient: Maria Santos | Age: 38
Test: Thyroid Function | Date: 2026-04-06

TSH: 8.92 mIU/L [HIGH]           Ref: 0.4–4.0
Free T4: 0.72 ng/dL [LOW]        Ref: 0.8–1.8
Free T3: 2.4 pg/mL                Ref: 2.3–4.2
Anti-TPO: 340 IU/mL [HIGH]        Ref: <35`},
];

const SYS = `You are MediClear, a compassionate medical results interpreter. Translate complex medical results into clear plain language.
- Respond ONLY in the specified language
- Warm, reassuring tone
- Use ## headers: ## Summary, ## Key Findings, ## What This Means, ## Next Steps
- Bold abnormal values with **value**
- Never diagnose — always recommend consulting their doctor`;

const uid = () => Math.random().toString(36).slice(2,10);

function Navbar({ page, setPage, user, setUser, onAuth }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "nav-s" : ""}`}>
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => setPage("home")}>
          <span className="nav-icon">⚕</span>
          <span className="nav-name">MediClear</span>
          <span className="nav-pill">AI</span>
        </div>
        <div className="nav-links">
          {[["home","Home"],["demo","Live Demo"],["pricing","Pricing"],["about","About"]].map(([p,l]) => (
            <button key={p} className={`nav-link ${page===p?"active":""}`} onClick={() => setPage(p)}>{l}</button>
          ))}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <button className="nav-dash" onClick={() => setPage("dashboard")}>Dashboard</button>
              <button className="nav-out" onClick={() => { setUser(null); setPage("home"); }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="nav-in" onClick={() => onAuth("signin")}>Sign In</button>
              <button className="nav-cta" onClick={() => setPage("pricing")}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">⚕ MediClear</div>
          <p className="footer-tag">AI-powered medical interpretation for a multilingual world.</p>
          <div className="footer-certs">
            {["HIPAA Ready","GDPR Compliant","SSL Secured","SOC 2 Pending"].map(c => <span key={c} className="f-cert">{c}</span>)}
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="fc-title">Product</div>
            {[["demo","Live Demo"],["pricing","Pricing"],["dashboard","Dashboard"],["about","About Us"]].map(([pg,label]) => (
              <button key={label} className="fc-link" onClick={() => setPage(pg)}>{label}</button>
            ))}
          </div>
          <div className="footer-col">
            <div className="fc-title">Languages</div>
            {["English","Français","العربية","Hausa","Kiswahili","हिन्दी","Português","中文"].map(l => (
              <div key={l} className="fc-link">{l}</div>
            ))}
          </div>
          <div className="footer-col">
            <div className="fc-title">Legal</div>
            {["Privacy Policy","Terms of Service","HIPAA Policy","Medical Disclaimer"].map(l => (
              <div key={l} className="fc-link">{l}</div>
            ))}
          </div>
          <div className="footer-col">
            <div className="fc-title">Contact</div>
            <div className="fc-link">hello@mediclear.io</div>
            <div className="fc-link">support@mediclear.io</div>
            <div className="fc-link">partners@mediclear.io</div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MediClear — Global Medical Solutions. Est. 2024. All rights reserved.</span>
        <span>Not a substitute for professional medical advice.</span>
      </div>
    </footer>
  );
}

function HomePage({ setPage, onAuth }) {
  const [langIdx, setLangIdx] = useState(0);
  const [count, setCount] = useState(2431);
  useEffect(() => { const t = setInterval(() => setLangIdx(i => (i+1)%LANGS.length), 1800); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setCount(c => c + Math.floor(Math.random()*2+1)), 6000); return () => clearInterval(t); }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-bg"><div className="orb o1"/><div className="orb o2"/><div className="orb o3"/><div className="hgrid"/></div>
        <div className="hero-body">
          <div className="hero-left">
            <div className="hero-badge"><span className="hbdot"/>Trusted by {count.toLocaleString()} healthcare providers</div>
            <h1 className="hero-h1">Medical results,<br/>understood by <em>everyone</em></h1>
            <p className="hero-p">The world's leading AI platform for medical results interpretation. Plain language. Any report. <span className="hlang">{LANGS[langIdx].flag} {LANGS[langIdx].label}</span>.</p>
            <div className="hero-btns">
              <button className="hbtn-p" onClick={() => setPage("demo")}>Try Free Demo →</button>
              <button className="hbtn-s" onClick={() => setPage("pricing")}>View Pricing</button>
            </div>
            <div className="hero-social">
              <div className="havs">{["🇳🇬","🇫🇷","🇮🇳","🇰🇪","🇧🇷"].map((f,i) => <div key={i} className="hav" style={{zIndex:10-i}}>{f}</div>)}</div>
              <span className="hst"><strong>{count.toLocaleString()} organisations</strong> on our waitlist</span>
            </div>
          </div>
          <div className="hero-float">
            <div className="hf-bar"><span className="hfd r"/><span className="hfd y"/><span className="hfd g"/><span className="hf-title">Live Interpretation</span></div>
            <div className="hf-body">
              <div className="hf-in">
                <div className="hf-label">Input</div>
                <div className="hf-code">Hemoglobin: 10.2 g/dL [<span className="hflow">LOW</span>]<br/>WBC: 12,400 /μL [<span className="hflow">HIGH</span>]<br/>Platelets: 148,000 /μL [Normal]</div>
              </div>
              <div className="hf-arrow">↓ AI Interpretation</div>
              <div className="hf-out">
                <div className="hf-label">🇳🇬 Hausa</div>
                <div className="hf-result">Jinin ku yana ɗan ƙasa da al'ada. Wannan yana iya nufin jiki yana buƙatar ƙarin baƙin ƙarfe...</div>
                <span className="hf-ok">✓ Plain Language · 1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sbar">
        <div className="sbar-inner">
          {[["2,400+","Organisations"],["12","Languages"],["<2s","Response Time"],["99.9%","Uptime SLA"],["HIPAA","Ready"]].map(([v,l]) => (
            <div key={l} className="sbar-item"><div className="sbar-val">{v}</div><div className="sbar-label">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="con">
          <div className="eyebrow">How It Works</div>
          <h2 className="sec-h2">Three steps to clarity</h2>
          <p className="sec-sub">From raw lab report to plain-language patient explanation in under 2 seconds.</p>
          <div className="steps">
            {[
              {n:"01",ic:"📋",title:"Send any report",desc:"Paste raw text, upload a file, or send via API. Blood work, imaging, pathology, discharge summaries — any medical document."},
              {n:"02",ic:"🤖",title:"AI interprets",desc:"Our multilingual AI reads every value, identifies abnormal results, and crafts a compassionate plain-language explanation."},
              {n:"03",ic:"🌍",title:"Patient understands",desc:"Your patient receives a clear explanation in their language. English, Arabic, Hausa, Swahili, Hindi, or 7 more. No confusion."},
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-n">{s.n}</div>
                <div className="step-ic">{s.ic}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lang-sec">
        <div className="con">
          <div className="eyebrow light">Global by Design</div>
          <h2 className="sec-h2 light">12 languages. More coming.</h2>
          <p className="sec-sub light">The only medical AI built for truly global healthcare — including African languages underserved by every competitor.</p>
          <div className="lang-tiles">
            {LANGS.map(l => (
              <div key={l.code} className="ltile"><div className="ltile-f">{l.flag}</div><div className="ltile-n">{l.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="con">
          <div className="eyebrow">Who We Serve</div>
          <h2 className="sec-h2">Built for every healthcare touchpoint</h2>
          <div className="serve-grid">
            {[
              {ic:"🏥",t:"Clinics & Hospitals",d:"Reduce result-explanation calls. Send patients plain-language summaries automatically with their results."},
              {ic:"💊",t:"Pharmacies",d:"Attach clear explanations to prescriptions and lab referral slips. Customers leave informed, not confused."},
              {ic:"📱",t:"Health Apps",d:"3 lines of API code. Embed medical interpretation into your patient portal or mobile app instantly."},
              {ic:"⌚",t:"Device Makers",d:"Power your companion app with multilingual AI interpretation. Turn raw data into patient understanding."},
              {ic:"🔬",t:"Labs & Diagnostics",d:"Differentiate your lab reports with patient-friendly explanations. Add value without adding headcount."},
              {ic:"🩺",t:"Telehealth",d:"Give remote patients context before their consultation. Better informed patients, better outcomes."},
            ].map(s => (
              <div key={s.t} className="serve-card">
                <div className="sc-ic">{s.ic}</div>
                <h3 className="sc-t">{s.t}</h3>
                <p className="sc-d">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tsec">
        <div className="con">
          <div className="eyebrow">Testimonials</div>
          <h2 className="sec-h2">Trusted by healthcare leaders</h2>
          <div className="tgrid">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="tcard">
                <div className="tq">"</div>
                <p className="tt">{t.text}</p>
                <div className="tauthor">
                  <div className="tav">{t.avatar}</div>
                  <div><div className="tname">{t.name} {t.country}</div><div className="trole">{t.role}, {t.org}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="con">
          <div className="cta-box">
            <h2 className="cta-h2">Start interpreting in minutes.</h2>
            <p className="cta-sub">Free 30-day trial. No credit card required. All 12 languages included.</p>
            <div className="cta-btns">
              <button className="hbtn-p" onClick={() => setPage("pricing")}>Start Free Trial →</button>
              <button className="hbtn-s" onClick={() => setPage("demo")}>Watch Live Demo</button>
            </div>
            <p className="cta-fine">No contracts · Cancel anytime · HIPAA-ready infrastructure</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoPage() {
  const [input, setInput] = useState(SAMPLES[0].text);
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(null); setResult(null);
    const ll = LANGS.find(l => l.code===lang)?.label || "English";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYS,
          messages:[{role:"user", content:`Interpret in ${ll} (${lang}):\n\n${input}`}] })
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      setResult(d.content?.map(b => b.text||"").join("\n")||"");
    } catch(e) { setError("Interpretation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const renderResult = t => t.split("\n").map((line,i) => {
    const h = line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
    if (line.startsWith("## ")) return <div key={i} className="rh">{line.slice(3)}</div>;
    if (line.startsWith("- ")) return <li key={i} className="rl" dangerouslySetInnerHTML={{__html:h.slice(2)}}/>;
    if (!line.trim()) return <div key={i} style={{height:8}}/>;
    return <p key={i} className="rp" dangerouslySetInnerHTML={{__html:h}}/>;
  });

  return (
    <div className="demo-pg">
      <div className="con">
        <div className="pg-hdr">
          <div className="eyebrow">Live Demo</div>
          <h1 className="pg-title">See MediClear in action</h1>
          <p className="pg-sub">Use a sample report or paste your own. Choose any language. No account needed.</p>
        </div>
        <div className="demo-layout">
          <div className="demo-left">
            <div className="dblock">
              <div className="dblock-title">Load a sample</div>
              <div className="spills">
                {SAMPLES.map(s => <button key={s.label} className="spill" onClick={() => {setInput(s.text);setResult(null);}}>{s.label}</button>)}
              </div>
            </div>
            <div className="dblock">
              <div className="dblock-title">Paste your report</div>
              <textarea className="dta" value={input} onChange={e=>setInput(e.target.value)} rows={9}/>
              <button className="dupload" onClick={() => fileRef.current.click()}>📎 Upload .txt file</button>
              <input ref={fileRef} type="file" accept=".txt,.md" style={{display:"none"}}
                onChange={e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setInput(ev.target.result); r.readAsText(f); }}/>
            </div>
            <div className="dblock">
              <div className="dblock-title">Output language</div>
              <div className="dlang-grid">
                {LANGS.map(l => (
                  <button key={l.code} className={`dlang-btn ${lang===l.code?"active":""}`} onClick={() => setLang(l.code)}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="drun" onClick={run} disabled={loading||!input.trim()}>
              {loading ? <><span className="spin"/>Interpreting…</> : "⚕ Interpret Report →"}
            </button>
          </div>
          <div className="demo-right">
            <div className="drpanel">
              {!result&&!loading&&!error && (
                <div className="drph">
                  <div style={{fontSize:52}}>⚕️</div>
                  <div className="drph-title">Your interpretation appears here</div>
                  <div className="drph-sub">Hit Interpret to see the AI explain your results in plain language.</div>
                </div>
              )}
              {loading && (
                <div className="drload">
                  <div className="drpulse"/>
                  <div className="drload-title">Analysing your report…</div>
                  {["Parsing values","Detecting anomalies","Translating","Crafting explanation"].map((s,i) => (
                    <div key={i} className="drload-step"><span className="drload-dot" style={{animationDelay:`${i*0.25}s`}}/>{s}</div>
                  ))}
                </div>
              )}
              {error && <div className="drerr">⚠️ {error}</div>}
              {result && !loading && (
                <div className="drresult">
                  <div className="drr-hdr">
                    <div><div className="drr-title">Interpretation Complete</div><div className="drr-lang">{LANGS.find(l=>l.code===lang)?.flag} {LANGS.find(l=>l.code===lang)?.label}</div></div>
                    <button className="drr-copy" onClick={() => navigator.clipboard?.writeText(result)}>📋 Copy</button>
                  </div>
                  <div className="drr-body"><ul style={{listStyle:"none"}}>{renderResult(result)}</ul></div>
                  <div className="drr-disc">⚠️ For informational purposes only. Always consult your healthcare provider.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingPage({ setPage, setCheckoutPlan }) {
  const [billing, setBilling] = useState("monthly");
  const [faq, setFaq] = useState(null);

  const FAQS = [
    {q:"Is there a free trial?",a:"Yes — every plan starts with a 30-day free trial. No credit card required. You are only billed after your trial ends if you choose to continue."},
    {q:"Can I change or cancel my plan?",a:"Absolutely. Upgrade, downgrade, or cancel anytime from your dashboard. No penalties, no questions asked."},
    {q:"Is patient data stored?",a:"No. Reports are processed in real time and never stored permanently. We never use patient data to train AI models. All processing is encrypted end-to-end."},
    {q:"Do you offer HIPAA BAA?",a:"Yes — Business Associate Agreements are available on Growth and Enterprise plans. Enterprise includes BAA as standard."},
    {q:"What happens if I exceed my monthly limit?",a:"We notify you at 80% and 100% usage. You can upgrade anytime, or purchase pay-as-you-go top-ups at $0.08 per interpretation."},
    {q:"Do you support Arabic, Hindi, and African languages?",a:"Yes — all 12 languages including Arabic, Hindi, Chinese, Hausa, and Swahili are fully supported with correct script and right-to-left rendering."},
  ];

  return (
    <div className="pricing-pg">
      <div className="con">
        <div className="pg-hdr">
          <div className="eyebrow">Pricing</div>
          <h1 className="pg-title">Simple, transparent pricing</h1>
          <p className="pg-sub">Start free. Scale as you grow. All plans include a 30-day free trial.</p>
          <div className="btoggle">
            <button className={`btog-btn ${billing==="monthly"?"active":""}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`btog-btn ${billing==="yearly"?"active":""}`} onClick={() => setBilling("yearly")}>Yearly <span className="bsave">Save 20%</span></button>
          </div>
        </div>
        <div className="pgrid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`pcard ${plan.badge?"pfeat":""}`} style={plan.badge?{borderColor:plan.color}:{}}>
              {plan.badge && <div className="pbadge" style={{background:plan.color}}>{plan.badge}</div>}
              <div className="pname" style={{color:plan.color}}>{plan.name}</div>
              <div className="pprice-row">
                {plan.price ? (
                  <><span className="pcur">$</span><span className="pprice">{billing==="yearly"?plan.yearPrice:plan.price}</span><span className="pper">/mo</span></>
                ) : <span className="pcustom">Custom</span>}
              </div>
              {plan.price && billing==="yearly" && <div className="psave">Save ${(plan.price-plan.yearPrice)*12}/year</div>}
              <div className="pdesc">{plan.desc}</div>
              <button className="pcta" style={{background:plan.color}}
                onClick={() => { setCheckoutPlan(plan); setPage("checkout"); }}>
                {plan.price ? "Start Free Trial →" : "Contact Sales →"}
              </button>
              <div className="pdiv"/>
              <div className="pf-title">What's included</div>
              <ul className="pf-list">
                {plan.features.map(f => <li key={f} className="pf-yes"><span style={{color:plan.color}}>✓</span>{f}</li>)}
              </ul>
              {plan.notIncluded.length > 0 && (
                <ul className="pf-list">
                  {plan.notIncluded.map(f => <li key={f} className="pf-no"><span>✕</span>{f}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="faq">
          <h3 className="faq-title">Frequently asked questions</h3>
          {FAQS.map((f,i) => (
            <div key={i} className={`faq-item ${faq===i?"open":""}`}>
              <div className="faq-q" onClick={() => setFaq(faq===i?null:i)}>
                <span>{f.q}</span><span className="faq-arr">{faq===i?"▲":"▼"}</span>
              </div>
              {faq===i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ plan, setPage, setUser }) {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name:"",email:"",org:"",password:"",card:"",expiry:"",cvc:"",zip:""});

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = v => v.replace(/\D/g,"").slice(0,4).replace(/(.{2})/,"$1/");

  const pay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setUser({ name:form.name||"User", email:form.email, org:form.org, plan:plan.id, apiKey:"mc_live_" + uid() + uid() });
    setStep(3); setLoading(false);
  };

  if (!plan) return (
    <div style={{padding:"100px 24px",textAlign:"center",fontFamily:"sans-serif"}}>
      <p>No plan selected. <button style={{color:"#059669",border:"none",background:"none",cursor:"pointer",fontWeight:700}} onClick={() => setPage("pricing")}>View Pricing →</button></p>
    </div>
  );

  return (
    <div className="co-pg">
      <div className="co-inner">
        {step < 3 && (
          <div className="co-steps">
            {["Account","Payment","Done"].map((s,i) => (
              <div key={i} className={`co-step ${step===i+1?"active":step>i+1?"done":""}`}>
                <div className="co-snum">{step>i+1?"✓":i+1}</div>
                <div className="co-slabel">{s}</div>
              </div>
            ))}
          </div>
        )}
        <div className="co-layout">
          <div className="co-form">
            {step === 1 && (
              <>
                <h2 className="co-h2">Create your account</h2>
                <p className="co-sub">Start your 30-day free trial. No credit card needed yet.</p>
                <div className="co-fields">
                  {[{k:"name",l:"Full Name",ph:"Dr. Amara Diallo"},{k:"email",l:"Work Email",ph:"you@clinic.com"},{k:"org",l:"Organisation",ph:"HealthPlus Clinic"},{k:"password",l:"Password",ph:"Min. 8 characters",t:"password"}].map(f => (
                    <div key={f.k} className="co-field">
                      <label className="co-label">{f.l}</label>
                      <input className="co-input" type={f.t||"text"} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p=>({...p,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                  <button className="co-btn" style={{background:plan.color}} onClick={() => setStep(2)} disabled={!form.name||!form.email||!form.password}>
                    Continue to Payment →
                  </button>
                  <p className="co-fine">By continuing you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="co-h2">Payment details</h2>
                <p className="co-sub">Your card will not be charged until your 30-day trial ends.</p>
                <div className="co-btoggle">
                  <button className={`co-btog ${billing==="monthly"?"active":""}`} onClick={() => setBilling("monthly")}>Monthly</button>
                  <button className={`co-btog ${billing==="yearly"?"active":""}`} onClick={() => setBilling("yearly")}>Yearly <span className="bsave">Save 20%</span></button>
                </div>
                <div className="co-fields">
                  <div className="co-field">
                    <label className="co-label">Card Number</label>
                    <input className="co-input co-card" placeholder="4242 4242 4242 4242" value={form.card} onChange={e => setForm(p=>({...p,card:fmtCard(e.target.value)}))} maxLength={19}/>
                    <div className="co-cards">💳 Visa · Mastercard · Amex · Discover</div>
                  </div>
                  <div className="co-row3">
                    <div className="co-field"><label className="co-label">Expiry</label><input className="co-input" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(p=>({...p,expiry:fmtExp(e.target.value)}))} maxLength={5}/></div>
                    <div className="co-field"><label className="co-label">CVC</label><input className="co-input" placeholder="123" value={form.cvc} onChange={e => setForm(p=>({...p,cvc:e.target.value.replace(/\D/g,"").slice(0,4)}))} maxLength={4}/></div>
                    <div className="co-field"><label className="co-label">ZIP</label><input className="co-input" placeholder="10001" value={form.zip} onChange={e => setForm(p=>({...p,zip:e.target.value.slice(0,10)}))}/></div>
                  </div>
                  <div className="co-ssl">🔒 256-bit SSL · Powered by Stripe</div>
                  <button className="co-btn" style={{background:plan.color}} onClick={pay}
                    disabled={loading||!form.card||form.card.replace(/\s/g,"").length<16||!form.expiry||!form.cvc}>
                    {loading ? <><span className="spin"/>Processing…</> : `Start Free Trial — ${plan.name}`}
                  </button>
                  <p className="co-fine">No charge until trial ends · Cancel anytime</p>
                </div>
              </>
            )}
            {step === 3 && (
              <div className="co-success">
                <div style={{fontSize:64,marginBottom:16}}>🎉</div>
                <h2 className="co-h2">Welcome to MediClear!</h2>
                <p className="co-sub">Your {plan.name} trial is active. Free for 30 days — no charge until {new Date(Date.now()+30*86400000).toLocaleDateString()}.</p>
                <div className="co-perks">
                  {["API key generated","Dashboard ready","All languages active","Docs sent to your email"].map(p => (
                    <div key={p} className="co-perk"><span style={{color:"#059669"}}>✓</span>{p}</div>
                  ))}
                </div>
                <button className="co-btn" style={{background:plan.color}} onClick={() => setPage("dashboard")}>Go to Dashboard →</button>
              </div>
            )}
          </div>
          {step < 3 && (
            <div className="co-summary">
              <div className="cs-head">Order Summary</div>
              <div className="cs-plan"><span style={{color:plan.color,fontWeight:800}}>{plan.name} Plan</span></div>
              <div className="cs-row"><span>30-day free trial</span><span style={{color:"#4ecca8",fontWeight:800}}>FREE</span></div>
              {plan.price && <div className="cs-row"><span>Then from</span><span>${billing==="yearly"?plan.yearPrice:plan.price}/mo</span></div>}
              <div className="cs-div"/>
              {plan.features.slice(0,5).map(f => <div key={f} className="cs-feat"><span style={{color:plan.color}}>✓</span>{f}</div>)}
              <div className="cs-div"/>
              {["30-day free trial","Cancel anytime","HIPAA-ready","Onboarding support"].map(g => (
                <div key={g} className="cs-g">🛡️ {g}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ user, setPage }) {
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  if (!user) return (
    <div style={{padding:"120px 24px",textAlign:"center",fontFamily:"sans-serif"}}>
      <h2 style={{marginBottom:12}}>Sign in to access your dashboard</h2>
      <button className="hbtn-p" onClick={() => setPage("pricing")}>Get Started →</button>
    </div>
  );

  const copy = () => { navigator.clipboard?.writeText(user.apiKey); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const plan = PLANS.find(p=>p.id===user.plan)||PLANS[0];
  const USAGE = [42,89,134,201,178,256,312,289,401,378,445,512];
  const maxU = Math.max(...USAGE);
  const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const apiSnippet = [
    "// MediClear REST API — Quick Start",
    "",
    "const response = await fetch(",
    "  'https://api.mediclear.io/v1/interpret',",
    "  {",
    "    method: 'POST',",
    "    headers: {",
    "      'Content-Type': 'application/json',",
    `      'Authorization': 'Bearer ${user.apiKey}'`,
    "    },",
    "    body: JSON.stringify({",
    "      report: labResultText,",
    "      language: 'sw',",
    "      format: 'plain'",
    "    })",
    "  }",
    ");",
    "",
    "const data = await response.json();",
    "console.log(data.interpretation);",
  ].join("\n");

  return (
    <div className="dash-pg">
      <div className="dash-side">
        <div className="dash-uinfo">
          <div className="dash-av">{(user.name||"U")[0]}</div>
          <div className="dash-uname">{user.name}</div>
          <div className="dash-uorg">{user.org||"Your Organisation"}</div>
          <div className="dash-upill" style={{background:plan.color}}>{plan.name}</div>
        </div>
        <div className="dash-nav">
          {[["overview","📊","Overview"],["api","🔑","API Keys"],["billing","💳","Billing"],["settings","⚙️","Settings"]].map(([t,ic,l]) => (
            <button key={t} className={`dash-ni ${tab===t?"active":""}`} onClick={() => setTab(t)}>
              <span>{ic}</span><span>{l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dash-main">
        {tab==="overview" && (
          <div className="dash-con">
            <div className="dash-hdr">
              <div><h2 className="dash-title">Welcome back, {(user.name||"there").split(" ")[0]}! 👋</h2><p className="dash-sub">Here is your MediClear overview</p></div>
              <div className="dash-trial">🎉 Trial active — 30 days free</div>
            </div>
            <div className="dash-stats">
              {[["⚕️","1,247","This Month","interpretations"],["⚡","1.4s","Avg Response","across all calls"],["🌍","8","Languages","of 12 used"],["✅","99.8%","Success Rate","last 30 days"]].map(([ic,v,l,s]) => (
                <div key={l} className="dstat"><div className="dstat-ic">{ic}</div><div className="dstat-v">{v}</div><div className="dstat-l">{l}</div><div className="dstat-s">{s}</div></div>
              ))}
            </div>
            <div className="dash-chart">
              <div className="dc-title">Monthly Usage</div>
              <div className="dc-bars">
                {USAGE.map((v,i) => (
                  <div key={i} className="dc-col">
                    <div className="dc-bwrap"><div className="dc-bar" style={{height:`${(v/maxU)*100}%`,background:plan.color}}><div className="dc-tip">{v}</div></div></div>
                    <div className="dc-mo">{MO[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-recent">
              <div className="dr-title">Recent API Calls</div>
              <table className="dr-tbl">
                <thead><tr>{["Time","Report Type","Language","Status","Latency"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["2m ago","CBC Panel","🇳🇬 Hausa","200 OK","1.2s"],["8m ago","Lipid Panel","🇫🇷 French","200 OK","1.5s"],["15m ago","HbA1c","🇮🇳 Hindi","200 OK","0.9s"],["31m ago","X-Ray Report","🇸🇦 Arabic","200 OK","1.8s"],["1h ago","Urine Analysis","🇰🇪 Swahili","200 OK","1.1s"]].map((r,i) => (
                    <tr key={i}><td className="dr-m">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className="dr-ok">{r[3]}</span></td><td className="dr-m">{r[4]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="api" && (
          <div className="dash-con">
            <h2 className="dash-title">API Keys</h2>
            <div className="api-kcard">
              <div className="akc-label">🔑 Live API Key</div>
              <div className="akc-row"><code className="akc-key">{user.apiKey}</code><button className="akc-copy" onClick={copy}>{copied?"✓ Copied!":"Copy"}</button></div>
              <p className="akc-hint">Keep this secret. Never expose it in client-side code.</p>
            </div>
            <div className="api-code">
              <div className="acode-hdr">
                <div className="acode-dots"><span className="acd r"/><span className="acd y"/><span className="acd g"/></div>
                <span className="acode-lang">JavaScript — REST API</span>
              </div>
              <pre className="acode-pre">{apiSnippet}</pre>
            </div>
          </div>
        )}
        {tab==="billing" && (
          <div className="dash-con">
            <h2 className="dash-title">Billing & Subscription</h2>
            <div className="bill-cur">
              <div><div className="bill-pname" style={{color:plan.color}}>{plan.name} Plan</div><div className="bill-price">{plan.price?`$${plan.price}/month`:"Custom"}</div><div className="bill-trial">🎉 Free trial — 30 days remaining</div></div>
              <button className="bill-up" onClick={() => setPage("pricing")}>Upgrade →</button>
            </div>
            <div className="bill-inv"><div className="bill-inv-title">Invoices</div><div className="bill-none">No invoices yet — your trial is active.</div></div>
          </div>
        )}
        {tab==="settings" && (
          <div className="dash-con">
            <h2 className="dash-title">Settings</h2>
            <div className="dash-soon"><div style={{fontSize:48}}>🚧</div><p>Coming in the next release.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

function AboutPage({ setPage }) {
  return (
    <div className="about-pg">
      <div className="con">
        <div className="pg-hdr">
          <div className="eyebrow">Our Mission</div>
          <h1 className="pg-title">Healthcare information should have no language barrier</h1>
          <p className="pg-sub">MediClear was built on a simple belief: every patient, regardless of language or literacy, deserves to understand their own health.</p>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="about-h2">The problem we are solving</h2>
            <p>Every day, millions of patients receive medical results they cannot understand. A CBC report with a flagged haemoglobin level. A lipid panel printed in jargon. An imaging report that uses terms no non-specialist can parse.</p>
            <p>For patients in a foreign language healthcare system — in Lagos, Nairobi, Paris, New Delhi — this is not just frustrating. It is a crisis. Medical confusion leads to missed follow-ups, delayed diagnoses, and avoidable suffering.</p>
            <p>MediClear exists to close this gap. We built an AI that reads any medical report and translates it into the warm, clear language of a knowledgeable friend — in 12 languages, in under 2 seconds.</p>
          </div>
          <div className="about-values">
            {[
              {ic:"❤️",t:"Patient First",d:"Every decision starts with the patient — their dignity, understanding, and health outcomes."},
              {ic:"🌍",t:"Global by Design",d:"We prioritised African languages from day one. Every language deserves the same quality of care."},
              {ic:"🔒",t:"Privacy Sacred",d:"We never store patient data permanently or use it to train models. Your patients information is theirs."},
              {ic:"🤝",t:"Partner-Led",d:"We grow through the success of our partners. Your outcomes are our outcomes."},
            ].map(v => (
              <div key={v.t} className="vcard"><div className="vcard-ic">{v.ic}</div><div><div className="vcard-t">{v.t}</div><div className="vcard-d">{v.d}</div></div></div>
            ))}
          </div>
        </div>
        <div className="about-cta">
          <h2>Ready to make a difference?</h2>
          <button className="hbtn-p" onClick={() => setPage("pricing")}>Start Building →</button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ mode, setMode, setUser, onClose, setPage }) {
  const [form, setForm] = useState({name:"",email:"",password:""});
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!form.email||!form.password) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1100));
    setUser({name:form.name||form.email.split("@")[0],email:form.email,org:"",plan:"starter",apiKey:"mc_live_"+uid()+uid()});
    onClose(); setPage("dashboard"); setLoading(false);
  };
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-logo">⚕ MediClear</div>
        <h2 className="modal-h2">{mode==="signin"?"Sign in":"Create account"}</h2>
        <div className="modal-fields">
          {mode==="signup"&&<div className="co-field"><label className="co-label">Full Name</label><input className="co-input" placeholder="Dr. Amara Diallo" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>}
          <div className="co-field"><label className="co-label">Email</label><input className="co-input" type="email" placeholder="you@clinic.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
          <div className="co-field"><label className="co-label">Password</label><input className="co-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/></div>
          <button className="co-btn" style={{background:"#059669"}} onClick={submit} disabled={loading||!form.email||!form.password}>
            {loading?<><span className="spin"/>Please wait…</>:mode==="signin"?"Sign In →":"Create Account →"}
          </button>
        </div>
        <div className="modal-sw">
          {mode==="signin"?"No account yet?":"Already have an account?"}
          <button className="modal-sw-btn" onClick={()=>setMode(mode==="signin"?"signup":"signin")}>{mode==="signin"?"Sign up":"Sign in"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const onAuth = mode => { setAuthMode(mode); setAuthOpen(true); };
  const nav = p => { setPage(p); window.scrollTo(0,0); };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-root">
        <Navbar page={page} setPage={nav} user={user} setUser={setUser} onAuth={onAuth}/>
        <div className="app-body">
          {page==="home"      && <HomePage     setPage={nav} onAuth={onAuth}/>}
          {page==="demo"      && <DemoPage/>}
          {page==="pricing"   && <PricingPage  setPage={nav} setCheckoutPlan={setCheckoutPlan}/>}
          {page==="checkout"  && <CheckoutPage plan={checkoutPlan} setPage={nav} setUser={setUser}/>}
          {page==="dashboard" && <DashboardPage user={user} setPage={nav}/>}
          {page==="about"     && <AboutPage    setPage={nav}/>}
        </div>
        <Footer setPage={nav}/>
        {authOpen && <AuthModal mode={authMode} setMode={setAuthMode} setUser={setUser} onClose={()=>setAuthOpen(false)} setPage={nav}/>}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#0c0f1a;--bg:#f3f0e8;--white:#fff;--bdr:#e0dcd2;--green:#059669;--gd:#047857;--gl:#ecfdf5;--blue:#2563eb;--red:#dc2626;--purple:#7c3aed;--mid:#4b5563;--muted:#9ca3af;--card:#fffef9;--r:16px;--rs:10px;--rxs:6px}
body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--ink)}
.app-root{min-height:100vh;display:flex;flex-direction:column}
.app-body{flex:1;padding-top:64px}
.con{max-width:1120px;margin:0 auto;padding:0 24px}
.nav{position:fixed;top:0;left:0;right:0;z-index:99;padding:0 24px;transition:all .25s}
.nav-s{background:rgba(12,15,26,.94);backdrop-filter:blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.nav-inner{max-width:1120px;margin:0 auto;height:64px;display:flex;align-items:center;gap:28px}
.nav-brand{display:flex;align-items:center;gap:8px;cursor:pointer}
.nav-icon{font-size:20px;color:#4ecca8}
.nav-name{font-family:'Cormorant Garamond',serif;font-size:20px;color:white;font-weight:600}
.nav-pill{font-size:9px;background:rgba(78,204,168,.2);border:1px solid rgba(78,204,168,.3);color:#4ecca8;padding:2px 7px;border-radius:20px;font-weight:700;letter-spacing:1px}
.nav-links{display:flex;gap:2px;flex:1}
.nav-link{padding:7px 13px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,.45);cursor:pointer;border-radius:var(--rxs);transition:all .15s}
.nav-link:hover,.nav-link.active{color:white;background:rgba(255,255,255,.07)}
.nav-right{display:flex;align-items:center;gap:8px;margin-left:auto}
.nav-in{padding:7px 16px;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.65);border-radius:var(--rxs);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.nav-in:hover{border-color:rgba(255,255,255,.4);color:white}
.nav-cta{padding:8px 20px;background:#4ecca8;color:#0c0f1a;border:none;border-radius:var(--rxs);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
.nav-cta:hover{background:#3dbf9a;transform:translateY(-1px)}
.nav-dash{padding:7px 16px;background:rgba(255,255,255,.1);border:none;color:white;border-radius:var(--rxs);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer}
.nav-out{padding:7px 12px;border:none;background:transparent;color:rgba(255,255,255,.35);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer}
.hero{min-height:100vh;background:var(--ink);position:relative;overflow:hidden;display:flex;align-items:center;padding:80px 24px}
.hero-bg{position:absolute;inset:0;pointer-events:none}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.o1{width:580px;height:580px;background:#059669;opacity:.11;top:-160px;left:-100px}
.o2{width:380px;height:380px;background:#7c3aed;opacity:.09;bottom:-80px;right:8%}
.o3{width:260px;height:260px;background:#d97706;opacity:.07;top:35%;right:28%}
.hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025)1px,transparent 1px);background-size:56px 56px}
.hero-body{position:relative;max-width:1120px;margin:0 auto;width:100%;display:flex;align-items:center;justify-content:space-between;gap:40px;z-index:1}
.hero-left{flex:1;max-width:580px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(78,204,168,.12);border:1px solid rgba(78,204,168,.25);color:#4ecca8;font-size:13px;font-weight:600;padding:7px 16px;border-radius:24px;margin-bottom:24px}
.hbdot{width:7px;height:7px;background:#4ecca8;border-radius:50%;animation:hbd 1.5s ease-in-out infinite}
@keyframes hbd{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:68px;font-weight:600;color:white;line-height:1.05;margin-bottom:18px}
.hero-h1 em{color:#4ecca8;font-style:italic}
.hero-p{font-size:18px;color:rgba(255,255,255,.5);line-height:1.75;max-width:500px;margin-bottom:32px;font-weight:300}
.hlang{color:#4ecca8;font-weight:700}
.hero-btns{display:flex;gap:12px;margin-bottom:40px;flex-wrap:wrap}
.hbtn-p{padding:15px 34px;background:var(--green);color:white;border:none;border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
.hbtn-p:hover{background:var(--gd);transform:translateY(-2px)}
.hbtn-s{padding:15px 28px;background:transparent;color:rgba(255,255,255,.65);border:1.5px solid rgba(255,255,255,.18);border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.hbtn-s:hover{border-color:rgba(255,255,255,.45);color:white}
.hero-social{display:flex;align-items:center;gap:12px}
.havs{display:flex}
.hav{width:34px;height:34px;border-radius:50%;border:2px solid var(--ink);background:#1a1d28;font-size:16px;display:flex;align-items:center;justify-content:center;margin-left:-7px}
.hav:first-child{margin-left:0}
.hst{font-size:13px;color:rgba(255,255,255,.38)}
.hst strong{color:rgba(255,255,255,.65)}
.hero-float{width:340px;flex-shrink:0;background:#12151f;border:1px solid rgba(255,255,255,.07);border-radius:var(--r);overflow:hidden;box-shadow:0 28px 72px rgba(0,0,0,.5);animation:flt 4s ease-in-out infinite}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hf-bar{display:flex;align-items:center;gap:5px;padding:11px 14px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.05)}
.hfd{width:10px;height:10px;border-radius:50%}
.hfd.r{background:#ff5f57}.hfd.y{background:#febc2e}.hfd.g{background:#28c840}
.hf-title{font-size:11px;color:rgba(255,255,255,.25);margin-left:6px;font-family:'JetBrains Mono',monospace}
.hf-body{padding:14px;display:flex;flex-direction:column;gap:10px}
.hf-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:5px}
.hf-in,.hf-out{background:rgba(255,255,255,.03);border-radius:8px;padding:10px}
.hf-code{font-family:'JetBrains Mono',monospace;font-size:11px;color:#c8d3e8;line-height:1.7}
.hflow{color:#f87171}
.hf-arrow{text-align:center;font-size:11px;font-weight:700;color:#4ecca8;letter-spacing:.5px}
.hf-result{font-size:12px;color:#c8d3e8;line-height:1.6;margin-bottom:7px}
.hf-ok{font-size:10px;color:#4ecca8;font-weight:700}
.sbar{background:var(--green);padding:28px 24px}
.sbar-inner{max-width:1120px;margin:0 auto;display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px}
.sbar-item{text-align:center}
.sbar-val{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:white}
.sbar-label{font-size:12px;color:rgba(255,255,255,.7);font-weight:600;letter-spacing:.5px;margin-top:2px}
.sec{padding:80px 0}
.eyebrow{display:inline-block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--green);background:var(--gl);padding:5px 13px;border-radius:20px;margin-bottom:12px}
.eyebrow.light{background:rgba(78,204,168,.15);color:#4ecca8}
.sec-h2{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;line-height:1.15;margin-bottom:12px}
.sec-h2.light{color:white}
.sec-sub{font-size:16px;color:var(--mid);line-height:1.75;max-width:500px;margin-bottom:44px;font-weight:400}
.sec-sub.light{color:rgba(255,255,255,.5)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.step-card{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);padding:28px}
.step-n{font-size:10px;font-weight:800;letter-spacing:2px;color:var(--green);margin-bottom:14px}
.step-ic{font-size:36px;margin-bottom:14px}
.step-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;margin-bottom:8px}
.step-desc{font-size:13px;color:var(--mid);line-height:1.75}
.lang-sec{background:var(--ink);padding:80px 0}
.lang-tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.ltile{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:var(--rs);padding:16px;text-align:center;transition:all .2s;cursor:default}
.ltile:hover{background:rgba(78,204,168,.09);border-color:rgba(78,204,168,.25);transform:translateY(-2px)}
.ltile-f{font-size:26px;margin-bottom:6px}
.ltile-n{font-size:11px;font-weight:700;color:rgba(255,255,255,.5)}
.serve-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.serve-card{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);padding:26px;transition:all .2s}
.serve-card:hover{border-color:var(--green);transform:translateY(-2px);box-shadow:0 8px 28px rgba(5,150,105,.07)}
.sc-ic{font-size:34px;margin-bottom:12px}
.sc-t{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;margin-bottom:7px}
.sc-d{font-size:13px;color:var(--mid);line-height:1.7}
.tsec{background:#f0ece2;padding:80px 0}
.tgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.tcard{background:white;border:1px solid var(--bdr);border-radius:var(--r);padding:28px;position:relative}
.tq{font-size:60px;font-family:'Cormorant Garamond',serif;color:var(--green);opacity:.18;position:absolute;top:14px;left:22px;line-height:1}
.tt{font-size:14px;color:var(--mid);line-height:1.8;margin-bottom:18px;font-style:italic;padding-top:14px}
.tauthor{display:flex;align-items:center;gap:10px}
.tav{width:40px;height:40px;border-radius:50%;background:var(--green);color:white;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tname{font-size:13px;font-weight:800;color:var(--ink)}
.trole{font-size:11px;color:var(--muted)}
.cta-sec{background:var(--ink);padding:88px 0}
.cta-box{text-align:center}
.cta-h2{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:600;color:white;margin-bottom:12px}
.cta-sub{font-size:17px;color:rgba(255,255,255,.45);margin-bottom:32px}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:16px}
.cta-fine{font-size:12px;color:rgba(255,255,255,.22)}
.pg-hdr{text-align:center;padding:100px 0 48px;max-width:640px;margin:0 auto}
.pg-title{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:600;line-height:1.1;margin-bottom:12px}
.pg-sub{font-size:16px;color:var(--mid);line-height:1.75}
.demo-pg{padding-bottom:72px}
.demo-layout{display:grid;grid-template-columns:420px 1fr;gap:22px;align-items:start}
.demo-left{display:flex;flex-direction:column;gap:14px}
.dblock{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);padding:18px}
.dblock-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.spills{display:flex;gap:7px;flex-wrap:wrap}
.spill{padding:6px 14px;border:1.5px solid var(--bdr);border-radius:20px;background:white;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:var(--mid);cursor:pointer;transition:all .15s}
.spill:hover{border-color:var(--green);color:var(--green)}
.dta{width:100%;border:1.5px solid var(--bdr);border-radius:var(--rs);padding:12px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink);background:#faf8f4;resize:vertical;outline:none;line-height:1.7;transition:border-color .2s;margin-bottom:9px}
.dta:focus{border-color:var(--green);background:white}
.dupload{padding:6px 13px;border:1.5px dashed #ccc;border-radius:var(--rxs);background:transparent;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--muted);cursor:pointer;transition:all .15s}
.dupload:hover{border-color:var(--green);color:var(--green)}
.dlang-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.dlang-btn{display:flex;align-items:center;gap:5px;padding:7px 8px;border:1.5px solid var(--bdr);border-radius:var(--rxs);background:white;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:var(--mid);cursor:pointer;transition:all .15s}
.dlang-btn:hover{border-color:var(--green);color:var(--green)}
.dlang-btn.active{background:var(--ink);border-color:var(--ink);color:white}
.drun{width:100%;padding:15px;background:var(--green);color:white;border:none;border-radius:var(--rs);font-family:'Cormorant Garamond',serif;font-size:18px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.drun:hover:not(:disabled){background:var(--gd);transform:translateY(-1px)}
.drun:disabled{opacity:.4;cursor:not-allowed}
.drpanel{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);min-height:480px;display:flex;flex-direction:column}
.drph{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;gap:10px}
.drph-title{font-family:'Cormorant Garamond',serif;font-size:22px}
.drph-sub{font-size:13px;color:var(--muted);line-height:1.7;max-width:280px}
.drload{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;gap:14px}
.drpulse{width:52px;height:52px;border-radius:50%;background:var(--green);animation:drp 1.3s ease-in-out infinite}
@keyframes drp{0%,100%{transform:scale(.85);opacity:.6}50%{transform:scale(1.1);opacity:1}}
.drload-title{font-family:'Cormorant Garamond',serif;font-size:20px}
.drload-step{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.drload-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:dld 1.1s ease-in-out infinite alternate}
@keyframes dld{from{opacity:.3;transform:scale(.8)}to{opacity:1;transform:scale(1.2)}}
.drerr{margin:20px;background:#fff2f2;border-left:3px solid var(--red);border-radius:var(--rs);padding:14px;color:var(--red);font-size:14px}
.drresult{flex:1;display:flex;flex-direction:column;animation:fup .35s ease}
@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.drr-hdr{background:var(--ink);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-radius:var(--r) var(--r) 0 0}
.drr-title{font-family:'Cormorant Garamond',serif;font-size:17px;color:white}
.drr-lang{font-size:12px;color:rgba(255,255,255,.38);margin-top:2px}
.drr-copy{padding:6px 14px;background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.15);border-radius:20px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer}
.drr-body{flex:1;padding:20px;overflow-y:auto;max-height:460px}
.rh{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--green);margin:16px 0 7px;padding-bottom:5px;border-bottom:2px solid var(--gl)}
.rh:first-child{margin-top:0}
.rp{font-size:14px;color:var(--ink);line-height:1.8;margin-bottom:7px}
.rl{font-size:14px;color:var(--ink);line-height:1.7;margin-bottom:5px;padding-left:14px;position:relative;list-style:none}
.rl::before{content:"•";position:absolute;left:0;color:var(--green);font-weight:700}
.drr-disc{margin:0 20px 14px;background:#fffbec;border-left:3px solid #f0c040;border-radius:var(--rxs);padding:10px 12px;font-size:12px;color:#7a6520;line-height:1.6}
.pricing-pg{padding-bottom:72px}
.btoggle{display:inline-flex;background:#e4e0d8;border-radius:10px;padding:3px;gap:2px;margin-top:18px}
.btog-btn{padding:8px 22px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;color:var(--muted);cursor:pointer;border-radius:8px;transition:all .15s;display:flex;align-items:center;gap:6px}
.btog-btn.active{background:white;color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.1)}
.bsave{font-size:10px;background:#d1fae5;color:var(--green);padding:2px 6px;border-radius:8px;font-weight:800}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:56px}
.pcard{background:var(--card);border:1.5px solid var(--bdr);border-radius:var(--r);padding:30px;position:relative;transition:all .2s}
.pcard:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,.08)}
.pfeat{box-shadow:0 8px 28px rgba(0,0,0,.1)}
.pbadge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);color:white;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:4px 16px;border-radius:20px;white-space:nowrap}
.pname{font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
.pprice-row{display:flex;align-items:baseline;gap:2px;margin-bottom:4px}
.pcur{font-size:20px;font-weight:700;color:var(--ink);align-self:flex-start;margin-top:5px}
.pprice{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:600;color:var(--ink)}
.pper{font-size:15px;color:var(--muted)}
.pcustom{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:600;color:var(--ink)}
.psave{font-size:11px;font-weight:700;color:var(--green);margin-bottom:5px}
.pdesc{font-size:13px;color:var(--mid);margin-bottom:18px;line-height:1.6;min-height:38px}
.pcta{width:100%;padding:13px;color:white;border:none;border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:18px}
.pcta:hover{filter:brightness(1.1);transform:translateY(-1px)}
.pdiv{height:1px;background:var(--bdr);margin-bottom:14px}
.pf-title{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.pf-list{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
.pf-yes{display:flex;align-items:flex-start;gap:7px;font-size:13px;color:var(--mid)}
.pf-no{display:flex;align-items:flex-start;gap:7px;font-size:13px;color:#ccc}
.faq{max-width:680px;margin:0 auto 40px}
.faq-title{font-family:'Cormorant Garamond',serif;font-size:28px;text-align:center;margin-bottom:20px}
.faq-item{background:var(--card);border:1px solid var(--bdr);border-radius:var(--rs);overflow:hidden;margin-bottom:7px}
.faq-item.open{border-color:var(--green)}
.faq-q{display:flex;justify-content:space-between;align-items:center;padding:15px 18px;cursor:pointer;font-size:14px;font-weight:700;gap:10px}
.faq-q:hover{background:#f9f6f0}
.faq-arr{font-size:10px;color:var(--muted);flex-shrink:0}
.faq-a{padding:0 18px 15px;font-size:13px;color:var(--mid);line-height:1.75;border-top:1px solid var(--bdr)}
.co-pg{padding:88px 24px 72px}
.co-inner{max-width:860px;margin:0 auto}
.co-steps{display:flex;justify-content:center;gap:0;margin-bottom:36px}
.co-step{display:flex;align-items:center;gap:9px;padding:0 22px;position:relative}
.co-step:not(:last-child)::after{content:"";position:absolute;right:0;top:50%;width:22px;height:1px;background:var(--bdr)}
.co-snum{width:30px;height:30px;border-radius:50%;border:2px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--muted);background:white}
.co-step.active .co-snum{border-color:var(--green);color:var(--green)}
.co-step.done .co-snum{background:var(--green);border-color:var(--green);color:white}
.co-slabel{font-size:13px;font-weight:700;color:var(--muted)}
.co-step.active .co-slabel{color:var(--ink)}
.co-layout{display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start}
.co-form{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);padding:30px}
.co-h2{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin-bottom:5px}
.co-sub{font-size:13px;color:var(--muted);margin-bottom:22px;line-height:1.6}
.co-btoggle{display:inline-flex;background:#e4e0d8;border-radius:8px;padding:3px;gap:2px;margin-bottom:18px}
.co-btog{padding:7px 16px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:var(--muted);cursor:pointer;border-radius:6px;transition:all .15s;display:flex;align-items:center;gap:5px}
.co-btog.active{background:white;color:var(--ink)}
.co-fields{display:flex;flex-direction:column;gap:13px}
.co-field{display:flex;flex-direction:column;gap:4px}
.co-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.co-label{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.co-input{padding:10px 13px;border:1.5px solid var(--bdr);border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:14px;color:var(--ink);outline:none;background:#faf8f4;transition:border-color .2s}
.co-input:focus{border-color:var(--green);background:white}
.co-card{font-family:'JetBrains Mono',monospace;letter-spacing:2px}
.co-cards{font-size:11px;color:var(--muted);margin-top:4px}
.co-ssl{font-size:12px;color:var(--muted);background:#f9f6f0;padding:9px 13px;border-radius:var(--rxs)}
.co-btn{width:100%;padding:14px;color:white;border:none;border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:7px;margin-top:3px}
.co-btn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}
.co-btn:disabled{opacity:.4;cursor:not-allowed}
.co-fine{font-size:11px;color:var(--muted);text-align:center;line-height:1.5}
.co-success{text-align:center;padding:16px 0}
.co-perks{display:flex;flex-direction:column;gap:9px;margin:20px 0;background:#f9f6f0;border-radius:var(--rs);padding:18px;text-align:left}
.co-perk{font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px}
.co-summary{background:var(--ink);border-radius:var(--r);padding:22px;position:sticky;top:80px}
.cs-head{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px}
.cs-plan{font-size:18px;margin-bottom:14px}
.cs-row{display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:7px;font-weight:600}
.cs-div{height:1px;background:rgba(255,255,255,.07);margin:12px 0}
.cs-feat{font-size:12px;color:rgba(255,255,255,.45);margin-bottom:6px;display:flex;align-items:flex-start;gap:7px}
.cs-g{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:5px}
.dash-pg{display:grid;grid-template-columns:210px 1fr;min-height:calc(100vh - 64px)}
.dash-side{background:var(--ink);padding:20px 0;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto}
.dash-uinfo{padding:18px 18px 20px;border-bottom:1px solid rgba(255,255,255,.06);text-align:center}
.dash-av{width:48px;height:48px;border-radius:50%;background:var(--green);color:white;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 9px}
.dash-uname{font-size:13px;font-weight:700;color:white;margin-bottom:2px}
.dash-uorg{font-size:11px;color:rgba(255,255,255,.35);margin-bottom:7px}
.dash-upill{font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:white;padding:3px 10px;border-radius:12px;display:inline-block}
.dash-nav{padding:10px 0}
.dash-ni{width:100%;display:flex;align-items:center;gap:9px;padding:11px 18px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.38);cursor:pointer;text-align:left;transition:all .15s}
.dash-ni:hover{color:rgba(255,255,255,.75);background:rgba(255,255,255,.04)}
.dash-ni.active{color:white;background:rgba(255,255,255,.07);border-right:3px solid #4ecca8}
.dash-main{padding:28px;background:var(--bg);overflow-y:auto}
.dash-con{max-width:820px}
.dash-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.dash-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;margin-bottom:3px}
.dash-sub{font-size:13px;color:var(--muted)}
.dash-trial{font-size:11px;background:#d1fae5;color:var(--green);font-weight:800;padding:5px 13px;border-radius:20px;white-space:nowrap}
.dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.dstat{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:16px}
.dstat-ic{font-size:22px;margin-bottom:7px}
.dstat-v{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;margin-bottom:2px}
.dstat-l{font-size:11px;font-weight:700;color:var(--ink)}
.dstat-s{font-size:11px;color:var(--muted)}
.dash-chart{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:18px;margin-bottom:18px}
.dc-title{font-size:12px;font-weight:800;margin-bottom:14px}
.dc-bars{display:flex;align-items:flex-end;gap:5px;height:130px;padding-top:14px}
.dc-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%}
.dc-bwrap{flex:1;width:100%;display:flex;align-items:flex-end}
.dc-bar{width:100%;border-radius:3px 3px 0 0;min-height:4px;position:relative;cursor:pointer;transition:filter .15s}
.dc-bar:hover{filter:brightness(1.15)}
.dc-tip{display:none;position:absolute;top:-26px;left:50%;transform:translateX(-50%);background:var(--ink);color:white;font-size:10px;padding:3px 7px;border-radius:4px;white-space:nowrap;font-family:'JetBrains Mono',monospace}
.dc-bar:hover .dc-tip{display:block}
.dc-mo{font-size:9px;font-weight:700;color:var(--muted)}
.dash-recent{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:18px}
.dr-title{font-size:12px;font-weight:800;margin-bottom:12px}
.dr-tbl{width:100%;border-collapse:collapse;font-size:12px}
.dr-tbl th{text-align:left;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--muted);padding:0 10px 9px;border-bottom:1px solid var(--bdr)}
.dr-tbl td{padding:10px;border-bottom:1px solid var(--bdr)}
.dr-tbl tr:last-child td{border-bottom:none}
.dr-m{color:var(--muted);font-family:'JetBrains Mono',monospace;font-size:11px}
.dr-ok{background:#d1fae5;color:var(--green);font-size:10px;font-weight:700;padding:3px 9px;border-radius:12px}
.dash-soon{text-align:center;padding:56px;color:var(--muted);display:flex;flex-direction:column;gap:10px;align-items:center}
.api-kcard{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:18px;margin-bottom:18px}
.akc-label{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
.akc-row{display:flex;align-items:center;gap:9px;background:#0c0f1a;border-radius:var(--rxs);padding:11px 14px;margin-bottom:7px}
.akc-key{font-family:'JetBrains Mono',monospace;font-size:12px;color:#4ecca8;flex:1;word-break:break-all}
.akc-copy{padding:6px 14px;background:var(--green);color:white;border:none;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer}
.akc-hint{font-size:12px;color:var(--muted)}
.api-code{background:#0c0f1a;border-radius:var(--rs);overflow:hidden;margin-bottom:18px}
.acode-hdr{display:flex;align-items:center;gap:6px;padding:9px 13px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.05)}
.acode-dots{display:flex;gap:5px}
.acd{width:10px;height:10px;border-radius:50%}
.acd.r{background:#ff5f57}.acd.y{background:#febc2e}.acd.g{background:#28c840}
.acode-lang{font-size:11px;color:rgba(255,255,255,.25);margin-left:6px;font-family:'JetBrains Mono',monospace}
.acode-pre{padding:18px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#c8d3e8;line-height:1.75;overflow-x:auto;white-space:pre}
.bill-cur{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:18px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
.bill-pname{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600}
.bill-price{font-size:14px;color:var(--mid);margin-top:2px}
.bill-trial{font-size:12px;font-weight:700;color:var(--green);margin-top:5px}
.bill-up{padding:9px 20px;background:var(--ink);color:white;border:none;border-radius:var(--rs);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer}
.bill-inv{background:white;border:1px solid var(--bdr);border-radius:var(--rs);padding:18px;margin-bottom:14px}
.bill-inv-title{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:12px}
.bill-none{font-size:13px;color:var(--muted);font-style:italic}
.about-pg{padding-bottom:72px}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:44px;margin-bottom:56px;padding-bottom:56px;border-bottom:1px solid var(--bdr)}
.about-h2{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;margin-bottom:18px}
.about-text p{font-size:14px;color:var(--mid);line-height:1.85;margin-bottom:12px}
.about-values{display:flex;flex-direction:column;gap:14px}
.vcard{background:var(--card);border:1px solid var(--bdr);border-radius:var(--rs);padding:18px;display:flex;align-items:flex-start;gap:12px}
.vcard-ic{font-size:26px;flex-shrink:0}
.vcard-t{font-size:14px;font-weight:800;margin-bottom:3px}
.vcard-d{font-size:12px;color:var(--mid);line-height:1.6}
.about-cta{text-align:center;padding:48px;background:var(--ink);border-radius:var(--r)}
.about-cta h2{font-family:'Cormorant Garamond',serif;font-size:34px;color:white;margin-bottom:20px;font-weight:600}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.modal-box{background:white;border-radius:var(--r);width:100%;max-width:400px;padding:30px;position:relative;animation:fup .3s ease}
.modal-x{position:absolute;top:14px;right:14px;width:28px;height:28px;border:none;background:#f3f4f6;border-radius:50%;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.modal-logo{font-size:13px;font-weight:800;color:var(--green);margin-bottom:14px}
.modal-h2{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;margin-bottom:18px}
.modal-fields{display:flex;flex-direction:column;gap:12px;margin-bottom:14px}
.modal-sw{text-align:center;font-size:13px;color:var(--muted)}
.modal-sw-btn{border:none;background:transparent;color:var(--green);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;cursor:pointer;margin-left:4px}
.footer{background:#080a10;padding:52px 0 0}
.footer-top{max-width:1120px;margin:0 auto;padding:0 24px 40px;display:grid;grid-template-columns:280px 1fr;gap:52px}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:22px;color:white;margin-bottom:8px;font-weight:600}
.footer-tag{font-size:12px;color:rgba(255,255,255,.3);line-height:1.7;margin-bottom:14px}
.footer-certs{display:flex;gap:5px;flex-wrap:wrap}
.f-cert{font-size:9px;font-weight:700;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:rgba(255,255,255,.35);padding:3px 9px;border-radius:5px}
.footer-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.fc-title{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:12px}
.fc-link{display:block;font-size:12px;color:rgba(255,255,255,.35);margin-bottom:7px;cursor:pointer;background:transparent;border:none;text-align:left;font-family:'DM Sans',sans-serif;padding:0;transition:color .15s}
.fc-link:hover{color:rgba(255,255,255,.65)}
.footer-bottom{max-width:1120px;margin:0 auto;padding:16px 24px;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.18)}
.spin{width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:sp .7s linear infinite;flex-shrink:0}
@keyframes sp{to{transform:rotate(360deg)}}
@media(max-width:900px){
  .hero-body{flex-direction:column}
  .hero-float{display:none}
  .hero-h1{font-size:44px}
  .demo-layout,.co-layout,.about-grid{grid-template-columns:1fr}
  .pgrid,.steps,.serve-grid,.tgrid{grid-template-columns:1fr}
  .lang-tiles{grid-template-columns:repeat(4,1fr)}
  .dash-pg{grid-template-columns:1fr}
  .dash-side{position:static;height:auto;display:flex;flex-direction:row;flex-wrap:wrap;overflow-x:auto}
  .dash-stats{grid-template-columns:repeat(2,1fr)}
  .footer-top{grid-template-columns:1fr}
  .footer-cols{grid-template-columns:repeat(2,1fr)}
}
`;
