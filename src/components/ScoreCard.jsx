import { useEffect, useState } from "react";

function useAnimatedValue(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

export default function ScoreCard({ label, value, max, unit, color = "#6366f1", icon }) {
  const isNumeric = typeof value === "number";
  const animated  = useAnimatedValue(isNumeric ? value : 0);
  const pct       = max ? Math.min(100, Math.round((value / max) * 100)) : (unit === "%" ? value : null);
  const animPct   = useAnimatedValue(pct || 0);

  const display = max
    ? `${animated} / ${max}`
    : isNumeric
      ? `${animated}${unit || ""}`
      : String(value ?? "—");

  return (
    <div className="glass fade-up" style={s.card}>
      <div style={s.top}>
        <div style={{ ...s.iconWrap, background: `${color}15`, border: `1px solid ${color}25` }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
        <span style={s.label}>{label}</span>
      </div>

      <div style={{ ...s.value, color }}>{display}</div>

      {pct !== null && (
        <>
          <div style={s.barBg}>
            <div style={{ ...s.barFill, width: `${animPct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, boxShadow: `0 0 8px ${color}60` }} />
          </div>
          <div style={s.pctLabel}>{animPct}%</div>
        </>
      )}
    </div>
  );
}

const s = {
  card: { padding: "22px 20px" },
  top: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  label: { fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.6 },
  value: { fontSize: 28, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", animation: "countUp 0.5s ease both" },
  barBg: { height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  barFill: { height: "100%", borderRadius: 3, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" },
  pctLabel: { fontSize: 11, color: "#475569", textAlign: "right" },
};
