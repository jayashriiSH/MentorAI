def build_prompt(history, context, question, user_memory=None):
    """
    Builds a highly compressed prompt for MentorAI.
    """
    conversation = ""
    for message in history:
        conversation += f"{message['role'].capitalize()}: {message['content']}\n"

    memory_str = ""
    if user_memory:
        memory_str = (
            f"Student Profile:\n"
            f"- Summary: {user_memory.get('summary', '')}\n"
            f"- Strengths: {user_memory.get('strengths', '')}\n"
            f"- Weak Topics: {user_memory.get('weak_topics', '')}\n"
            f"- Learning Style: {user_memory.get('learning_style', '')}\n"
        )

    return f"""You are MentorAI.
Teach for understanding, not completeness.
Explain the smallest idea that makes the concept click.

For code:
- trace execution
- explain why
- minimal example

Use uploaded documents for document-specific facts. Never invent document content.
Prefer intuition before terminology.

{memory_str}
Retrieved Context:
{context}

Conversation History:
{conversation}

Student Question: {question}
Answer:"""