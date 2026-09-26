import { useState } from "react";

function safeStr(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function AgentCard({ agentNum, agentName, icon, children, accentColor = "#6366f1" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="glass fade-up"
      style={{
        ...s.card,
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: hovered ? `0 8px 40px ${accentColor}15, var(--shadow-card)` : "var(--shadow-card)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.cardGlow(accentColor)} />
      <div style={s.header}>
        <div style={{ ...s.agentBadge, background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
          Agent {agentNum}
        </div>
        <span style={s.agentName}>{icon} {agentName}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  const v = safeStr(value);
  if (v === null) return null;
  return (
    <div style={s.row}>
      <span style={s.rowLabel}>{label}</span>
      <span style={s.rowValue}>{v}</span>
    </div>
  );
}

function BigScore({ value, color }) {
  return (
    <div style={s.bigScoreWrap}>
      <div style={{ ...s.bigScore, color }}>
        {Math.round(value)}
        <span style={s.bigScoreUnit}>/100</span>
      </div>
      <div style={s.bigScoreBar}>
        <div style={{ ...s.bigScoreBarFill, width: `${Math.min(value, 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow: `0 0 10px ${color}60` }} />
      </div>
    </div>
  );
}

export default function AgentPipeline({ result }) {
  if (!result) return null;
  const { code_evaluation: ce, reasoning_evaluation: re, verification: vf, coordinator: co } = result;
  const vStatus = (vf?.status || "").toUpperCase();
  const vColor  = vStatus === "VERIFIED" ? "#10b981" : vStatus === "RETEST" ? "#f59e0b" : "#6366f1";

  return (
    <div style={s.wrap}>
      {ce && (
        <AgentCard agentNum={2} agentName="Submission Evaluator" icon="💻" accentColor="#3b82f6">
          {ce.score != null && <BigScore value={ce.score} color="#3b82f6" />}
          <Row label="Status"       value={ce.status} />
          <Row label="Tests Passed" value={ce.passed != null ? `${ce.passed} / ${ce.total ?? "?"}` : null} />
          {ce.feedback && <p style={s.feedback}>{ce.feedback}</p>}
        </AgentCard>
      )}

      {re && (
        <AgentCard agentNum={3} agentName="Reasoning Agent" icon="🧠" accentColor="#8b5cf6">
          {re.score != null && <BigScore value={re.score} color="#8b5cf6" />}
          <Row label="Understanding" value={re.understanding} />
          {Array.isArray(re.strengths) && re.strengths.length > 0 && (
            <div style={s.tagRow}>
              {re.strengths.map((str, i) => (
                <span key={i} style={s.tag}>{String(str)}</span>
              ))}
            </div>
          )}
          {re.feedback && <p style={s.feedback}>{re.feedback}</p>}
        </AgentCard>
      )}

      {vf && (
        <AgentCard agentNum={4} agentName="Verification" icon="✅" accentColor={vColor}>
          <div style={{ ...s.statusBadge, background: `${vColor}12`, border: `1px solid ${vColor}35`, color: vColor, boxShadow: `0 0 20px ${vColor}20` }}>
            <span style={{ ...s.statusDot, background: vColor, boxShadow: `0 0 8px ${vColor}` }} />
            {vf.status || "—"}
          </div>
          <Row label="Code Score"      value={vf.code_score      != null ? `${Math.round(vf.code_score)}%`      : null} />
          <Row label="Reasoning Score" value={vf.reasoning_score != null ? `${Math.round(vf.reasoning_score)}%` : null} />
          <Row label="Tests"           value={vf.tests_passed    != null ? `${vf.tests_passed} / ${vf.total_tests ?? "?"}` : null} />
          <Row label="Understanding"   value={vf.understanding} />
          {vf.feedback && <p style={s.feedback}>{vf.feedback}</p>}
        </AgentCard>
      )}

      {co && (
        <AgentCard agentNum={5} agentName="Coordinator" icon="🤝" accentColor="#f59e0b">
          {Object.entries(co).map(([k, v]) => {
            const val = safeStr(v);
            if (val === null) return null;
            return <Row key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} value={val} />;
          })}
        </AgentCard>
      )}
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },
  card: { padding: 24, position: "relative", overflow: "hidden" },
  cardGlow: (color) => ({
    position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%",
    background: `radial-gradient(ellipse, ${color}08 0%, transparent 70%)`,
    pointerEvents: "none",
  }),
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 },
  agentBadge: { padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 },
  agentName: { fontSize: 16, fontWeight: 700, color: "#e2e8f0" },
  bigScoreWrap: { marginBottom: 16 },
  bigScore: { fontSize: 44, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1, marginBottom: 8 },
  bigScoreUnit: { fontSize: 18, color: "#475569", marginLeft: 4, fontWeight: 400 },
  bigScoreBar: { height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
  bigScoreBarFill: { height: "100%", borderRadius: 3, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  rowLabel: { fontSize: 13, color: "#475569" },
  rowValue: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  feedback: { marginTop: 14, fontSize: 14, color: "#64748b", lineHeight: 1.65, fontStyle: "italic", padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, borderLeft: "2px solid rgba(255,255,255,0.08)" },
  statusBadge: { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, fontSize: 16, fontWeight: 800, marginBottom: 16 },
  statusDot: { width: 8, height: 8, borderRadius: "50%" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, marginBottom: 6 },
  tag: { background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};
