import { useState } from "react";

export default function ExplanationBox({ explanation, setExplanation }) {
  const [focused, setFocused] = useState(false);
  const charCount = (explanation || "").length;

  return (
    <div style={s.wrap}>
      <div style={s.labelRow}>
        <label style={s.label}>
          <span style={s.labelIcon}>💬</span>
          Explain Your Approach
        </label>
        <span style={{ ...s.charCount, color: charCount > 50 ? "#10b981" : "#475569" }}>
          {charCount} chars
        </span>
      </div>
      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Explain how your solution works, why you chose this approach, and its time/space complexity."
        style={{
          ...s.textarea,
          borderColor: focused ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
        }}
      />
    </div>
  );
}

const s = {
  wrap: { marginTop: 16 },
  labelRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  label: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 },
  labelIcon: { fontSize: 14 },
  charCount: { fontSize: 11, fontWeight: 600, transition: "color 0.3s" },
  textarea: {
    width: "100%", minHeight: 120, padding: "14px 16px",
    background: "rgba(255,255,255,0.025)", border: "1px solid",
    borderRadius: 10, color: "#e2e8f0", fontFamily: "inherit", fontSize: 14,
    lineHeight: 1.65, resize: "vertical", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
};
