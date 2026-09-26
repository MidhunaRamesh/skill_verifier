import { useEffect, useState } from "react";

const STEPS = [
  { key: "task",      label: "Task Generated",      agent: "Agent 1", icon: "📋", color: "#6366f1" },
  { key: "code",      label: "Code Evaluated",       agent: "Agent 2", icon: "💻", color: "#3b82f6" },
  { key: "reasoning", label: "Reasoning Evaluated",  agent: "Agent 3", icon: "🧠", color: "#8b5cf6" },
  { key: "verify",    label: "Skill Verified",       agent: "Agent 4", icon: "✅", color: "#10b981" },
  { key: "coord",     label: "Decision Coordinated", agent: "Agent 5", icon: "🤝", color: "#f59e0b" },
  { key: "summary",   label: "Skill Summary Ready",  agent: "Summary", icon: "📊", color: "#06b6d4" },
];

export default function EvaluationProgress({ done }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (done) { setActive(STEPS.length); return; }
    setActive(1);
    let i = 1;
    const id = setInterval(() => {
      i++;
      setActive(i);
      if (i >= STEPS.length) clearInterval(id);
    }, 700);
    return () => clearInterval(id);
  }, [done]);

  const pct = Math.round((Math.min(active, STEPS.length) / STEPS.length) * 100);

  return (
    <div className="glass scale-in" style={s.card}>
      {/* Top glow */}
      <div style={s.topGlow} />

      <div style={s.header}>
        <div style={s.headerIcon}>
          {done ? "✅" : <span style={s.spinnerLarge} />}
        </div>
        <div>
          <h2 style={s.title}>{done ? "Evaluation Complete!" : "Evaluating Your Solution"}</h2>
          <p style={s.sub}>
            {done ? "All agents have completed their analysis." : "Processing through the AI agent pipeline..."}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div style={s.progressBg}>
          <div style={{ ...s.progressFill, width: `${pct}%` }} />
        </div>
        <span style={s.progressPct}>{pct}%</span>
      </div>

      {/* Steps */}
      <div style={s.steps}>
        {STEPS.map((step, i) => {
          const isDone    = i < active;
          const isCurrent = i === active - 1 && !done;
          const isPending = i >= active;
          return (
            <div key={step.key} style={s.stepRow}>
              <div style={{
                ...s.step,
                background: isDone ? `${step.color}0d` : isCurrent ? `${step.color}15` : "rgba(255,255,255,0.015)",
                borderColor: isDone ? `${step.color}30` : isCurrent ? step.color : "rgba(255,255,255,0.05)",
                boxShadow: isCurrent ? `0 0 20px ${step.color}20` : "none",
                transform: isCurrent ? "scale(1.02)" : "scale(1)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {/* Circle */}
                <div style={{
                  ...s.circle,
                  background: isDone ? step.color : isCurrent ? `${step.color}25` : "rgba(255,255,255,0.04)",
                  border: isCurrent ? `2px solid ${step.color}` : "2px solid transparent",
                  boxShadow: isDone ? `0 0 12px ${step.color}60` : "none",
                }}>
                  {isDone
                    ? <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>✓</span>
                    : isCurrent
                      ? <span style={{ ...s.spinnerSm, borderTopColor: step.color }} />
                      : <span style={{ color: "#334155", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                  }
                </div>

                {/* Text */}
                <div style={s.stepText}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: isDone || isCurrent ? step.color : "#334155" }}>
                    {step.agent}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isDone ? "#e2e8f0" : isCurrent ? "#e2e8f0" : "#334155" }}>
                    {step.label}
                  </div>
                </div>

                {/* Icon + status */}
                <div style={s.stepRight}>
                  <span style={{ fontSize: 20, opacity: isDone || isCurrent ? 1 : 0.2 }}>{step.icon}</span>
                  {isDone && <span style={{ ...s.doneTag, color: step.color, background: `${step.color}15`, border: `1px solid ${step.color}30` }}>Done</span>}
                  {isCurrent && <span style={{ ...s.doneTag, color: step.color, background: `${step.color}15`, border: `1px solid ${step.color}30`, animation: "pulse 1.2s ease-in-out infinite" }}>Running</span>}
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div style={{ ...s.connector, background: isDone ? `linear-gradient(180deg, ${step.color}40, ${STEPS[i+1].color}40)` : "rgba(255,255,255,0.04)" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  card: { padding: 32, maxWidth: 540, margin: "0 auto", position: "relative", overflow: "hidden" },
  topGlow: {
    position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
    width: 300, height: 200, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  headerIcon: { fontSize: 32, flexShrink: 0 },
  title: { fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub: { fontSize: 13, color: "#64748b" },
  progressWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  progressBg: { flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
  progressFill: {
    height: "100%", borderRadius: 3,
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
    transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 0 10px rgba(99,102,241,0.5)",
  },
  progressPct: { fontSize: 13, fontWeight: 700, color: "#6366f1", minWidth: 36, textAlign: "right" },
  steps: { display: "flex", flexDirection: "column" },
  stepRow: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
  step: {
    display: "flex", alignItems: "center", gap: 14,
    width: "100%", padding: "13px 16px", borderRadius: 12, border: "1px solid",
  },
  circle: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.4s",
  },
  stepText: { flex: 1 },
  stepRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  doneTag: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  connector: { width: 2, height: 10, marginLeft: 30, borderRadius: 1, transition: "background 0.4s" },
  spinnerLarge: {
    width: 28, height: 28, border: "3px solid rgba(99,102,241,0.2)",
    borderTopColor: "#6366f1", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", display: "inline-block",
  },
  spinnerSm: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
  },
};
