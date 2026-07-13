from learning.base import generate_learning_content

def generate_analogy(question: str, answer: str):
    """
    Generates a memorable real-world analogy.
    """
    prompt = f"""You are creating an analogy for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create a memorable, vivid real-world analogy to explain this concept simply to a beginner.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "analogy": {{
    "concept": "Name of the concept",
    "analogy_scenario": "Imagine a post office where...",
    "explanation": "Just like the post office, in code we..."
  }}
}}
"""
    return generate_learning_content(prompt, key_name="analogy")
