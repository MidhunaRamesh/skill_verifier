function renderValue(value, depth = 0) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <ul style={{ paddingLeft: 20, margin: "6px 0" }}>
        {value.map((item, i) => (
          <li key={i} style={{ color: "#cbd5e1", marginBottom: 4, lineHeight: 1.5 }}>
            {renderValue(item, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <div style={{ paddingLeft: depth > 0 ? 12 : 0 }}>
        {Object.entries(value).map(([k, v]) => {
          const rendered = renderValue(v, depth + 1);
          if (rendered === null) return null;
          return (
            <div key={k} style={{ marginBottom: 6 }}>
              <span style={{ color: "#94a3b8", fontSize: 13, textTransform: "capitalize" }}>
                {k.replace(/_/g, " ")}:{" "}
              </span>
              {typeof v === "string" || typeof v === "number" || typeof v === "boolean"
                ? <span style={{ color: "#e2e8f0" }}>{String(v)}</span>
                : rendered}
            </div>
          );
        })}
      </div>
    );
  }
  return <span style={{ color: "#e2e8f0" }}>{String(value)}</span>;
}

const SKIP_FIELDS = new Set(["title", "difficulty", "skill", "description", "requirements", "test_cases", "constraints", "examples"]);

const DIFF_COLORS = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };

export default function TaskDisplay({ task, attempt }) {
  if (!task) return null;

  const diffColor = DIFF_COLORS[(task.difficulty || "").toLowerCase()] || "#6366f1";
  const extraFields = Object.entries(task).filter(([k]) => !SKIP_FIELDS.has(k));

  return (
    <div className="glass fade-in" style={s.card}>
      <div style={s.topRow}>
        <span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>Agent 1 — Task Generator</span>
        <div style={s.tags}>
          {task.skill && <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>{task.skill}</span>}
          {task.difficulty && (
            <span className="badge" style={{ background: `${diffColor}20`, color: diffColor }}>
              {task.difficulty.toUpperCase()}
            </span>
          )}
          <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
            Attempt {attempt}
          </span>
        </div>
      </div>

      {task.title && <h2 style={s.title}>{task.title}</h2>}

      {(task.description || task.problem) && (
        <p style={s.desc}>{task.description || task.problem}</p>
      )}

      {task.requirements && Array.isArray(task.requirements) && task.requirements.length > 0 && (
        <Section title="📋 Requirements">
          <ul style={s.list}>
            {task.requirements.map((r, i) => (
              <li key={i} style={s.listItem}>{String(r)}</li>
            ))}
          </ul>
        </Section>
      )}

      {task.constraints && (
        <Section title="⚠️ Constraints">
          {Array.isArray(task.constraints)
            ? <ul style={s.list}>{task.constraints.map((c, i) => <li key={i} style={s.listItem}>{String(c)}</li>)}</ul>
            : <p style={s.text}>{String(task.constraints)}</p>}
        </Section>
      )}

      {task.examples && (
        <Section title="💡 Examples">
          {Array.isArray(task.examples)
            ? task.examples.map((ex, i) => (
                <div key={i} style={s.exampleBox}>
                  {renderValue(ex)}
                </div>
              ))
            : <div style={s.exampleBox}>{renderValue(task.examples)}</div>}
        </Section>
      )}

      {task.test_cases && Array.isArray(task.test_cases) && task.test_cases.length > 0 && (
        <Section title="🧪 Test Cases">
          <div style={s.testGrid}>
            {task.test_cases.map((tc, i) => (
              <div key={i} style={s.testCase}>
                <div style={s.testNum}>Test {i + 1}</div>
                {tc.input !== undefined && tc.input !== null && (
                  <div style={s.testRow}>
                    <span style={s.testKey}>Input:</span>
                    <code style={s.testVal}>{String(tc.input)}</code>
                  </div>
                )}
                {(tc.expected_output !== undefined || tc.output !== undefined) && (
                  <div style={s.testRow}>
                    <span style={s.testKey}>Expected:</span>
                    <code style={s.testVal}>{String(tc.expected_output ?? tc.output)}</code>
                  </div>
                )}
                {tc.explanation && <div style={{ ...s.testRow, marginTop: 4 }}><span style={{ color: "#64748b", fontSize: 13 }}>{tc.explanation}</span></div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {extraFields.filter(([, v]) => v !== null && v !== undefined).map(([k, v]) => (
        <Section key={k} title={k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}>
          <div style={s.text}>{renderValue(v)}</div>
        </Section>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</h3>
      {children}
    </div>
  );
}

const s = {
  card: { padding: 28 },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tags: { display: "flex", gap: 8, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 },
  desc: { fontSize: 15, color: "#cbd5e1", lineHeight: 1.7 },
  list: { paddingLeft: 20, margin: 0 },
  listItem: { color: "#cbd5e1", marginBottom: 6, lineHeight: 1.5, fontSize: 14 },
  text: { fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 },
  exampleBox: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8, padding: "12px 16px", marginBottom: 8, fontSize: 14,
  },
  testGrid: { display: "grid", gap: 10 },
  testCase: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "14px 16px",
  },
  testNum: { fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  testRow: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  testKey: { fontSize: 13, color: "#64748b", minWidth: 70, flexShrink: 0 },
  testVal: { fontSize: 13, color: "#a5f3fc", background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 4 },
};
