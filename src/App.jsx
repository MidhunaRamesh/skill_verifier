import { useEffect, useState } from "react";
import "./App.css";

import { checkHealth, generateTask, evaluateSolution } from "./services/api.js";

import Navbar           from "./components/Navbar.jsx";
import Dashboard        from "./components/Dashboard.jsx";
import TaskGenerator    from "./components/TaskGenerator.jsx";
import TaskDisplay      from "./components/TaskDisplay.jsx";
import CodeEditor       from "./components/CodeEditor.jsx";
import ExplanationBox   from "./components/ExplanationBox.jsx";
import EvaluationProgress from "./components/EvaluationProgress.jsx";
import ResultsDashboard from "./components/ResultsDashboard.jsx";
import ErrorMessage     from "./components/ErrorMessage.jsx";

// view: "dashboard" | "practice" | "results"
// practiceStep: "generate" | "workspace" | "evaluating"

export default function App() {
  const [view, setView]                     = useState("dashboard");
  const [practiceStep, setPracticeStep]     = useState("generate");

  const [backendConnected, setBackendConnected] = useState(false);
  const [selectedSkill, setSelectedSkill]   = useState("Python");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  const [currentTask, setCurrentTask]       = useState(null);
  const [code, setCode]                     = useState("");
  const [explanation, setExplanation]       = useState("");
  const [attempt, setAttempt]               = useState(1);

  const [loadingTask, setLoadingTask]       = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [evalDone, setEvalDone]             = useState(false);

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [error, setError]                   = useState("");

  // Health check on mount
  useEffect(() => {
    checkHealth()
      .then((data) => {
        console.log("Backend health:", data);
        setBackendConnected(true);
      })
      .catch((err) => {
        console.error("Health check failed:", err);
        setBackendConnected(false);
      });
  }, []);

  function clearError() { setError(""); }

  // ── Generate Task ──────────────────────────────────────────
  async function handleGenerateTask() {
    setError("");
    setLoadingTask(true);
    try {
      const data = await generateTask(selectedSkill, selectedDifficulty);
      console.log("Generated task:", data.task);
      setCurrentTask(data.task);
      setCode("");
      setExplanation("");
      setEvaluationResult(null);
      setEvalDone(false);
      setPracticeStep("workspace");
      setView("practice");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTask(false);
    }
  }

  // ── Submit Solution ────────────────────────────────────────
  async function handleSubmit() {
    if (!currentTask) { setError("No task loaded."); return; }
    if (!code.trim()) { setError("Please write your code before submitting."); return; }
    if (!explanation.trim()) { setError("Please explain your approach before submitting."); return; }

    setError("");
    setSubmitting(true);
    setEvalDone(false);
    setPracticeStep("evaluating");

    try {
      const data = await evaluateSolution(currentTask, code, explanation, attempt);
      console.log("Backend response:", data);
      console.log("Evaluation result:", data);
      console.log("skill_summary:", data.skill_summary);
      setEvaluationResult(data);
      setEvalDone(true);
      setTimeout(() => {
        setView("results");
        setPracticeStep("generate");
      }, 1200);
    } catch (err) {
      setError(err.message);
      setPracticeStep("workspace");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Start Next Task (from next_task in response) ───────────
  function handleStartNextTask(nextTask) {
    setCurrentTask(nextTask);
    setCode("");
    setExplanation("");
    setEvaluationResult(null);
    setEvalDone(false);
    setAttempt((a) => a + 1);
    setPracticeStep("workspace");
    setView("practice");
  }

  // ── New Assessment ─────────────────────────────────────────
  function handleNewAssessment() {
    setCurrentTask(null);
    setCode("");
    setExplanation("");
    setEvaluationResult(null);
    setEvalDone(false);
    setAttempt(1);
    setPracticeStep("generate");
    setView("practice");
  }

  // ── Navigate to practice tab ───────────────────────────────
  function handleNavSetView(v) {
    setView(v);
    if (v === "practice" && !currentTask) setPracticeStep("generate");
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar backendConnected={backendConnected} view={view} setView={handleNavSetView} />

      <main style={layout.main}>
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <Dashboard
            backendConnected={backendConnected}
            onStart={() => { setView("practice"); setPracticeStep("generate"); }}
          />
        )}

        {/* PRACTICE */}
        {view === "practice" && (
          <>
            {practiceStep === "generate" && (
              <div style={layout.centered}>
                <TaskGenerator
                  skill={selectedSkill}
                  setSkill={setSelectedSkill}
                  difficulty={selectedDifficulty}
                  setDifficulty={setSelectedDifficulty}
                  onGenerate={handleGenerateTask}
                  loading={loadingTask}
                />
              </div>
            )}

            {practiceStep === "workspace" && currentTask && (
              <div style={layout.workspace}>
                {/* Left: task */}
                <div style={layout.taskPane}>
                  <TaskDisplay task={currentTask} attempt={attempt} />
                </div>
                {/* Right: editor + submit */}
                <div style={layout.editorPane}>
                  <div className="glass" style={layout.editorCard}>
                    <div style={layout.editorHeader}>
                      <span style={layout.editorTitle}>💻 Your Solution</span>
                      <span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                        Attempt {attempt}
                      </span>
                    </div>
                    <CodeEditor code={code} setCode={setCode} />
                    <ExplanationBox explanation={explanation} setExplanation={setExplanation} />
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{ width: "100%", justifyContent: "center", marginTop: 16, fontSize: 15, padding: "14px" }}
                    >
                      {submitting ? (
                        <><span style={layout.spinner} /> Evaluating...</>
                      ) : "Submit Solution →"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {practiceStep === "evaluating" && (
              <div style={layout.centered}>
                <EvaluationProgress done={evalDone} />
              </div>
            )}
          </>
        )}

        {/* RESULTS */}
        {view === "results" && evaluationResult && (
          <div style={layout.container}>
            <ResultsDashboard
              result={evaluationResult}
              attempt={attempt}
              onStartNextTask={handleStartNextTask}
              onNewAssessment={handleNewAssessment}
            />
          </div>
        )}

        {view === "results" && !evaluationResult && (
          <div style={layout.centered}>
            <div className="glass" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "#64748b", marginBottom: 20 }}>No results yet. Complete an assessment first.</p>
              <button className="btn btn-primary" onClick={() => { setView("practice"); setPracticeStep("generate"); }}>
                Start Assessment →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const layout = {
  main: { padding: "24px 32px", maxWidth: 1200, margin: "0 auto" },
  centered: { maxWidth: 560, margin: "0 auto" },
  container: { maxWidth: 1100, margin: "0 auto" },
  workspace: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 20,
    alignItems: "start",
  },
  taskPane: { position: "sticky", top: 80 },
  editorPane: {},
  editorCard: { padding: 24 },
  editorHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  editorTitle: { fontSize: 16, fontWeight: 700, color: "#e2e8f0" },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", display: "inline-block",
  },
};
