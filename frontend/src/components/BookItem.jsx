import React from "react";
import { Book, Play } from "lucide-react";

export default function BookItem({ doc, isSelected, onClick, learningPath }) {
  const topics = learningPath?.roadmap?.topics || [];
  const completedCount = topics.filter((t) => t.completed).length;
  const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
  const currentTopic = learningPath?.current_topic || topics.find((t) => t.status === "current")?.title || "Not started";

  // Pick a nice gradient based on filename length
  const getGradient = (name) => {
    const len = name.length;
    if (len % 4 === 0) return "from-blue-500 to-indigo-600";
    if (len % 4 === 1) return "from-emerald-500 to-teal-600";
    if (len % 4 === 2) return "from-purple-500 to-pink-600";
    return "from-orange-500 to-amber-600";
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border rounded-2xl p-5 shadow-xs transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/10"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex gap-4">
        {/* Book Cover Icon */}
        <div
          className={`w-12 h-14 rounded-xl bg-gradient-to-br ${getGradient(
            doc.filename
          )} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300`}
        >
          <Book size={22} className="opacity-90" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm md:text-base truncate leading-snug group-hover:text-blue-600 transition-colors">
            {doc.filename}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {doc.pages} Pages • {doc.chunks} Chunks
          </p>

          {/* Progress Section */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-1">
              <span>Progress</span>
              <span className="text-gray-700">{progress}%</span>
            </div>
            {/* Progress bar wrapper */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current topic & Continue */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                Current Topic
              </span>
              <span className="text-xs font-semibold text-gray-700 truncate block mt-0.5">
                {currentTopic}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                isSelected
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
              }`}
            >
              <Play size={10} fill="currentColor" />
              <span>Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
