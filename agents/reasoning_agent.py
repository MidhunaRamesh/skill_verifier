import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv(
    os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        ".env"
    )
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def evaluate_reasoning(task, code, explanation):

    prompt = f"""
You are a Reasoning Evaluation Agent.

Your job is to check whether a candidate understands
the solution they submitted.

TASK:
{task["description"]}

CANDIDATE CODE:
{code}

CANDIDATE EXPLANATION:
{explanation}

Check:

1. Does the explanation correctly describe the solution?
2. Does the candidate understand the main algorithm?
3. Does the explanation match the submitted code?
4. Does the candidate understand the important constraints?

Return ONLY valid JSON:

{{
    "understanding": "STRONG or WEAK",
    "score": 0,
    "correct_explanation": true,
    "code_matches_explanation": true,
    "feedback": "short explanation"
}}

Give a score from 0 to 100.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You evaluate programming reasoning."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    text = response.choices[0].message.content.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    import json

    return json.loads(text)