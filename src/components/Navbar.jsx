import { useState } from "react";

export default function Navbar({ backendConnected, view, setView }) {
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "practice",  label: "Practice",  icon: "⚡" },
    { id: "results",   label: "Results",   icon: "📊" },
  ];

  return (
    <nav style={s.nav}>
      {/* Gradient line at top */}
      <div style={s.topLine} />

      {/* Brand */}
      <div style={s.brand}>
        <div style={s.logoWrap}>
          <div style={s.logo}>
            <span style={s.logoText}>SF</span>
            <div style={s.logoRing} />
          </div>
        </div>
        <div>
          <div style={s.brandName}>
            <span className="gradient-text">SkillForge</span>
            <span style={{ color: "#e2e8f0" }}> AI</span>
          </div>
          <div style={s.brandSub}>Build. Prove. Verify.</div>
        </div>
      </div>

      {/* Nav links */}
      <div style={s.links}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...s.link,
              ...(view === item.id ? s.linkActive : {}),
              ...(hovered === item.id && view !== item.id ? s.linkHover : {}),
            }}
          >
            <span style={s.linkIcon}>{item.icon}</span>
            {item.label}
            {view === item.id && <div style={s.activeIndicator} />}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{ ...s.status, ...(backendConnected ? s.statusOn : s.statusOff) }}>
        <span style={{
          ...s.dot,
          background: backendConnected ? "#10b981" : "#ef4444",
          animation: backendConnected ? "dotPulse 2s ease-in-out infinite" : "none",
        }} />
        <span className="hide-mobile">
          {backendConnected ? "Backend Connected" : "Backend Offline"}
        </span>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", height: 64,
    background: "rgba(5,8,16,0.85)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky", top: 0, zIndex: 200,
  },
  topLine: {
    position: "absolute", top: 0, left: 0, right: 0, height: 2,
    background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #06b6d4, transparent)",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logoWrap: { position: "relative" },
  logo: {
    width: 38, height: 38, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99,102,241,0.5)",
    position: "relative", overflow: "hidden",
  },
  logoText: { fontSize: 13, fontWeight: 900, color: "#fff", position: "relative", zIndex: 1 },
  logoRing: {
    position: "absolute", inset: -2,
    background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)",
    borderRadius: 12, opacity: 0.4,
    animation: "spin 4s linear infinite",
  },
  brandName: { fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px" },
  brandSub: { fontSize: 10, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" },
  links: { display: "flex", gap: 2 },
  link: {
    background: "none", border: "none", cursor: "pointer",
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    color: "#64748b", fontFamily: "inherit",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
    position: "relative",
  },
  linkHover: { color: "#94a3b8", background: "rgba(255,255,255,0.04)" },
  linkActive: {
    color: "#818cf8",
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.2)",
  },
  linkIcon: { fontSize: 12 },
  activeIndicator: {
    position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
    width: 20, height: 2, borderRadius: 1,
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
  },
  status: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: "1px solid",
  },
  statusOn: {
    background: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.2)",
    color: "#10b981",
  },
  statusOff: {
    background: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.2)",
    color: "#ef4444",
  },
  dot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
};
