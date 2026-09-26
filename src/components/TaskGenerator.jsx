import { useState } from "react";

const SKILLS = ["Python", "JavaScript", "Java", "C++", "TypeScript"];
const DIFFICULTIES = [
  { value: "easy",   label: "Easy",   color: "#10b981", desc: "Beginner-friendly tasks" },
  { value: "medium", label: "Medium", color: "#f59e0b", desc: "Intermediate challenges" },
  { value: "hard",   label: "Hard",   color: "#ef4444", desc: "Advanced problems" },
];

export default function TaskGenerator({ skill, setSkill, difficulty, setDifficulty, onGenerate, loading }) {
  const [skillFocus, setSkillFocus] = useState(false);
  const diffObj = DIFFICULTIES.find((d) => d.value === difficulty) || DIFFICULTIES[1];

  return (
    <div className="glass scale-in" style={s.card}>
      {/* Glow accent */}
      <div style={s.cardGlow} />

      <div style={s.header}>
        <div style={s.iconWrap}>
          <span style={{ fontSize: 24 }}>🎯</span>
        </div>
        <div>
          <h2 style={s.title}>Start Skill Assessment</h2>
          <p style={s.sub}>Select your skill and difficulty to generate a practical task</p>
        </div>
      </div>

      <div style={s.divider} />

      {/* Skill selector */}
      <div style={s.fieldGroup}>
        <label style={s.label}>
          <span style={s.labelIcon}>💻</span>
          Programming Skill
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onFocus={() => setSkillFocus(true)}
            onBlur={() => setSkillFocus(false)}
            style={{ ...s.select, borderColor: skillFocus ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)", boxShadow: skillFocus ? "0 0 0 3px rgba(99,102,241,0.15)" : "none" }}
          >
            {SKILLS.map((sk) => <option key={sk} value={sk} style={{ background: "#0d1424" }}>{sk}</option>)}
          </select>
          <span style={s.selectArrow}>▾</span>
        </div>
      </div>

      {/* Difficulty selector */}
      <div style={s.fieldGroup}>
        <label style={s.label}>
          <span style={s.labelIcon}>⚡</span>
          Difficulty Level
        </label>
        <div style={s.diffGrid}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              style={{
                ...s.diffBtn,
                borderColor: difficulty === d.value ? d.color : "rgba(255,255,255,0.07)",
                background: difficulty === d.value ? `${d.color}12` : "rgba(255,255,255,0.02)",
                boxShadow: difficulty === d.value ? `0 0 16px ${d.color}25` : "none",
                transform: difficulty === d.value ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div style={{ ...s.diffDot, background: d.color, boxShadow: difficulty === d.value ? `0 0 8px ${d.color}` : "none" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: difficulty === d.value ? d.color : "#94a3b8" }}>{d.label}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{d.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected summary */}
      <div style={s.summary}>
        <span style={s.summaryItem}>
          <span style={{ color: "#6366f1" }}>●</span> {skill}
        </span>
        <span style={s.summaryDot}>·</span>
        <span style={{ ...s.summaryItem, color: diffObj.color }}>
          <span>●</span> {diffObj.label}
        </span>
      </div>

      {/* Generate button */}
      <button
        className="btn btn-primary"
        onClick={onGenerate}
        disabled={loading}
        style={s.generateBtn}
      >
        {loading ? (
          <>
            <span style={s.spinner} />
            <span>Generating practical task...</span>
          </>
        ) : (
          <>
            <span>Generate Practical Task</span>
            <span style={{ fontSize: 18 }}>→</span>
          </>
        )}
      </button>

      {loading && (
        <div style={s.loadingBar}>
          <div style={s.loadingBarFill} />
        </div>
      )}
    </div>
  );
}

const s = {
  card: { padding: 32, position: "relative", overflow: "hidden" },
  cardGlow: {
    position: "absolute", top: -60, right: -60, width: 200, height: 200,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  header: { display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24, position: "relative" },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
    border: "1px solid rgba(99,102,241,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99,102,241,0.2)",
  },
  title: { fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub: { fontSize: 13, color: "#64748b" },
  divider: { height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", margin: "0 0 24px" },
  fieldGroup: { marginBottom: 22 },
  label: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  labelIcon: { fontSize: 14 },
  select: {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid",
    borderRadius: 10, padding: "13px 40px 13px 16px", color: "#e2e8f0", fontSize: 15,
    fontFamily: "inherit", cursor: "pointer", outline: "none", appearance: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  selectArrow: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none", fontSize: 12 },
  diffGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  diffBtn: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
    border: "1px solid", borderRadius: 10, cursor: "pointer", background: "none",
    fontFamily: "inherit", textAlign: "left", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
  },
  diffDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, transition: "box-shadow 0.3s" },
  summary: {
    display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
    padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20, fontSize: 13,
  },
  summaryItem: { display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontWeight: 600 },
  summaryDot: { color: "#1e293b" },
  generateBtn: { width: "100%", fontSize: 16, padding: "15px", gap: 10 },
  spinner: {
    width: 16, height: 16, border: "2px solid rgba(255,255,255,0.25)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block", flexShrink: 0,
  },
  loadingBar: {
    height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)",
    marginTop: 12, overflow: "hidden",
  },
  loadingBarFill: {
    height: "100%", borderRadius: 2,
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.2s linear infinite",
    width: "100%",
  },
};
