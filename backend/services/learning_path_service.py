"""
learning_path_service.py
------------------------
All Learning Journey logic for MentorAI lives here.

Public API
----------
generate_learning_path(user_id, document_id)  -> dict
get_learning_path(user_id, document_id)       -> dict | None
save_learning_path(...)                       -> dict | None
parse_llm_learning_path(raw_json, book_name)  -> dict
"""

import json
import os
import re

from groq import Groq
from pypdf import PdfReader

from config import GROQ_API_KEY
from services.supabase_service import supabase
from utils.json_helper import clean_json_string

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GROQ_MODEL = "llama-3.3-70b-versatile"
UPLOAD_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
)

# How many pages to scan for a table of contents
TOC_SCAN_PAGES = 10

# Keywords that strongly suggest a ToC page
TOC_KEYWORDS = [
    "table of contents",
    "contents",
    "chapter",
    "chapters",
]

# Regex patterns that look like chapter / section headings
HEADING_PATTERN = re.compile(
    r"^(chapter\s+\d+|unit\s+\d+|\d+\.\s+.{3,}|part\s+[ivxlcdm\d]+)",
    re.IGNORECASE | re.MULTILINE,
)

_groq_client = Groq(api_key=GROQ_API_KEY)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _get_document_filename(document_id: str) -> str | None:
    """
    Looks up the filename for a document_id from Supabase.
    Falls back to treating document_id itself as the filename.
    """
    try:
        res = (
            supabase.table("documents")
            .select("filename")
            .eq("id", document_id)
            .single()
            .execute()
        )
        if res.data:
            return res.data["filename"]
    except Exception:
        pass

    # Fallback: maybe document_id is already a filename
    return None


def _extract_toc_text(file_path: str) -> str:
    """
    Opens the PDF and reads up to TOC_SCAN_PAGES pages.
    Searches those pages for table-of-contents content.

    Strategy:
      1. Read pages 1..TOC_SCAN_PAGES.
      2. Identify pages whose text contains TOC keywords.
      3. If found, return the combined text of those pages.
      4. If not found, fall back to the combined text of pages 1..5.
    """
    try:
        reader = PdfReader(file_path)
    except Exception as e:
        print(f"[LPS] Could not open PDF {file_path}: {e}")
        return ""

    total_pages = len(reader.pages)
    scan_limit = min(TOC_SCAN_PAGES, total_pages)

    pages_text: list[tuple[int, str]] = []

    for i in range(scan_limit):
        raw = reader.pages[i].extract_text() or ""
        pages_text.append((i + 1, raw))

    # -------------------------------------------------------------------
    # Step 1 – look for a dedicated "Table of Contents" page
    # -------------------------------------------------------------------
    toc_pages: list[str] = []
    for page_num, text in pages_text:
        lower = text.lower()
        if any(kw in lower for kw in ["table of contents", "contents"]):
            toc_pages.append(text)

    if toc_pages:
        combined = "\n\n".join(toc_pages)
        print(f"[LPS] Found ToC on {len(toc_pages)} page(s). Using ToC text.")
        return combined.strip()

    # -------------------------------------------------------------------
    # Step 2 – look for pages with chapter/heading patterns
    # -------------------------------------------------------------------
    heading_pages: list[str] = []
    for page_num, text in pages_text:
        if HEADING_PATTERN.search(text):
            heading_pages.append(text)

    if heading_pages:
        combined = "\n\n".join(heading_pages)
        print(f"[LPS] Found headings on {len(heading_pages)} page(s). Using heading text.")
        return combined.strip()

    # -------------------------------------------------------------------
    # Step 3 – fall back to first 5 pages
    # -------------------------------------------------------------------
    fallback_limit = min(5, len(pages_text))
    fallback_text = "\n\n".join(t for _, t in pages_text[:fallback_limit])
    print("[LPS] No ToC found. Using first 5 pages as fallback.")
    return fallback_text.strip()


