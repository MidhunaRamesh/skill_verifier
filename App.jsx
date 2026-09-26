import { useState } from "react";

function App() {
  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Attempt number
  const [attempt, setAttempt] = useState(1);

  // =========================
  // AGENT 1 - TASK GENERATOR
  // =========================

  async function generateTask(resetAttempt = true) {
    setLoading(true);

    if (resetAttempt) {
      setAttempt(1);
    }

    setResult(null);
    setCode("");
    setExplanation("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-task"
      );

      if (!response.ok) {
        throw new Error("Failed to generate task");
      }

      const data = await response.json();

      setTask(data);

    } catch (error) {
      console.error(error);
      alert("Could not connect to FastAPI");
    }

    setLoading(false);
  }

  // =========================
  // SUBMIT SOLUTION
  // AGENTS 2, 3, 4, 5
  // =========================

  async function submitSolution() {
    if (!task) {
      alert("Please generate a task first");
      return;
    }

    if (!code.trim()) {
      alert("Please write your Python solution");
      return;
    }

    if (!explanation.trim()) {
      alert("Please explain your solution");
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            task: task,
            code: code,
            explanation: explanation,
            attempt: attempt
          })
        }
      );

      if (!response.ok) {
        throw new Error("Evaluation failed");
      }

      const data = await response.json();

      console.log("FULL RESULT:", data);

      // Show current evaluation
      setResult(data);

      // =========================
      // AGENT 5 HANDOFF
      // =========================

      const decision =
        data.coordinator?.decision;

      if (
        (decision === "RETEST" ||
          decision === "NEW TASK") &&
        data.next_task
      ) {
        if (attempt < 3) {
          const nextAttempt = attempt + 1;

          setTimeout(() => {
            setTask(data.next_task);
            setCode("");
            setExplanation("");
            setAttempt(nextAttempt);

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }, 1500);
        }
      }

    } catch (error) {
      console.error(error);
      alert("Could not evaluate your solution");
    }

    setSubmitting(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto"
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <h1
          style={{
            textAlign: "center",
            fontSize: "40px"
          }}
        >
          Skill Verifier
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "18px"
          }}
        >
          AI-Powered Practical Skill Assessment
        </p>

        {/* =========================
            ATTEMPT DISPLAY
        ========================= */}

        <div
          style={{
            textAlign: "center",
            margin: "20px"
          }}
        >
          <span
            style={{
              background: "#2563eb",
              padding: "8px 18px",
              borderRadius: "20px",
              fontWeight: "bold"
            }}
          >
            Attempt {attempt} / 3
          </span>
        </div>

        {/* =========================
            GENERATE TASK BUTTON
        ========================= */}

        <div
          style={{
            textAlign: "center",
            margin: "30px"
          }}
        >
          <button
            onClick={() => generateTask(true)}
            disabled={loading}
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
              border: "none"
            }}
          >
            {loading
              ? "Generating Task..."
              : "Generate Practical Task"}
          </button>
        </div>

        {/* =========================
            TASK
        ========================= */}

        {task && (
          <div>

            <div
              style={{
                background: "#1f2937",
                padding: "25px",
                borderRadius: "10px",
                marginBottom: "25px"
              }}
            >

              <h2>
                {task.title}
              </h2>

              <p>
                {task.description}
              </p>

              <p>
                <b>Difficulty:</b>{" "}
                {task.difficulty}
              </p>

              <p>
                <b>Time Limit:</b>{" "}
                {task.time_limit_minutes} minutes
              </p>

              <h3>
                Requirements
              </h3>

              <ul>
                {task.requirements?.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>

              <h3>
                Test Cases
              </h3>

              {task.test_cases?.map(
                (test, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#111827",
                      padding: "12px",
                      marginBottom: "10px",
                      borderRadius: "6px"
                    }}
                  >

                    <p>
                      <b>Input:</b>{" "}
                      {test.input}
                    </p>

                    <p>
                      <b>Expected:</b>{" "}
                      {test.expected_output}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* =========================
                CODE
            ========================= */}

            <div
              style={{
                background: "#1f2937",
                padding: "25px",
                borderRadius: "10px",
                marginBottom: "25px"
              }}
            >

              <h2>
                Your Solution
              </h2>

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="Write your Python solution here..."
                style={{
                  width: "100%",
                  height: "300px",
                  background: "#0f172a",
                  color: "white",
                  padding: "15px",
                  fontSize: "15px",
                  fontFamily: "monospace",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  boxSizing: "border-box"
                }}
              />

            </div>

            {/* =========================
                EXPLANATION
            ========================= */}

            <div
              style={{
                background: "#1f2937",
                padding: "25px",
                borderRadius: "10px",
                marginBottom: "25px"
              }}
            >

              <h2>
                Explain Your Solution
              </h2>

              <textarea
                value={explanation}
                onChange={(e) =>
                  setExplanation(e.target.value)
                }
                placeholder="Explain your algorithm, logic and complexity..."
                style={{
                  width: "100%",
                  height: "160px",
                  background: "#0f172a",
                  color: "white",
                  padding: "15px",
                  fontSize: "15px",
                  fontFamily: "Arial",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  boxSizing: "border-box"
                }}
              />

            </div>

            {/* =========================
                SUBMIT
            ========================= */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "30px"
              }}
            >

              <button
                onClick={submitSolution}
                disabled={submitting}
                style={{
                  padding: "12px 30px",
                  fontSize: "16px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  border: "none"
                }}
              >
                {submitting
                  ? "AI Agents Evaluating..."
                  : "Submit Solution"}
              </button>

            </div>

            {/* =========================
                RESULT
            ========================= */}

            {result && (
              <div
                style={{
                  background: "#1f2937",
                  padding: "25px",
                  borderRadius: "10px",
                  marginTop: "30px"
                }}
              >

                <h2>
                  Evaluation Result
                </h2>

                {/* =========================
                    AGENT 2
                ========================= */}

                <h3>
                  Agent 2 — Code Evaluator
                </h3>

                <p>
                  <b>Code Score:</b>{" "}
                  {result.code_evaluation?.score}%
                </p>

                <p>
                  <b>Tests Passed:</b>{" "}
                  {result.code_evaluation?.passed}
                  {" / "}
                  {result.code_evaluation?.total}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  {result.code_evaluation?.status}
                </p>

                <hr />

                {/* =========================
                    AGENT 3
                ========================= */}

                <h3>
                  Agent 3 — Reasoning Agent
                </h3>

                <p>
                  <b>Reasoning Score:</b>{" "}
                  {result.reasoning_evaluation?.score}%
                </p>

                <p>
                  <b>Understanding:</b>{" "}
                  {result.reasoning_evaluation?.understanding}
                </p>

                <p>
                  <b>Explanation Correct:</b>{" "}
                  {String(
                    result.reasoning_evaluation
                      ?.correct_explanation
                  )}
                </p>

                <p>
                  <b>Code Matches Explanation:</b>{" "}
                  {String(
                    result.reasoning_evaluation
                      ?.code_matches_explanation
                  )}
                </p>

                <p>
                  <b>Feedback:</b>{" "}
                  {result.reasoning_evaluation?.feedback}
                </p>

                <hr />

                {/* =========================
                    AGENT 4
                ========================= */}

                <h3>
                  Agent 4 — Verification Agent
                </h3>

                <div
                  style={{
                    background: "#111827",
                    padding: "20px",
                    borderRadius: "8px"
                  }}
                >

                  <h3>
                    Status:{" "}
                    {result.verification?.status}
                  </h3>

                  <p>
                    <b>Code Score:</b>{" "}
                    {result.verification?.code_score}%
                  </p>

                  <p>
                    <b>Reasoning Score:</b>{" "}
                    {result.verification?.reasoning_score}%
                  </p>

                  <p>
                    <b>Tests Passed:</b>{" "}
                    {result.verification?.tests_passed}
                    {" / "}
                    {result.verification?.total_tests}
                  </p>

                  <p>
                    <b>Understanding:</b>{" "}
                    {result.verification?.understanding}
                  </p>

                  <p>
                    <b>Feedback:</b>{" "}
                    {result.verification?.feedback}
                  </p>

                </div>

                <hr />

                {/* =========================
                    AGENT 5
                ========================= */}

                <h2>
                  Agent 5 — Coordinator / Negotiator
                </h2>

                <div
                  style={{
                    background: "#111827",
                    padding: "20px",
                    borderRadius: "8px"
                  }}
                >

                  <h3>
                    Decision:{" "}
                    {result.coordinator?.decision}
                  </h3>

                  <p>
                    <b>Attempt:</b>{" "}
                    {result.coordinator?.attempt}
                    {" / 3"}
                  </p>

                  <p>
                    <b>Code Score:</b>{" "}
                    {result.coordinator?.code_score}%
                  </p>

                  <p>
                    <b>Reasoning Score:</b>{" "}
                    {result.coordinator?.reasoning_score}%
                  </p>

                  <p>
                    <b>Tests Passed:</b>{" "}
                    {result.coordinator?.tests_passed}
                    {" / "}
                    {result.coordinator?.total_tests}
                  </p>

                  <p>
                    <b>Understanding:</b>{" "}
                    {result.coordinator?.understanding}
                  </p>

                  <p>
                    <b>Next Action:</b>{" "}
                    {result.coordinator?.next_action}
                  </p>

                  <p>
                    <b>Handoff:</b>{" "}
                    {result.coordinator?.handoff}
                  </p>

                  <p>
                    <b>Coordinator Message:</b>{" "}
                    {result.coordinator?.coordinator_message}
                  </p>

                </div>

                {/* =========================
                    NEXT TASK MESSAGE
                ========================= */}

                {result.next_task &&
                  (result.coordinator?.decision ===
                    "RETEST" ||
                    result.coordinator?.decision ===
                      "NEW TASK") &&
                  attempt < 3 && (
                    <div
                      style={{
                        marginTop: "25px",
                        background: "#172554",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center"
                      }}
                    >

                      <h3>
                        🔄 Next Practical Task Ready
                      </h3>

                      <p>
                        Agent 5 has handed the task
                        back to Agent 1.
                      </p>

                      <p>
                        Loading Attempt{" "}
                        {attempt + 1}...
                      </p>

                    </div>
                  )}

                {/* =========================
                    FINAL MESSAGE
                ========================= */}

                {result.coordinator?.decision ===
                  "VERIFIED" && (
                  <div
                    style={{
                      marginTop: "25px",
                      background: "#064e3b",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center"
                    }}
                  >

                    <h2>
                      ✅ Skill Verified
                    </h2>

                    <p>
                      Practical skill successfully
                      verified by the multi-agent
                      assessment system.
                    </p>

                  </div>
                )}

                {attempt >= 3 &&
                  result.coordinator?.decision !==
                    "VERIFIED" && (
                    <div
                      style={{
                        marginTop: "25px",
                        background: "#7f1d1d",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center"
                      }}
                    >

                      <h2>
                        Assessment Completed
                      </h2>

                      <p>
                        Maximum attempts reached.
                        Skill could not be verified
                        in this assessment.
                      </p>

                    </div>
                  )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;