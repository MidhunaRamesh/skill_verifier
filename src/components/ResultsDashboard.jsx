import { useEffect, useState } from "react";
import ScoreCard from "./ScoreCard.jsx";
import AgentPipeline from "./AgentPipeline.jsx";
import SkillSummary from "./SkillSummary.jsx";

const STATUS_CONFIG = {
  VERIFIED:   { color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  icon: "🏆", msg: "Assessment Complete",  sub: "Your skills have been verified by the AI pipeline." },
  RETEST:     { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  icon: "🔄", msg: "Retest Recommended",    sub: "Keep practising — you're on the right track." },
  "NEW TASK": { color: "#6366f1", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.2)",  icon: "📋", msg: "New Task Assigned",     sub: "A new challenge has been prepared for you." },
};

export default function ResultsDashboard({ result, attempt, onStartNextTask, onNewAssessment }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (!result) return null;

  const { code_evaluation: ce, reasoning_evaluation: re, verification: vf, coordinator: co, next_task, skill_summary: ss } = result;
  const status = (vf?.status || co?.decision || "").toUpperCase();
  const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG["RETEST"];

  const codeScore    = Math.round(vf?.code_score    ?? ce?.score ?? 0);
  const reasonScore  = Math.round(vf?.reasoning_score ?? re?.score ?? 0);
  const testsPassed  = vf?.tests_passed ?? ce?.passed ?? 0;
  const totalTests   = vf?.total_tests  ?? ce?.total  ?? 0;
  const understanding = vf?.understanding ?? re?.understanding ?? "—";
  const skillLevel   = ss?.skill_level ?? "—";

  return (
    <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── HERO BANNER ── */}
      <div style={{ ...s.banner, background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `0 0 60px ${cfg.color}10` }} className="scale-in">
        <div style={s.bannerGlow(cfg.color)} />
        <div style={s.bannerLeft}>
          <div style={{ ...s.bannerIconWrap, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, boxShadow: `0 0 30px ${cfg.color}30` }}>
            <span style={{ fontSize: 36 }}>{cfg.icon}</span>
          </div>
          <div>
            <div style={s.bannerAttempt}>Attempt {attempt}</div>
            <h1 style={{ ...s.bannerTitle, color: cfg.color }}>{cfg.msg}</h1>
            <p style={s.bannerSub}>{cfg.sub}</p>
          </div>
        </div>
        <div style={{ ...s.statusPill, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
          <span style={{ ...s.statusDot, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
          {status}
        </div>
      </div>

      {/* ── SCORE CARDS ── */}
      <div>
        <SectionHeader title="Performance Scores" icon="📈" />
        <div style={s.scoreGrid}>
          <ScoreCard label="Code Score"      value={codeScore}    unit="%" icon="💻" color="#3b82f6" />
          <ScoreCard label="Reasoning Score" value={reasonScore}  unit="%" icon="🧠" color="#8b5cf6" />
          <ScoreCard label="Tests Passed"    value={testsPassed}  max={totalTests || undefined} icon="🧪" color="#10b981" />
          <ScoreCard label="Understanding"   value={understanding} icon="💡" color="#f59e0b" />
          <ScoreCard label="Skill Level"     value={skillLevel}   icon="🏅" color={cfg.color} />
        </div>
      </div>

      {/* ── AGENT DETAILS ── */}
      <div>
        <SectionHeader title="Agent Evaluation Details" icon="🤖" />
        <AgentPipeline result={result} />
      </div>

      {/* ── SKILL SUMMARY ── */}
      {ss && (
        <div>
          <SectionHeader title="Skill Summary" icon="📊" />
          <SkillSummary summary={ss} />
        </div>
      )}

      {/* ── NEXT TASK ── */}
      {next_task && (
        <div className="glass fade-up" style={s.nextCard}>
          <div style={s.nextGlow} />
          <div style={s.nextLeft}>
            <div style={s.nextIconWrap}><span style={{ fontSize: 24 }}>📋</span></div>
            <div>
              <div style={s.nextLabel}>Next Recommended Task</div>
              <div style={s.nextTitle}>{next_task.title || "A new challenge awaits"}</div>
              {next_task.difficulty && (
                <div style={s.nextDiff}>{next_task.difficulty.toUpperCase()}</div>
              )}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onStartNextTask(next_task)} style={{ flexShrink: 0 }}>
            Start Next Task →
          </button>
        </div>
      )}

      {/* ── ACTIONS ── */}
      <div style={s.actions}>
        <button className="btn btn-secondary" onClick={onNewAssessment}>
          ← New Assessment
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div style={s.sectionHeader}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
  );
}

const s = {
  banner: { borderRadius: 20, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden" },
  bannerGlow: (color) => ({
    position: "absolute", top: "50%", left: "30%", transform: "translate(-50%,-50%)",
    width: 300, height: 200, borderRadius: "50%",
    background: `radial-gradient(ellipse, ${color}15 0%, transparent 70%)`,
    pointerEvents: "none",
  }),
  bannerLeft: { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  bannerIconWrap: { width: 72, height: 72, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bannerAttempt: { fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  bannerTitle: { fontSize: 28, fontWeight: 900, marginBottom: 4, letterSpacing: "-0.5px" },
  bannerSub: { fontSize: 14, color: "#64748b" },
  statusPill: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, fontSize: 14, fontWeight: 800, letterSpacing: 0.5, flexShrink: 0 },
  statusDot: { width: 8, height: 8, borderRadius: "50%" },

  scoreGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14 },

  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: "#f1f5f9" },

  nextCard: { padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden" },
  nextGlow: {
    position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
    width: 200, height: 100, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  nextLeft: { display: "flex", alignItems: "center", gap: 16 },
  nextIconWrap: { width: 52, height: 52, borderRadius: 14, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  nextLabel: { fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  nextTitle: { fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 },
  nextDiff: { fontSize: 11, color: "#64748b" },

  actions: { display: "flex", justifyContent: "flex-start", paddingBottom: 48 },
};
