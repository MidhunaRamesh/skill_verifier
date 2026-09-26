import { useState } from "react";

export default function CodeEditor({ code, setCode }) {
  const [focused, setFocused] = useState(false);
  const lineCount = (code || "").split("\n").length;

  return (
    <div style={{ ...s.wrap, borderColor: focused ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)", boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none" }}>
      {/* Title bar */}
      <div style={s.titleBar}>
        <div style={s.dots}>
          <span style={{ ...s.dot, background: "#ef4444" }} />
          <span style={{ ...s.dot, background: "#f59e0b" }} />
          <span style={{ ...s.dot, background: "#10b981" }} />
        </div>
        <span style={s.fileName}>solution.py</span>
        <div style={s.langBadge}>
          <span style={s.langDot} />
          Python
        </div>
      </div>

      {/* Editor area */}
      <div style={s.editorArea}>
        {/* Line numbers */}
        <div style={s.lineNums} aria-hidden="true">
          {Array.from({ length: Math.max(lineCount, 12) }, (_, i) => (
            <div key={i} style={s.lineNum}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={"# Write your Python solution here...\n\ndef solution():\n    pass"}
          style={s.textarea}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <span style={s.footerItem}>{lineCount} lines</span>
        <span style={s.footerItem}>{(code || "").length} chars</span>
        <span style={{ ...s.footerItem, marginLeft: "auto" }}>UTF-8</span>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    border: "1px solid", borderRadius: 14, overflow: "hidden",
    background: "#080d1a", transition: "border-color 0.2s, box-shadow 0.2s",
  },
  titleBar: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px", background: "rgba(255,255,255,0.025)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  dots: { display: "flex", gap: 6 },
  dot: { width: 11, height: 11, borderRadius: "50%" },
  fileName: { fontSize: 12, color: "#64748b", fontFamily: "var(--mono)", flex: 1, textAlign: "center" },
  langBadge: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", fontFamily: "var(--mono)" },
  langDot: { width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" },
  editorArea: { display: "flex", minHeight: 300 },
  lineNums: {
    padding: "14px 0", minWidth: 44, background: "rgba(0,0,0,0.2)",
    borderRight: "1px solid rgba(255,255,255,0.04)", userSelect: "none",
    display: "flex", flexDirection: "column",
  },
  lineNum: { fontSize: 12, color: "#334155", fontFamily: "var(--mono)", lineHeight: "22.4px", textAlign: "right", paddingRight: 12, paddingLeft: 8 },
  textarea: {
    flex: 1, padding: "14px 16px", background: "transparent",
    border: "none", outline: "none", color: "#a5f3fc",
    fontFamily: "var(--mono)", fontSize: 13.5, lineHeight: "22.4px",
    resize: "vertical", display: "block", boxSizing: "border-box",
    minHeight: 300, caretColor: "#6366f1",
  },
  footer: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "6px 16px", background: "rgba(0,0,0,0.2)",
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  footerItem: { fontSize: 11, color: "#334155", fontFamily: "var(--mono)" },
};
