import os
import json
from dotenv import load_dotenv
from groq import Groq

# Load .env from project folder
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")

client = Groq(api_key=api_key)


def generate_task(skill, level, topic):

    prompt = f"""
You are a Practical Skill Assessment Task Generator.

Create one practical coding task.

Skill: {skill}
Level: {level}
Topic: {topic}

Rules:
- Test practical ability, not theory.
- The task must be solvable within 15 minutes.
- Include clear requirements.
- Include test cases.
- Include evaluation criteria.
- Do not require internet.
- Do not require external libraries.
- Return ONLY valid JSON.

Use this format:

{{
    "title": "string",
    "description": "string",
    "difficulty": "intermediate",
    "time_limit_minutes": 15,
    "requirements": [
        "string"
    ],
    "test_cases": [
        {{
            "input": "string",
            "expected_output": "string"
        }}
    ],
    "evaluation_criteria": [
        "string"
    ]
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You generate practical skill assessment tasks."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    text = response.choices[0].message.content.strip()

    # Remove markdown if AI returns ```json
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text)