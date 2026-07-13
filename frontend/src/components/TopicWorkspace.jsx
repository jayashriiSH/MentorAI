import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LessonViewer from "./LessonViewer";
import QuizViewer from "./QuizViewer";
import ExerciseViewer from "./ExerciseViewer";
import FlashcardsViewer from "./FlashcardsViewer";
import RevisionViewer from "./RevisionViewer";
import InterviewViewer from "./InterviewViewer";
import { BookOpen, HelpCircle, Code, MessageSquare, CheckCircle, Sparkles, Brain, Award } from "lucide-react";
import { generateLesson, learningAction } from "../services/api";

export default function TopicWorkspace({ topic, docId, docFilename, progressState, onUpdateProgress }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lesson");
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [exerciseData, setExerciseData] = useState(null);

  // Future tools state
  const [futureToolLoading, setFutureToolLoading] = useState(false);
  const [futureToolData, setFutureToolData] = useState(null);

  // Read progress tracker
  const isRead = progressState?.read || false;
  const isQuizDone = progressState?.quiz || false;
  const isExerciseDone = progressState?.exercise || false;
  const isCompleted = progressState?.completed || false;

  // Whenever the active topic changes, reload lesson and reset states
  useEffect(() => {
    if (topic && docId) {
      loadLessonContent();
      setActiveTab("lesson");
      setQuizData(null);
      setExerciseData(null);
      setFutureToolData(null);
    }
  }, [topic, docId]);

  async function loadLessonContent() {
    setLessonLoading(true);
    setLessonData(null);
    try {
      const res = await generateLesson(topic.title, docId);
      if (res.success) {
        setLessonData(res.data);
        // Automatically mark lesson as read if not already marked
        if (!isRead) {
          onUpdateProgress(topic.title, { read: true });
        }
      } else {
        console.error("Lesson generation failed:", res.message);
      }
    } catch (err) {
      console.error("Error loading lesson:", err);
    } finally {
      setLessonLoading(false);
    }
  }

  async function loadQuizData() {
    if (quizData || !lessonData) return;
    setQuizLoading(true);
    try {
      const res = await learningAction(
        "quiz",
        `Generate a quiz about the topic: ${topic.title}`,
        lessonData.explanation
      );
      setQuizData(res.data);
    } catch (err) {
      console.error("Error loading quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  }

  async function loadExerciseData() {
    if (exerciseData || !lessonData) return;
    setExerciseLoading(true);
    try {
      const res = await learningAction(
        "exercise",
        `Generate coding exercise challenge for: ${topic.title}`,
        lessonData.explanation
      );
      setExerciseData(res.data);
    } catch (err) {
      console.error("Error loading exercise:", err);
    } finally {
      setExerciseLoading(false);
    }
  }

  async function loadFutureTool(toolType) {
    if (!lessonData) return;
    setActiveTab(toolType);
    setFutureToolLoading(true);
    try {
      const res = await learningAction(
        toolType,
        `Provide ${toolType} guide for topic: ${topic.title}`,
        lessonData.explanation
      );
      setFutureToolData({ type: toolType, data: res.data });
    } catch (err) {
      console.error(`Error loading ${toolType}:`, err);
    } finally {
      setFutureToolLoading(false);
    }
  }

  // Trigger loading when switching tabs
  useEffect(() => {
    if (activeTab === "quiz") {
      loadQuizData();
    } else if (activeTab === "exercise") {
      loadExerciseData();
    }
  }, [activeTab, lessonData]);

  const handleQuizComplete = () => {
    if (!isQuizDone) {
      onUpdateProgress(topic.title, { quiz: true });
    }
  };

  const handleExerciseComplete = () => {
    if (!isExerciseDone) {
      onUpdateProgress(topic.title, { exercise: true });
    }
  };

  const handleAskMentor = () => {
    // Open AI Tutor (chat page) automatically scoped to this book and topic
    const prefilledPrompt = `Teach me about ${topic.title} from ${docFilename}`;
    navigate(`/chat?document=${encodeURIComponent(docFilename)}&prompt=${encodeURIComponent(prefilledPrompt)}`);
  };

  const handleCompleteTopicBtn = () => {
    onUpdateProgress(topic.title, { completed: true });
  };

  const showCompletionButton = isRead && isQuizDone && isExerciseDone && !isCompleted;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Workspace Header Tabs */}
      <div className="flex border-b border-gray-100 bg-slate-50/50 shrink-0">
        <button
          onClick={() => setActiveTab("lesson")}
          className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "lesson"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          }`}
        >
          <BookOpen size={14} />
          Study Lesson
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          disabled={!lessonData}
          className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "quiz"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <HelpCircle size={14} />
          Practice Quiz
          {isQuizDone && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("exercise")}
          disabled={!lessonData}
          className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "exercise"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <Code size={14} />
          Coding Challenge
          {isExerciseDone && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
        </button>
      </div>

      {/* Workspace Sub-tabs for future scaling */}
      {lessonData && (
        <div className="flex px-4 py-2 gap-2 bg-slate-50/20 border-b border-gray-100 text-[10px] shrink-0 overflow-x-auto scrollbar-none">
          <span className="text-gray-400 font-bold self-center mr-1">EXTRA TOOLS:</span>
          
          <button
            onClick={() => loadFutureTool("flashcards")}
            className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
              activeTab === "flashcards"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Flashcards
          </button>
          
          <button
            onClick={() => loadFutureTool("revision")}
            className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
              activeTab === "revision"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Revision Notes
          </button>
          
          <button
            onClick={() => loadFutureTool("interview")}
            className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
              activeTab === "interview"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Interview Prep
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {lessonLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm font-semibold">Generating textbook lesson using RAG...</span>
            <span className="text-xs text-gray-400 max-w-[250px] text-center leading-relaxed">
              We extract corresponding details directly from your uploaded textbook.
            </span>
          </div>
        ) : activeTab === "lesson" ? (
          <LessonViewer
            lesson={lessonData}
            difficulty={topic.difficulty}
            estimatedTime={topic.estimated_time}
            progress={{ read: isRead, quiz: isQuizDone, exercise: isExerciseDone }}
            onStartQuiz={() => setActiveTab("quiz")}
            onStartExercise={() => setActiveTab("exercise")}
            onAskMentor={handleAskMentor}
          />
        ) : activeTab === "quiz" ? (
          quizLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
              <span className="text-xs font-semibold">Generating quiz questions...</span>
            </div>
          ) : (
            <QuizViewer
    data={quizData?.data}
    onComplete={handleQuizComplete}
/>
          )
        ) : activeTab === "exercise" ? (
          exerciseLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
              <span className="text-xs font-semibold">Creating coding challenge...</span>
            </div>
          ) : (
            <ExerciseViewer data={exerciseData} onComplete={handleExerciseComplete} />
          )
        ) : activeTab === "flashcards" ? (
          futureToolLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
              <span className="text-xs font-semibold">Generating flashcards...</span>
            </div>
          ) : (
            <FlashcardsViewer data={futureToolData?.data} />
          )
        ) : activeTab === "revision" ? (
          futureToolLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
              <span className="text-xs font-semibold">Preparing revision notes...</span>
            </div>
          ) : (
            <RevisionViewer data={futureToolData?.data} />
          )
        ) : activeTab === "interview" ? (
          futureToolLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
              <span className="text-xs font-semibold">Setting up interview panel...</span>
            </div>
          ) : (
            <InterviewViewer data={futureToolData?.data} />
          )
        ) : null}
      </div>

      {/* Complete Topic Banner */}
      {showCompletionButton && (
        <div className="border-t border-green-100 bg-green-50 p-4 shrink-0 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-green-950">You've mastered this topic!</h4>
              <p className="text-[10px] text-green-700 font-medium">Lesson read, quiz passed, and challenge completed.</p>
            </div>
          </div>
          <button
            onClick={handleCompleteTopicBtn}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            Complete Topic & Unlock Next
          </button>
        </div>
      )}

      {/* Completed State Banner */}
      {isCompleted && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Topic Completed</h4>
            <p className="text-[10px] text-gray-500 font-medium">You can review the study material, quizzes, and codes anytime.</p>
          </div>
        </div>
      )}
    </div>
  );
}