def _call_llm_for_roadmap(book_name: str, content: str) -> dict:
    """
    Sends the extracted text to the LLM and asks for a JSON learning roadmap.
    Returns the parsed JSON dict on success, or raises ValueError on failure.
    """
    prompt = f"""You are an expert educator.

Analyze the following textbook material from "{book_name}".
Create an ordered learning journey for a student reading this book.
Each topic should represent one clear learning milestone.

Return ONLY valid JSON, no markdown, no explanation, no code block fences.

{{
  "book": "{book_name}",
  "topics": [
    {{
      "title": "",
      "difficulty": "",
      "estimated_time": ""
    }}
  ]
}}

Textbook material:
\"\"\"
{content[:4000]}
\"\"\"
"""

    response = _groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()
    cleaned = clean_json_string(raw)
    data = json.loads(cleaned)
    return data


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def parse_llm_learning_path(raw_json: dict, book_name: str = "") -> dict:
    """
    Converts the raw LLM JSON output into the MentorAI roadmap format.

    Input  (from LLM):
        {
            "book": "Python",
            "topics": [
                {"title": "Variables", "difficulty": "Easy", "estimated_time": "20 min"},
                ...
            ]
        }

    Output (enriched):
        {
            "book": "Python",
            "topics": [
                {
                    "title": "Variables",
                    "status": "current",
                    "read": false,
                    "quiz": false,
                    "exercise": false,
                    "completed": false,
                    "difficulty": "Easy",
                    "estimated_time": "20 min"
                },
                {
                    "title": "Lists",
                    "status": "locked",
                    "read": false,
                    "quiz": false,
                    "exercise": false,
                    "completed": false,
                    "difficulty": "Medium",
                    "estimated_time": "30 min"
                }
            ]
        }

    Rules
    -----
    - First topic → status = "current"
    - All others → status = "locked"
    """
    topics_raw: list[dict] = raw_json.get("topics", [])
    book = raw_json.get("book") or book_name or "Unknown Book"

    enriched_topics: list[dict] = []

    for idx, topic in enumerate(topics_raw):
        enriched = {
            "title": topic.get("title", f"Topic {idx + 1}"),
            "status": "current" if idx == 0 else "locked",
            "read": False,
            "quiz": False,
            "exercise": False,
            "completed": False,
            "difficulty": topic.get("difficulty", ""),
            "estimated_time": topic.get("estimated_time", ""),
        }
        enriched_topics.append(enriched)

    return {
        "book": book,
        "topics": enriched_topics,
    }


def save_learning_path(
    user_id: str,
    document_id: str,
    roadmap: dict,
) -> dict | None:
    """
    Upserts a learning_path record in Supabase.

    Populates:
        user_id, document_id, current_topic, next_topic, roadmap, completed
    """
    topics = roadmap.get("topics", [])
    current_topic = topics[0]["title"] if len(topics) > 0 else ""
    next_topic = topics[1]["title"] if len(topics) > 1 else ""

    data = {
        "user_id": user_id,
        "document_id": document_id,
        "current_topic": current_topic,
        "next_topic": next_topic,
        "roadmap": roadmap,       # stored as JSONB
        "completed": False,
    }

    try:
        # Check whether a record already exists for this user+document
        existing = (
            supabase.table("learning_path")
            .select("id")
            .eq("user_id", user_id)
            .eq("document_id", document_id)
            .execute()
        )

        if existing.data:
            # Update
            res = (
                supabase.table("learning_path")
                .update(data)
                .eq("user_id", user_id)
                .eq("document_id", document_id)
                .execute()
            )
        else:
            # Insert
            res = (
                supabase.table("learning_path")
                .insert(data)
                .execute()
            )

        if res.data:
            return res.data[0]

        return None

    except Exception as e:
        print(f"[LPS] save_learning_path error: {e}")
        return None


def get_learning_path(user_id: str, document_id: str) -> dict | None:
    """
    Retrieves the learning path for a specific user + document from Supabase.
    Returns the record dict, or None if not found.
    """
    try:
        res = (
            supabase.table("learning_path")
            .select("*")
            .eq("user_id", user_id)
            .eq("document_id", document_id)
            .execute()
        )
        if res.data:
            return res.data[0]
        return None
    except Exception as e:
        print(f"[LPS] get_learning_path error: {e}")
        return None


