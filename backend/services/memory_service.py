import json
import groq
from groq import Groq
from config import GROQ_API_KEY
from services.supabase_service import get_user_memory, update_user_memory
from utils.json_helper import clean_json_string

client = Groq(api_key=GROQ_API_KEY)

# Store histories per user/session
conversation_histories = {}


def add_message(user_id: str, role: str, content: str):
    if not user_id:
        user_id = "default"
    if user_id not in conversation_histories:
        conversation_histories[user_id] = []
    conversation_histories[user_id].append({
        "role": role,
        "content": content
    })


def get_history(user_id: str):
    if not user_id:
        user_id = "default"
    return conversation_histories.get(user_id, [])


def clear_history(user_id: str):
    if not user_id:
        user_id = "default"
    conversation_histories[user_id] = []


def summarize_and_update_memory(user_id: str, history: list):
    if not user_id or user_id == "default":
        return

    # Fetch existing memory
    existing = get_user_memory(user_id)
    existing_summary = existing.get("summary", "None") if existing else "None"
    existing_strengths = existing.get("strengths", "None") if existing else "None"
    existing_weakness = existing.get("weak_topics", "None") if existing else "None"
    existing_style = existing.get("learning_style", "None") if existing else "None"

    # Format history
    conversation = ""
    for msg in history:
        conversation += f"{msg['role'].capitalize()}: {msg['content']}\n"

    prompt = f"""You are a student learning analyzer.
Based on the existing student profile and the recent conversation history, update the student's learning profile.

Existing Profile:
Summary: {existing_summary}
Strengths: {existing_strengths}
Weak Topics: {existing_weakness}
Learning Style: {existing_style}

Recent Conversation History:
{conversation}

Generate an updated profile with four parts:
1. Summary: A short summary of the student's learning progress.
2. Strengths: Topics or concepts they understand well.
3. Weak Topics: Topics or concepts they struggle with or need to review.
4. Learning Style: Deduce their learning style (e.g. Visual, Practical, Intuitive).

Return ONLY a valid JSON object in this format (no markdown code blocks, no other text):
{{
  "summary": "...",
  "strengths": "...",
  "weak_topics": "...",
  "learning_style": "..."
}}
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()
        cleaned_content = clean_json_string(content)
        data = json.loads(cleaned_content)
        
        # Save to database
        update_user_memory(
            user_id=user_id,
            summary=data.get("summary", ""),
            strengths=data.get("strengths", ""),
            weak_topics=data.get("weak_topics", ""),
            learning_style=data.get("learning_style", "")
        )
        print(f"Memory updated successfully for user {user_id}")
    except Exception as e:
        print("Failed to summarize and update learning memory:", e)