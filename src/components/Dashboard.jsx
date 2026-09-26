import { useEffect, useRef, useState } from "react";

/* Animated counter hook */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* Floating particle canvas */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

const PIPELINE = [
  { label: "Task Generator",   icon: "📋", agent: "Agent 1", color: "#6366f1" },
  { label: "Code Evaluation",  icon: "💻", agent: "Agent 2", color: "#3b82f6" },
  { label: "Reasoning",        icon: "🧠", agent: "Agent 3", color: "#8b5cf6" },
  { label: "Verification",     icon: "✅", agent: "Agent 4", color: "#10b981" },
  { label: "Coordinator",      icon: "🤝", agent: "Agent 5", color: "#f59e0b" },
  { label: "Skill Summary",    icon: "📊", agent: "Summary", color: "#06b6d4" },
];

const AGENTS = [
  { n: 1, name: "Task Generator",      desc: "Generates a practical coding challenge tailored to your skill and difficulty level.", color: "#6366f1" },
  { n: 2, name: "Submission Evaluator",desc: "Evaluates your code for correctness, efficiency, and test case pass rate.",           color: "#3b82f6" },
  { n: 3, name: "Reasoning Agent",     desc: "Analyses your explanation for depth of understanding and problem-solving approach.",  color: "#8b5cf6" },
  { n: 4, name: "Verification",        desc: "Cross-verifies code and reasoning scores to determine your skill status.",            color: "#10b981" },
  { n: 5, name: "Coordinator",         desc: "Makes the final decision: VERIFIED, RETEST, or NEW TASK.",                           color: "#f59e0b" },
];

