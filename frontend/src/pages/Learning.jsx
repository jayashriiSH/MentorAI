import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabase";
import BookShelf from "../components/BookShelf";
import LearningJourney from "../components/LearningJourney";
import { getDocuments } from "../services/documentService";
import { getLearningPathForDoc, generateLearningPathForDoc, updateTopicProgress } from "../services/api";
import { GraduationCap } from "lucide-react";

export default function Learning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [pathsByDocId, setPathsByDocId] = useState({});
  const [loading, setLoading] = useState(true);
  const [pathLoading, setPathLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. Fetch user's uploaded documents
      const docs = await getDocuments();
      setDocuments(docs);

      // 2. Fetch all learning paths for the user from Supabase
      const { data: paths } = await supabase
        .from("learning_path")
        .select("*")
        .eq("user_id", user.id);

      if (paths) {
        const pathMap = {};
        paths.forEach((path) => {
          pathMap[path.document_id] = path;
        });
        setPathsByDocId(pathMap);
      }

      // Automatically select the first book if available
      if (docs.length > 0) {
        const firstDoc = docs[0];
        const existing = paths ? paths.find((p) => p.document_id === firstDoc.id) : null;
        setSelectedBook(firstDoc);
        if (existing) {
          setPathsByDocId((prev) => ({ ...prev, [firstDoc.id]: existing }));
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectBook = async (book, existingPath = null) => {
    setSelectedBook(book);
    if (existingPath || pathsByDocId[book.id]) {
      return;
    }

    setPathLoading(true);
    try {
      const res = await getLearningPathForDoc(user.id, book.id).catch(() => null);
      if (res && res.success && res.path) {
        setPathsByDocId((prev) => ({ ...prev, [book.id]: res.path }));
      }
    } catch (err) {
      console.error("Error loading learning path for document:", err);
    } finally {
      setPathLoading(false);
    }
  };

  const handleGenerateRoadmap = async (book) => {
    if (!book) return;
    setPathLoading(true);
    try {
      const genRes = await generateLearningPathForDoc(user.id, book.id);
      if (genRes.success && genRes.roadmap) {
        const newPath = {
          user_id: user.id,
          document_id: book.id,
          roadmap: genRes.roadmap,
          current_topic: genRes.roadmap.topics[0]?.title || "",
          next_topic: genRes.roadmap.topics[1]?.title || "",
          completed: false,
        };
        setPathsByDocId((prev) => ({ ...prev, [book.id]: newPath }));
      }
    } catch (err) {
      console.error("Error generating learning path for document:", err);
    } finally {
      setPathLoading(false);
    }
  };

  const handleUpdateProgress = async (topicTitle, updates) => {
    const currentPath = pathsByDocId[selectedBook.id];
    if (!selectedBook || !currentPath) return;

    const topics = [...(currentPath.roadmap?.topics || [])];
    const topicIdx = topics.findIndex((t) => t.title === topicTitle);
    if (topicIdx === -1) return;

    const updatedTopic = { ...topics[topicIdx], ...updates };
    if (updates.completed) {
      updatedTopic.completed = true;
      updatedTopic.status = "completed";
    }
    topics[topicIdx] = updatedTopic;

    let nextTopicTitle = "";
    let newCurrentTopicTitle = currentPath.current_topic;
    let isAllCompleted = false;

    if (updates.completed) {
      const remaining = topics.filter((t) => !t.completed);
      if (remaining.length > 0) {
        const nextIdx = topics.findIndex((t) => t.title === remaining[0].title);
        topics[nextIdx] = { ...topics[nextIdx], status: "current" };
        newCurrentTopicTitle = topics[nextIdx].title;
        
        const nextNext = remaining[1];
        nextTopicTitle = nextNext ? nextNext.title : "";
      } else {
        newCurrentTopicTitle = "";
        nextTopicTitle = "";
        isAllCompleted = true;
      }
    } else {
      const remaining = topics.filter((t) => !t.completed && t.title !== updatedTopic.title);
      nextTopicTitle = remaining[0] ? remaining[0].title : "";
    }

    const updatedRoadmap = {
      ...currentPath.roadmap,
      topics,
    };

    try {
      const res = await updateTopicProgress(
        user.id,
        selectedBook.id,
        updatedRoadmap,
        newCurrentTopicTitle,
        nextTopicTitle,
        isAllCompleted
      );

      if (res.success) {
        const updatedPathObj = {
          ...currentPath,
          roadmap: updatedRoadmap,
          current_topic: newCurrentTopicTitle,
          next_topic: nextTopicTitle,
          completed: isAllCompleted,
        };
        setPathsByDocId((prev) => ({
          ...prev,
          [selectedBook.id]: updatedPathObj,
        }));
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const activePath = selectedBook ? pathsByDocId[selectedBook.id] : null;

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={32} />
            Your Learning Journey
          </h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Master every uploaded textbook through personalized AI lessons, quizzes, coding challenges, and guided progress.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm font-semibold">Preparing your library shelf...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px] max-w-xl mx-auto mt-8 shadow-xs">
            <div className="text-5xl">📚</div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">No books uploaded yet</h2>
              <p className="text-sm text-gray-500 mt-1">
                Upload your first textbook to generate an AI learning journey.
              </p>
            </div>
            <button
              onClick={() => navigate("/documents")}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition"
            >
              Upload Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 overflow-hidden flex-1 min-h-0">
            {/* LEFT COLUMN: Library Shelf */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col min-h-0">
              <BookShelf
                documents={documents}
                selectedDocId={selectedBook?.id}
                onSelectBook={(book) => handleSelectBook(book, pathsByDocId[book.id])}
                pathsByDocId={pathsByDocId}
              />
            </div>

            {/* RIGHT COLUMN: Active Book Learning Journey */}
            <div className="overflow-y-auto pr-1 min-h-0">
              <LearningJourney
                doc={selectedBook}
                learningPath={activePath}
                onUpdateProgress={handleUpdateProgress}
                onGenerateRoadmap={() => handleGenerateRoadmap(selectedBook)}
                loading={pathLoading}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
