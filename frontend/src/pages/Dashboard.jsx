import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabase";
import { getDocuments } from "../services/documentService";
import { BookOpen, FileText, ArrowRight, Sparkles, Award } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [docCount, setDocCount] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  async function loadStats() {
    try {
      const docs = await getDocuments();
      setDocCount(docs.length);

      const { data: paths } = await supabase
        .from("learning_path")
        .select("roadmap")
        .eq("user_id", user.id);

      if (paths && paths.length > 0) {
        let totalProgress = 0;
        paths.forEach((path) => {
          const topics = path.roadmap?.topics || [];
          const completed = topics.filter((t) => t.completed).length;
          const prog = topics.length > 0 ? (completed / topics.length) * 100 : 0;
          totalProgress += prog;
        });
        setAvgProgress(Math.round(totalProgress / paths.length));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const name = user?.user_metadata?.full_name || "Learner";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden mb-8">
          <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center pr-8">
            <Sparkles size={180} />
          </div>
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl font-extrabold leading-tight">
              Welcome back, {name}! 👋
            </h1>
            <p className="text-sm text-blue-100/90 mt-2 leading-relaxed">
              Continue mastering your textbooks. MentorAI has drafted personalized quizzes and exercises tailored exactly to your progress.
            </p>
            <button
              onClick={() => navigate("/learning")}
              className="mt-6 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 text-xs"
            >
              <span>Resume Learning Journey</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Library Size
                </span>
                <span className="text-xl font-extrabold text-gray-800 block mt-0.5">
                  {docCount} {docCount === 1 ? "Textbook" : "Textbooks"}
                </span>
                <button
                  onClick={() => navigate("/documents")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 mt-1.5 transition"
                >
                  Manage Library <ArrowRight size={10} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Average Progress
                </span>
                <span className="text-xl font-extrabold text-gray-800 block mt-0.5">
                  {avgProgress}% Completed
                </span>
                <button
                  onClick={() => navigate("/learning")}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 mt-1.5 transition"
                >
                  View Roadmaps <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions / Shortcuts */}
        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">
            Quick Shortcuts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => navigate("/chat")}
              className="bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 shadow-2xs cursor-pointer hover:shadow-xs transition flex items-center justify-between gap-3 group"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">
                  🤖 Ask AI Tutor
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Clear doubt about any chapter instantly.
                </p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition" />
            </div>

            <div
              onClick={() => navigate("/documents")}
              className="bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 shadow-2xs cursor-pointer hover:shadow-xs transition flex items-center justify-between gap-3 group"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">
                  📤 Upload Textbooks
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Index more textbooks to generate new courses.
                </p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}