export default function Dashboard({ onStart }) {
  const [activePipe, setActivePipe] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const id = setInterval(() => setActivePipe((p) => (p + 1) % PIPELINE.length), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={s.page}>
      {/* ── HERO ── */}
      <div style={s.hero}>
        <ParticleCanvas />
        <div style={s.heroGlow1} />
        <div style={s.heroGlow2} />

        <div style={{ ...s.heroContent, opacity: visible ? 1 : 0, transition: "opacity 0.6s" }}>
          <div className="fade-up" style={s.heroPill}>
            <span style={s.heroPillDot} />
            AI-Powered Assessment Platform
          </div>

          <h1 className="fade-up delay-1" style={s.heroTitle}>
            <span className="gradient-text-animated">SkillForge AI</span>
          </h1>

          <p className="fade-up delay-2" style={s.heroSub}>
            AI-Powered Practical Skill Verification
          </p>

          <p className="fade-up delay-3" style={s.heroDesc}>
            Verify skills through practical coding, reasoning, and AI-powered evaluation.
            <br />Get a real assessment of your abilities — not just theory.
          </p>

          <div className="fade-up delay-4" style={s.heroBtns}>
            <button className="btn btn-primary" onClick={onStart} style={s.heroBtn}>
              <span>Start Assessment</span>
              <span style={s.heroBtnArrow}>→</span>
            </button>
            <div style={s.heroMeta}>
              <span style={s.heroMetaItem}>⚡ 5 AI Agents</span>
              <span style={s.heroMetaDot}>·</span>
              <span style={s.heroMetaItem}>🧠 Real Evaluation</span>
              <span style={s.heroMetaDot}>·</span>
              <span style={s.heroMetaItem}>✅ Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      <div style={s.container}>

        {/* ── STATS ── */}
        <div style={s.statsGrid}>
          {[
            { icon: "🤖", num: 5,    suffix: "",    label: "AI Agents",          color: "#6366f1" },
            { icon: "⚡", num: null, suffix: "Live", label: "Practical Eval",    color: "#10b981" },
            { icon: "🧠", num: null, suffix: "AI",   label: "Reasoning Analysis", color: "#8b5cf6" },
            { icon: "✅", num: null, suffix: "Real", label: "Skill Verification", color: "#f59e0b" },
          ].map((st, i) => (
            <StatCard key={st.label} {...st} delay={i * 100} />
          ))}
        </div>

        {/* ── PIPELINE ── */}
        <div className="glass fade-up delay-2" style={s.pipeCard}>
          <div style={s.pipeHeader}>
            <div>
              <h2 style={s.sectionTitle}>Evaluation Pipeline</h2>
              <p style={{ fontSize: 14, marginTop: 4 }}>
                Your submission flows through 5 AI agents and a rule-based Skill Summary generator.
              </p>
            </div>
            <div style={s.pipeLive}>
              <span style={s.pipeLiveDot} />
              Live Pipeline
            </div>
          </div>
          <div style={s.pipeFlow}>
            {PIPELINE.map((step, i) => (
              <div key={step.label} style={s.pipeItem}>
                <div style={{
                  ...s.pipeStep,
                  borderColor: activePipe === i ? step.color : "rgba(255,255,255,0.06)",
                  background: activePipe === i ? `${step.color}12` : "rgba(255,255,255,0.02)",
                  boxShadow: activePipe === i ? `0 0 20px ${step.color}25` : "none",
                  transform: activePipe === i ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <div style={{ ...s.pipeNum, background: activePipe === i ? step.color : "rgba(255,255,255,0.06)", color: activePipe === i ? "#fff" : "#475569" }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: activePipe === i ? step.color : "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {step.agent}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: activePipe === i ? "#e2e8f0" : "#64748b" }}>
                      {step.label}
                    </div>
                  </div>
                  <div style={{ fontSize: 20, marginLeft: "auto" }}>{step.icon}</div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ ...s.pipeArrow, color: activePipe === i ? step.color : "#1e293b" }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── AGENTS ── */}
        <div style={s.agentsSection}>
          <h2 className="fade-up" style={{ ...s.sectionTitle, marginBottom: 20 }}>The 5 AI Agents</h2>
          <div style={s.agentsGrid}>
            {AGENTS.map((a, i) => (
              <AgentCard key={a.n} agent={a} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="glass fade-up" style={s.cta}>
          <div style={s.ctaGlow} />
          <div style={s.ctaContent}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
              Ready to verify your skills?
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", marginBottom: 28 }}>
              Get an AI-powered assessment of your practical coding abilities in minutes.
            </p>
            <button className="btn btn-primary" onClick={onStart} style={{ fontSize: 16, padding: "14px 36px" }}>
              Start Your Assessment →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, num, suffix, label, color, delay }) {
  const count = useCounter(num || 0, 1400);
  return (
    <div className="glass fade-up" style={{ ...s.statCard, animationDelay: `${delay}ms` }}>
      <div style={{ ...s.statIconWrap, background: `${color}15`, border: `1px solid ${color}25` }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div style={{ ...s.statValue, color }}>
        {num !== null ? count : suffix}
      </div>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statBar, background: `${color}20` }}>
        <div style={{ ...s.statBarFill, background: color, width: "100%", animation: "progressFill 1.2s ease both" }} />
      </div>
    </div>
  );
}

function AgentCard({ agent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="glass fade-up"
      style={{
        ...s.agentCard,
        animationDelay: `${delay}ms`,
        borderColor: hovered ? `${agent.color}40` : "rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px ${agent.color}20` : "var(--shadow-card)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...s.agentNumBadge, background: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}30` }}>
        Agent {agent.n}
      </div>
      <div style={{ ...s.agentDot, background: agent.color, boxShadow: `0 0 12px ${agent.color}` }} />
      <div style={s.agentName}>{agent.name}</div>
      <div style={s.agentDesc}>{agent.desc}</div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh" },

  /* Hero */
  hero: {
    position: "relative", overflow: "hidden",
    padding: "100px 32px 80px", textAlign: "center",
    background: "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(5,8,16,0) 100%)",
    minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center",
  },
  heroGlow1: {
    position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)",
    width: 800, height: 500, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  heroGlow2: {
    position: "absolute", bottom: -100, right: "10%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", maxWidth: 760, margin: "0 auto" },
  heroPill: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "7px 18px", borderRadius: 24,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
    color: "#818cf8", fontSize: 13, fontWeight: 600, marginBottom: 24,
  },
  heroPillDot: {
    width: 6, height: 6, borderRadius: "50%", background: "#6366f1",
    animation: "dotPulse 2s ease-in-out infinite",
  },
  heroTitle: { fontSize: 68, fontWeight: 900, marginBottom: 12, lineHeight: 1.05, letterSpacing: "-2px" },
  heroSub: { fontSize: 22, color: "#94a3b8", marginBottom: 16, fontWeight: 400 },
  heroDesc: { fontSize: 16, color: "#475569", marginBottom: 36, lineHeight: 1.8 },
  heroBtns: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  heroBtn: { fontSize: 17, padding: "15px 40px", gap: 10 },
  heroBtnArrow: { fontSize: 18, transition: "transform 0.2s" },
  heroMeta: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  heroMetaItem: { fontSize: 13, color: "#475569" },
  heroMetaDot: { color: "#1e293b" },

  /* Container */
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 28px 80px" },

  /* Stats */
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 28 },
  statCard: { padding: "24px 22px", cursor: "default" },
  statIconWrap: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  statValue: { fontSize: 32, fontWeight: 900, marginBottom: 4, letterSpacing: "-1px" },
  statLabel: { fontSize: 13, color: "#64748b", marginBottom: 14 },
  statBar: { height: 3, borderRadius: 2, overflow: "hidden" },
  statBarFill: { height: "100%", borderRadius: 2 },

  /* Pipeline */
  pipeCard: { padding: 32, marginBottom: 28 },
  pipeHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: 800, color: "#f1f5f9" },
  pipeLive: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", padding: "5px 12px", borderRadius: 20 },
  pipeLiveDot: { width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "dotPulse 1.5s ease-in-out infinite" },
  pipeFlow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 0 },
  pipeItem: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 420 },
  pipeStep: {
    display: "flex", alignItems: "center", gap: 14,
    width: "100%", padding: "14px 20px", borderRadius: 12, border: "1px solid",
    cursor: "default",
  },
  pipeNum: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, transition: "all 0.4s" },
  pipeArrow: { fontSize: 16, margin: "3px 0", transition: "color 0.4s" },

  /* Agents */
  agentsSection: { marginBottom: 28 },
  agentsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 },
  agentCard: { padding: "22px 20px", position: "relative", overflow: "hidden" },
  agentNumBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  agentDot: { width: 8, height: 8, borderRadius: "50%", marginBottom: 10 },
  agentName: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 },
  agentDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.55 },

  /* CTA */
  cta: { padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden", marginTop: 8 },
  ctaGlow: {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
    width: 400, height: 200, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaContent: { position: "relative" },
};
