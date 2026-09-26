import { API_BASE_URL } from "../config.js";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`API error ${res.status}:`, text);
      throw new Error(`Server error (HTTP ${res.status}). Please check the backend.`);
    }
    return await res.json();
  } catch (err) {
    if (err.message.startsWith("Server error")) throw err;
    console.error("Network error:", err);
    throw new Error(
      "Unable to connect to Skill Verifier backend. Please make sure the FastAPI server is running on port 8000."
    );
  }
}

export const checkHealth = () => apiRequest("/");

export const generateTask = (skill, difficulty) =>
  apiRequest("/generate-task", {
    method: "POST",
    body: JSON.stringify({ skill, difficulty }),
  });

export const evaluateSolution = (task, code, explanation, attempt) =>
  apiRequest("/evaluate", {
    method: "POST",
    body: JSON.stringify({ task, code, explanation, attempt }),
  });
