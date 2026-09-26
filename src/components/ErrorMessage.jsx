export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={s.box}>
      <div style={s.left}>
        <span style={s.icon}>⚠️</span>
        <div>
          <div style={s.title}>Something went wrong</div>
          <div style={s.msg}>{message}</div>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={s.close}>✕</button>
      )}
    </div>
  );
}

const s = {
  box: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 12, padding: "16px 20px", marginBottom: 20,
  },
  left: { display: "flex", alignItems: "flex-start", gap: 12 },
  icon: { fontSize: 20, flexShrink: 0 },
  title: { fontSize: 14, fontWeight: 700, color: "#fca5a5", marginBottom: 4 },
  msg: { fontSize: 13, color: "#f87171", lineHeight: 1.5 },
  close: {
    background: "none", border: "none", color: "#f87171", cursor: "pointer",
    fontSize: 16, padding: "0 4px", flexShrink: 0,
  },
};
