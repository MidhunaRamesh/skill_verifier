import { useEffect, useState } from "react";

const LEVEL_CFG = {
  PROFICIENT:          { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  icon: "🏆" },
  DEVELOPING:          { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: "📈" },
  "NEEDS IMPROVEMENT": { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   icon: "🔧" },
};

export default function SkillSummary({ summary }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);

  if (!summary) return null;

  const lvl    = (summary.skill_level || "").toUpperCase();
  const cfg    = LEVEL_CFG[lvl] || LEVEL_CFG["DEVELOPING"];
  const strengths = Array.isArray(summary.strengths)       ? summary.strengths       : [];
  const areas     = Array.isArray(summary.areas_to_improve) ? summary.areas_to_improve : [];

  const metrics = [
    { label: "Skill Level",         value: summary.skill_level },
    { label: "Verification Status", value: summary.verification_status },
    { label: "Code Score",          value: summary.code_score      != null ? `${Math.round(summary.code_score)}%`      : null },
    { label: "Reasoning Score",     value: summary.reasoning_score != null ? `${Math.round(summary.reasoning_score)}%` : null },
    { label: "Tests",               value: summary.tests_passed    != null ? `${summary.tests_passed} / ${summary.total_tests ?? "?"}` : null },
    { label: "Test Pass Rate",      value: summary.test_percentage != null ? `${Math.round(summary.test_percentage)}%` : null },
    { label: "Understanding",       value: summary.understanding },
  ].filter((m) => m.value != null && m.value !== "");

  return (
    <div className="glass fade-up" style={{ ...s.card, opacity: show ? 1 : 0, transition: "opacity 0.5s" }}>
      <div style={s.cardGlow(cfg.color)} />

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span className="badge" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
            📊 Skill Summary
          </span>
        </div>
        <div style={{ ...s.levelBadge, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, boxShadow: `0 0 20px ${cfg.color}20` }}>
          <span>{cfg.icon}</span>
          <span>{lvl || "—"}</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={s.grid}>
        {metrics.map((m) => (
          <div key={m.label} style={s.metricCard}>
            <div style={s.metricLabel}>{m.label}</div>
            <div style={s.metricValue}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={s.divider} />

      {/* Strengths */}
      {strengths.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={{ ...s.sectionIcon, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>💪</div>
            <h3 style={s.sectionTitle}>Strengths</h3>
          </div>
          <div style={s.itemList}>
            {strengths.map((str, i) => (
              <div key={i} className="fade-up" style={{ ...s.strengthItem, animationDelay: `${i * 60}ms` }}>
                <div style={s.checkCircle}>✓</div>
                <span style={s.itemText}>{String(str)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas to improve */}
      {areas.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={{ ...s.sectionIcon, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>📈</div>
            <h3 style={s.sectionTitle}>Areas to Improve</h3>
          </div>
          <div style={s.itemList}>
            {areas.map((area, i) => (
              <div key={i} className="fade-up" style={{ ...s.areaItem, animationDelay: `${i * 60}ms` }}>
                <div style={s.arrowCircle}>→</div>
                <span style={s.itemText}>{String(area)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  card: { padding: 28, position: "relative", overflow: "hidden" },
  cardGlow: (color) => ({
    position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%",
    background: `radial-gradient(ellipse, ${color}08 0%, transparent 70%)`,
    pointerEvents: "none",
  }),
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  levelBadge: { display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 10, fontSize: 14, fontWeight: 800 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 24 },
  metricCard: {
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "14px 16px",
    transition: "border-color 0.2s",
  },
  metricLabel: { fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6, fontWeight: 600 },
  metricValue: { fontSize: 17, fontWeight: 800, color: "#e2e8f0" },
  divider: { height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", margin: "4px 0 20px" },
  section: { marginBottom: 20 },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionIcon: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#94a3b8" },
  itemList: { display: "flex", flexDirection: "column", gap: 8 },
  strengthItem: { display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" },
  areaItem:     { display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" },
  checkCircle: { width: 22, height: 22, borderRadius: "50%", background: "rgba(16,185,129,0.2)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 },
  arrowCircle:  { width: 22, height: 22, borderRadius: "50%", background: "rgba(245,158,11,0.2)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 },
  itemText: { fontSize: 14, color: "#cbd5e1", lineHeight: 1.55 },
};
