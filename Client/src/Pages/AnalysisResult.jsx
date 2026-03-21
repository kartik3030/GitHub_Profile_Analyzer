import { useState, useEffect } from "react";

// ── Animated counter ────────────────────────────────────────────────────────
function CountUp({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const iv = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(iv); }
      else setVal(start);
    }, 18);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{val}</span>;
}

// ── Level config ─────────────────────────────────────────────────────────────
const LEVEL = {
  Beginner: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", bar: 25, icon: "🌱" },
  Intermediate: { color: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.25)", bar: 60, icon: "⚡" },
  Advanced: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", bar: 92, icon: "🔥" },
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-4 px-3 rounded-2xl"
      style={{ background: "rgba(14,165,233,0.05)", border: "1px solid rgba(56,189,248,0.1)" }}>
      <span className="text-xl">{icon}</span>
      <span className="text-base font-bold tabular-nums" style={{ color: "#e0f2fe", fontFamily: "'Syne',sans-serif" }}>
        <CountUp target={Number(value) || 0} />
      </span>
      <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Fira Code',monospace" }}>{label}</span>
    </div>
  );
}

// ── List card ─────────────────────────────────────────────────────────────────
function ListCard({ title, items, accent, icon, delay = 0 }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "rgba(7,15,28,0.7)", border: `1px solid ${accent}22`, animation: `fadeUp 0.4s ease ${delay}s both` }}>
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent, fontFamily: "'Fira Code',monospace" }}>{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed"
            style={{ color: "rgba(203,213,225,0.8)", fontFamily: "'Fira Code',monospace", animationDelay: `${delay + i * 0.05}s` }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Language bar ──────────────────────────────────────────────────────────────
const LANG_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fb923c", "#f472b6"];
function LanguageBar({ langs }) {
  if (!langs?.length) return null;
  const total = langs.reduce((a, [, v]) => a + v, 0);
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(7,15,28,0.7)", border: "1px solid rgba(56,189,248,0.09)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Fira Code',monospace" }}>⌨ Languages</p>
      <div className="flex gap-0.5 rounded-full overflow-hidden h-1.5 mb-4">
        {langs.map(([lang, count], i) => (
          <div key={lang} className="h-full rounded-full"
            style={{ width: `${(count / total) * 100}%`, background: LANG_COLORS[i % LANG_COLORS.length] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {langs.map(([lang, count], i) => (
          <span key={lang} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(56,189,248,0.1)", color: "rgba(203,213,225,0.75)", fontFamily: "'Fira Code',monospace" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Result UI ────────────────────────────────────────────────────────────
export default function AnalysisResult({ result, onReset }) {
  const { github: g, insights, analysis } = result;
  const lvl = LEVEL[analysis.level] || LEVEL.Intermediate;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes growBar { from{width:0} to{width:var(--bar-w)} }
        .result-wrap { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div className="result-wrap w-full max-w-2xl mx-auto space-y-3 px-4 pb-12">

        {/* ── Profile header ── */}
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(7,15,28,0.88)", backdropFilter: "blur(20px)", border: "1px solid rgba(56,189,248,0.12)" }}>
          <img src={g.avatar_url} alt={g.login}
            className="w-14 h-14 rounded-xl flex-shrink-0"
            style={{ border: "1.5px solid rgba(56,189,248,0.2)" }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base truncate" style={{ fontFamily: "'Syne',sans-serif", color: "#e0f2fe" }}>
                {g.name || g.login}
              </h2>
              {/* Level badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: lvl.bg, border: `1px solid ${lvl.border}`, color: lvl.color, fontFamily: "'Fira Code',monospace" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: lvl.color }} />
                {lvl.icon} {analysis.level}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "rgba(56,189,248,0.5)", fontFamily: "'Fira Code',monospace" }}>@{g.login}</p>
            {g.bio && <p className="text-xs mt-1 line-clamp-1" style={{ color: "rgba(148,163,184,0.65)", fontFamily: "'Fira Code',monospace" }}>{g.bio}</p>}
          </div>
          <a href={g.html_url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 text-xs px-3 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "#38bdf8", fontFamily: "'Fira Code',monospace", textDecoration: "none" }}>
            GitHub ↗
          </a>
        </div>

        {/* ── Skill bar ── */}
        <div className="rounded-2xl px-5 py-4"
          style={{ background: "rgba(7,15,28,0.7)", border: "1px solid rgba(56,189,248,0.09)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Fira Code',monospace" }}>Skill Level</span>
            <span className="text-xs font-semibold" style={{ color: lvl.color, fontFamily: "'Fira Code',monospace" }}>{lvl.bar}%</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: "rgba(56,189,248,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${lvl.bar}%`, background: `linear-gradient(90deg, ${lvl.color}99, ${lvl.color})`, boxShadow: `0 0 8px ${lvl.color}88` }} />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-2">
          <Stat icon="📦" label="Repos" value={insights.totalRepos} />
          <Stat icon="⭐" label="Stars" value={insights.totalStars} />
          <Stat icon="👥" label="Followers" value={g.followers} />
          <Stat icon="➕" label="Following" value={g.following} />
        </div>

        {/* ── Summary ── */}
        {analysis.summary && (
          <div className="rounded-2xl px-5 py-4"
            style={{ background: "rgba(14,165,233,0.05)", border: "1px solid rgba(56,189,248,0.11)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(56,189,248,0.45)", fontFamily: "'Fira Code',monospace" }}>✦ AI Summary</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(203,213,225,0.85)", fontFamily: "'Fira Code',monospace" }}>
              {analysis.summary}
            </p>
          </div>
        )}

        {/* ── Languages ── */}
        <LanguageBar langs={insights.topLanguages} />

        {/* ── Strengths / Weaknesses / Suggestions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ListCard title="Strengths" items={analysis.strengths} accent="#4ade80" icon="✦" delay={0.05} />
          <ListCard title="Weaknesses" items={analysis.weaknesses} accent="#f87171" icon="⚠" delay={0.1} />
          <ListCard title="Suggestions" items={analysis.suggestions} accent="#fbbf24" icon="→" delay={0.15} />
        </div>

        {/* ── Reset ── */}
        <button onClick={onReset}
          className="w-full py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(56,189,248,0.13)", color: "#38bdf8", fontFamily: "'Fira Code',monospace", cursor: "pointer" }}>
          ← Analyse Another Profile
        </button>
      </div>
    </>
  );
}
