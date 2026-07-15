# 🎓 MentorAI

> **An AI-powered personalized learning platform that transforms static textbooks into an interactive learning journey.**

MentorAI is an intelligent learning platform that combines **Retrieval-Augmented Generation (RAG)**, **Large Language Models (LLMs)**, and **personalized learning paths** to help students understand, practice, and master educational material chapter by chapter.

Instead of simply answering questions, MentorAI acts as a personal AI mentor that guides students through an entire textbook using structured lessons, quizzes, coding exercises, flashcards, revision notes, and progress tracking.

---

# ✨ Features

## 📚 Smart Document Library

- Upload multiple PDF textbooks
- Automatic document chunking
- Vector embedding generation
- Semantic document search
- Document preview
- Multi-book management

---

## 🤖 AI Tutor

Students can ask natural language questions about any uploaded document.

Features include:

- Retrieval-Augmented Generation (RAG)
- Context-aware responses
- Conversation history
- Source citation
- Document-grounded answers
- Memory-aware conversations

---

## 🧠 Personalized Learning Journey

One of MentorAI's core features.

Instead of reading a PDF from beginning to end, MentorAI automatically generates a structured roadmap.

Example:

```
Python Programming

✓ Introduction

✓ Variables

🟡 Lists

🔒 Tuples

🔒 Dictionaries

🔒 Functions

🔒 Object Oriented Programming
```

The roadmap is generated automatically using the document's structure (Table of Contents or extracted chapters).

---

## 📖 AI Lesson Generator

Each topic becomes a complete lesson.

Lessons include:

- Concept explanation
- Important ideas
- Code examples
- Key takeaways
- Difficulty level
- Estimated learning time

All explanations are generated only using information retrieved from the uploaded textbook to minimize hallucinations.

---

## 📝 AI Quiz Generator

Generate topic-specific quizzes instantly.

Each quiz contains:

- Multiple Choice Questions
- Four options
- Correct answer validation
- Interactive UI
- Score tracking
- Progress updates

---

## 💻 Coding Challenges

Automatically generates programming exercises from textbook concepts.

Includes:

- Problem statement
- Starter code
- Progressive hints
- Suggested solution
- Interactive coding workspace

Future updates will support online code execution.

---

## 📑 Revision Notes

Generate concise revision material including:

- Topic summary
- Key bullet points
- Important rules
- Formulas
- Copy-to-clipboard support

---

## 🃏 Flashcards

Generate AI-powered flashcards for quick revision.

Useful for:

- Definitions
- Syntax
- Concepts
- Memorization

---

## 🎤 Mock Interview Preparation

Creates interview-style questions from the uploaded material.

Useful for:

- Placement preparation
- Viva practice
- Technical interviews

---

## 📈 Learning Progress Tracking

MentorAI tracks learning progress automatically.

Each topic stores:

- Read status
- Quiz completion
- Coding exercise completion
- Topic completion

Only after finishing all learning activities is the next topic unlocked.

---

## 📚 Multi-book Learning

Users can upload multiple textbooks.

Each book has:

- Independent roadmap
- Individual progress
- Current topic
- Next topic
- Completion percentage

---

# 🏗️ Architecture

```
                PDF Upload
                     │
                     ▼
           PDF Chunking & Parsing
                     │
                     ▼
           Vector Embedding Generation
                     │
                     ▼
             Supabase Vector Store
                     │
                     ▼
         Semantic Retrieval (RAG)
                     │
                     ▼
          Context + User Question
                     │
                     ▼
              Groq LLM (Llama)
                     │
                     ▼
       AI Tutor / Lessons / Quiz / Exercise
                     │
                     ▼
          React Learning Dashboard
```