def update_learning_progress(
    user_id: str,
    document_id: str,
    current_topic: str,
    next_topic: str,
    roadmap: dict | None = None,
    completed: bool = False,
) -> dict | None:
    """
    Updates progress fields for an existing learning path.
    Useful for marking topics as read/quiz/exercise done.
    """
    data: dict = {
        "current_topic": current_topic,
        "next_topic": next_topic,
        "completed": completed,
    }
    if roadmap is not None:
        data["roadmap"] = roadmap

    try:
        res = (
            supabase.table("learning_path")
            .update(data)
            .eq("user_id", user_id)
            .eq("document_id", document_id)
            .execute()
        )
        if res.data:
            return res.data[0]
        return None
    except Exception as e:
        print(f"[LPS] update_learning_progress error: {e}")
        return None


def generate_learning_path(user_id: str, document_id: str) -> dict:
    """
    Full end-to-end generator:

    1. Resolve document filename from Supabase (document_id → filename).
    2. Locate the uploaded PDF on disk.
    3. Extract ToC or first pages using smart scanning.
    4. Call the LLM to produce a JSON roadmap.
    5. Enrich the LLM output with MentorAI status fields.
    6. Save to Supabase.
    7. Return the saved roadmap.

    Returns a dict with keys:
        success  : bool
        roadmap  : dict  (only when success=True)
        message  : str   (only when success=False)
    """
    # -----------------------------------------------------------------------
    # 1. Resolve filename
    # -----------------------------------------------------------------------
    filename = _get_document_filename(document_id)

    if not filename:
        # Last-ditch: see if document_id is itself a filename in the DB
        try:
            res = (
                supabase.table("documents")
                .select("filename")
                .eq("user_id", user_id)
                .execute()
            )
            if res.data:
                filename = res.data[0]["filename"]
        except Exception:
            pass

    if not filename:
        return {"success": False, "message": "Document not found for this user."}

    # -----------------------------------------------------------------------
    # 2. Locate PDF on disk
    # -----------------------------------------------------------------------
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        print(f"[LPS] PDF not found at {file_path}")
        return {
            "success": False,
            "message": f"PDF file '{filename}' not found on disk.",
        }

    # -----------------------------------------------------------------------
    # 3. Extract ToC / first pages
    # -----------------------------------------------------------------------
    print(f"[LPS] Extracting structure from: {filename}")
    content = _extract_toc_text(file_path)

    if not content:
        return {
            "success": False,
            "message": "Could not extract any text from the PDF.",
        }

    # Use filename (without extension) as the default book name
    book_name = os.path.splitext(filename)[0]

    # -----------------------------------------------------------------------
    # 4. Call LLM
    # -----------------------------------------------------------------------
    print("[LPS] Sending content to LLM for roadmap generation…")
    try:
        raw_json = _call_llm_for_roadmap(book_name, content)
    except json.JSONDecodeError as e:
        print(f"[LPS] LLM returned invalid JSON: {e}")
        return {"success": False, "message": "LLM returned malformed JSON. Please retry."}
    except Exception as e:
        print(f"[LPS] LLM call failed: {e}")
        return {"success": False, "message": f"LLM error: {str(e)}"}

    # -----------------------------------------------------------------------
    # 5. Enrich with MentorAI fields
    # -----------------------------------------------------------------------
    roadmap = parse_llm_learning_path(raw_json, book_name)
    print(f"[LPS] Roadmap generated: {len(roadmap['topics'])} topics")

    # -----------------------------------------------------------------------
    # 6. Save to Supabase
    # -----------------------------------------------------------------------
    saved = save_learning_path(user_id=user_id, document_id=document_id, roadmap=roadmap)

    if saved is None:
        return {
            "success": False,
            "message": "Roadmap generated but failed to save to database.",
        }

    # -----------------------------------------------------------------------
    # 7. Return
    # -----------------------------------------------------------------------
    print("[LPS] Learning path saved successfully.")
    return {"success": True, "roadmap": roadmap}
