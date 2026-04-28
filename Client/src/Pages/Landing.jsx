import { useState, useEffect } from "react";

const GRID_SIZE = 24;

// Add to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes floatOrb1 {
    0%, 100% { transform: translateY(0)    scale(1);    }
    50%       { transform: translateY(-18px) scale(1.04); }
  }
  @keyframes floatOrb2 {
    0%, 100% { transform: translateY(0)   scale(1);    }
    50%       { transform: translateY(14px) scale(0.97); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(2000%); }
  }
  @keyframes gradMove {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes ringPulse {
    0%   { box-shadow: 0 0 0 0   rgba(56,189,248,.3); }
    70%  { box-shadow: 0 0 0 12px rgba(56,189,248,0); }
    100% { box-shadow: 0 0 0 0   rgba(56,189,248,0); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0);   }
    40%            { transform: translateY(-6px); }
  }
  @keyframes badgePop {
    0%   { opacity: 0; transform: translateY(-8px) scale(.9);  }
    60%  {             transform: translateY(2px)  scale(1.03); }
    100% { opacity: 1; transform: translateY(0)    scale(1);   }
  }
  @keyframes errorSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;

function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path
              d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
              fill="none"
              stroke="rgba(56,189,248,0.05)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function TerminalCaret() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        width: "2px",
        height: "0.9em",
        background: visible ? "#38bdf8" : "transparent",
        marginLeft: "2px",
        verticalAlign: "text-bottom",
      }}
    />
  );
}

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 36);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <TerminalCaret />}
    </span>
  );
}

export default function Landing({ onAnalyze }) {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const VITE_API = import.meta.env.VITE_API;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Enter Username");
      return;
    }
    setError(null);
    setSubmitted(true);
    try {
      const res = await fetch(`${VITE_API}/user/${username}`);
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      onAnalyze(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitted(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#080c16", fontFamily: "'Inter', sans-serif", overflow: "hidden", position: "relative" }}
    >
      <style>{styles}</style>
      <GridBackground />

      {/* Floating orbs */}
      <div style={{
        position: "absolute", width: 320, height: 320, borderRadius: "50%",
        background: "rgba(14,165,233,.12)", filter: "blur(60px)",
        top: -60, right: -60, animation: "floatOrb1 7s ease-in-out infinite", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", width: 260, height: 260, borderRadius: "50%",
        background: "rgba(99,102,241,.1)", filter: "blur(60px)",
        bottom: -40, left: -40, animation: "floatOrb2 9s ease-in-out infinite", zIndex: 0,
      }} />

      {/* Scanline */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(56,189,248,.07), transparent)",
        animation: "scanline 6s linear infinite",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 440, padding: "0 1.5rem" }}>

        {/* Badge */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.12em", color: "#7dd3fc", textTransform: "uppercase",
          background: "rgba(14,165,233,.1)", border: "1px solid rgba(14,165,233,.2)",
          borderRadius: 999, padding: "5px 14px", marginBottom: "1.4rem",
          animation: "badgePop .6s cubic-bezier(.34,1.56,.64,1) .1s both",
        }}>
          ◈ GitHub Profile Analyser
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 700,
          color: "#f0f8ff", textAlign: "center", lineHeight: 1.15,
          letterSpacing: "-0.03em", marginBottom: "0.6rem",
          animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .25s both",
        }}>
          Decode any developer's{" "}
          <span style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #38bdf8 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmer 3s linear infinite",
          }}>
            GitHub Profile
          </span>
        </h1>

        {/* Typewriter subtitle */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#475569",
          textAlign: "center", marginBottom: "2.2rem", minHeight: "1.6em",
          animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .4s both",
        }}>
          <TypewriterText text="Decode any developer's GitHub DNA." />
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex", gap: 8, width: "100%", marginBottom: "0.85rem",
            animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .55s both",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{
              position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
              color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              opacity: 0.65, pointerEvents: "none", zIndex: 1,
            }}>@</span>
            <input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              style={{
                width: "100%", height: 44, background: "#0d1526",
                border: "1px solid #1b2a42", color: "#e2eaf4",
                borderRadius: 12, padding: "0 14px 0 30px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              height: 44, padding: "0 22px", borderRadius: 12, border: "none", cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600,
              color: submitted ? "#38bdf8" : "#fff",
              background: submitted
                ? "#0d1526"
                : "linear-gradient(-45deg, #0ea5e9, #6366f1, #0ea5e9)",
              backgroundSize: "200% 200%",
              border: submitted ? "1px solid #1b2a42" : "none",
              animation: submitted ? "ringPulse 1.4s ease infinite" : "gradMove 4s ease infinite",
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7,
            }}
          >
            {submitted ? "Analysing..." : "Analyse"}
          </button>
        </form>

        {error && (
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "#fca5a5", background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.18)", borderRadius: 10,
            padding: "7px 14px", width: "100%", textAlign: "center",
            animation: "errorSlide .3s ease both",
          }}>
            {error}
          </p>
        )}

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 20, marginTop: "2rem",
          animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .7s both",
        }}>
          {[["10M+", "Devs"], ["50+", "Signals"], ["Real‑time", "Analysis"]].map(([num, label], i) => (
            <>
              {i > 0 && <div style={{ width: 1, background: "#1b2a42", margin: "4px 0" }} />}
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: "#7dd3fc" }}>{num}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#334155", letterSpacing: ".04em" }}>{label}</span>
              </div>
            </>
          ))}
        </div>

        {/* Footer */}
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#263348",
          marginTop: "1.5rem", display: "flex", alignItems: "center", gap: 6,
          animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .8s both",
        }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1b2a42" }} />
          Public repos only
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1b2a42" }} />
          No auth required
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1b2a42" }} />
        </p>
      </div>
    </div>
  );
}