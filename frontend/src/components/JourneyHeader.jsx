import React from "react";
import { Award, Clock, ArrowRight } from "lucide-react";

export default function JourneyHeader({ docName, learningPath }) {
  const topics = learningPath?.roadmap?.topics || [];
  const completedCount = topics.filter((t) => t.completed).length;
  const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
  const currentTopic = learningPath?.current_topic || topics.find((t) => t.status === "current")?.title || "None";
  const nextTopic = learningPath?.next_topic || topics.find((t) => t.status === "locked")?.title || "Done!";

  // Calculate remaining estimated time
  const getRemainingTime = () => {
    let minutes = 0;
    topics.forEach((t) => {
      if (!t.completed) {
        const timeStr = t.estimated_time || "20 mins";
        const val = parseInt(timeStr);
        if (!isNaN(val)) {
          minutes += val;
        } else {
          minutes += 20; // default fallback
        }
      }
    });
    if (minutes === 0) return "Done!";
    if (minutes < 60) return `${minutes} mins remaining`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins > 0 ? `${mins}m` : ""} remaining`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Book title and progress */}
        <div className="flex-1">
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full">
            Learning Journey
          </span>
          <h2 className="text-xl font-extrabold text-gray-800 truncate mt-2 leading-tight">
            {docName}
          </h2>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700 shrink-0">{progress}%</span>
          </div>
        </div>

        {/* Quick info badges */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 min-w-[130px]">
            <Award className="text-amber-500 shrink-0" size={18} />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                Progress
              </span>
              <span className="text-xs font-bold text-gray-700">
                {completedCount} / {topics.length} Topics
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 min-w-[130px]">
            <Clock className="text-indigo-500 shrink-0" size={18} />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                Remaining Time
              </span>
              <span className="text-xs font-bold text-gray-700">
                {getRemainingTime()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus banner */}
      {topics.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">
              Current Target
            </span>
            <h4 className="text-sm font-bold text-slate-800 mt-0.5 truncate">
              {currentTopic}
            </h4>
          </div>
          {nextTopic !== "Done!" && (
            <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
              <span>Next:</span>
              <span className="font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none">
                {nextTopic}
              </span>
              <ArrowRight size={13} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