---
                                    ┌──────────────────────────┐
                                    │        USER (React)      │
                                    │  Asks a Question / Chat  │
                                    └─────────────┬────────────┘
                                                  │
                                                  ▼
                                   ┌─────────────────────────────┐
                                   │ FastAPI /chat Endpoint      │
                                   │ Receives User Question      │
                                   └─────────────┬───────────────┘
                                                 │
                  ┌──────────────────────────────┼──────────────────────────────┐
                  │                              │                              │
                  ▼                              ▼                              ▼
      ┌─────────────────────┐      ┌─────────────────────────┐     ┌─────────────────────────┐
      │ Get User Memory      │      │ Get Chat History        │     │ Check Response Cache    │
      │ (Supabase)           │      │ (Recent Messages)       │     │ Same Question?          │
      └──────────┬───────────┘      └──────────┬──────────────┘     └──────────┬──────────────┘
                 │                             │                               │
                 └──────────────┬──────────────┴───────────────────────────────┘
                                │
                                ▼
                  ┌────────────────────────────────────┐
                  │ Query Rewriting (Groq Llama 3.3)   │
                  │ Converts follow-up questions into  │
                  │ standalone searchable queries      │
                  └──────────────┬─────────────────────┘
                                 │
                                 ▼
                   ┌────────────────────────────────┐
                   │ Check Rewrite Cache            │
                   │ Reuse if Already Generated     │
                   └──────────────┬─────────────────┘
                                  │
                                  ▼
                ┌────────────────────────────────────────┐
                │ Embedding Model                        │
                │ BAAI/bge-small-en-v1.5                │
                │ Converts Query → 384D Vector          │
                └──────────────┬────────────────────────┘
                               │
                               ▼
               ┌───────────────────────────────────────────┐
               │ ChromaDB Vector Database                  │
               │                                           │
               │ Stores:                                  │
               │ • Chunk Text                             │
               │ • Embedding Vector                       │
               │ • Metadata (Page, Source)                │
               └──────────────┬────────────────────────────┘
                              │
                              ▼
              ┌────────────────────────────────────────────┐
              │ Similarity Search                          │
              │ • Embed Query                              │
              │ • Compare with Stored Embeddings           │
              │ • Rank by Similarity                       │
              │ • Retrieve Top 6                           │
              │ • Remove Duplicate Pages                   │
              │ • Keep Best 3 Chunks                       │
              └──────────────┬─────────────────────────────┘
                             │
                             ▼
          ┌────────────────────────────────────────────────────┐
          │ Build Final Prompt                                │
          │                                                    │
          │ • System Instructions                             │
          │ • Student Memory Summary                          │
          │ • Retrieved Context                               │
          │ • Last 4 Conversation Messages                    │
          │ • Current User Question                           │
          └──────────────┬─────────────────────────────────────┘
                         │
                         ▼
          ┌────────────────────────────────────────────────────┐
          │ Groq API                                           │
          │ Model: Llama 3.3 70B Versatile                     │
          │                                                    │
          │ Generates Personalized Answer                      │
          └──────────────┬─────────────────────────────────────┘
                         │
             ┌───────────┴───────────────┐
             │                           │
             ▼                           ▼
 ┌─────────────────────────┐   ┌────────────────────────────┐
 │ Generate Toolbox        │   │ Save Conversation          │
 │ • Quiz                  │   │ User Message               │
 │ • Flashcards            │   │ Assistant Response         │
 │ • Exercises             │   │ History Updated            │
 └────────────┬────────────┘   └──────────────┬─────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
          ┌───────────────────────────────────────────────┐
          │ Check Conversation Length                     │
          │ Assistant Replies >= 5 ?                      │
          └──────────────┬────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
             No                    Yes
              │                     │
              │                     ▼
              │     ┌──────────────────────────────────────┐
              │     │ Memory Summarization                 │
              │     │ Groq Generates:                      │
              │     │ • Learning Summary                   │
              │     │ • Strengths                          │
              │     │ • Weak Topics                        │
              │     │ • Learning Style                     │
              │     └──────────────┬───────────────────────┘
              │                    │
              │                    ▼
              │      ┌────────────────────────────────────┐
              │      │ Save Memory to Supabase            │
              │      │ Clear Active Chat History          │
              │      └──────────────┬─────────────────────┘
              │                     │
              └─────────────────────┴─────────────────────┐
                                                          ▼
                                      ┌──────────────────────────────┐
                                      │ Return Response to Frontend  │
                                      │ • Answer                     │
                                      │ • Sources                    │
                                      │ • Toolbox                    │
                                      └──────────────────────────────┘



# 🧠 Learning Workflow

```
Upload Textbook

        │

        ▼

Generate Learning Roadmap

        │

        ▼

Study Lesson

        │

        ▼

Take Quiz

        │

        ▼

Solve Coding Exercise

        │

        ▼

Complete Topic

        │

        ▼

Unlock Next Topic

        │

        ▼

Complete Book
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

---

## Backend

- FastAPI
- Python

---

## Database

- Supabase

Tables include:

- profiles
- documents
- chat_sessions
- chat_messages
- learning_path
- memory
- user_memory

---

## AI

- Groq API
- Llama 3.3 70B
- Llama 3.1 8B Instant

---

## Retrieval

- Vector Search
- Metadata Filtering
- Context Retrieval
- Document-specific search

---

# 📂 Project Structure

```
frontend/
│
├── components/
│     ├── LessonViewer
│     ├── QuizViewer
│     ├── ExerciseViewer
│     ├── FlashcardsViewer
│     ├── RevisionViewer
│     ├── InterviewViewer
│     ├── TopicWorkspace
│     ├── JourneyTimeline
│     ├── BookShelf
│     └── LearningWorkspace
│
├── pages/
│     ├── Dashboard
│     ├── Documents
│     ├── Chat
│     ├── Learning
│     └── Profile
│
└── services/
      └── api.js


backend/
│
├── routes/
│     ├── chat.py
│     ├── learning.py
│     ├── learning_path.py
│
├── services/
│     ├── rag.py
│     ├── learning_path_service.py
│     ├── prompt_builder.py
│     └── supabase_service.py
│
└── uploads/
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/MentorAI.git
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 🔑 Environment Variables

Create a `.env` file.

```
GROQ_API_KEY=your_key

SUPABASE_URL=your_url

SUPABASE_KEY=your_key
```

---

# 📸 Screens

- Dashboard
- Document Upload
- AI Tutor
- Learning Journey
- Lesson Viewer
- Quiz
- Coding Challenge
- Flashcards
- Revision Notes

---

# 🚧 Future Improvements

- AI-generated notes export as PDF
- Previous Year Question (PYQ) analysis
- Automatic exam preparation mode
- Personalized revision schedules
- Pomodoro study timer
- Study streaks and achievements
- AI weak-topic detection
- Learning analytics dashboard
- Interactive code execution
- Mobile application
- Voice-based tutoring
- OCR for scanned textbooks

---

# 🎯 Vision

MentorAI aims to move beyond traditional AI chatbots by becoming a complete AI learning companion.

Instead of simply answering questions, it helps students:

- Learn systematically
- Practice continuously
- Track progress visually
- Master complete textbooks
- Prepare for exams efficiently

The goal is to make studying personalized, interactive, and significantly more effective.

---

# 👨‍💻 Developed By

**Jayashrii Shankar**

B.Tech Computer Science & Engineering (AI & ML)

SRM Institute of Science and Technology

---

# ⭐ If you found this project interesting, consider giving it a star!
