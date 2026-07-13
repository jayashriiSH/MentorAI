import React from "react";
import { CheckCircle2, Circle, Lock, Play, GraduationCap } from "lucide-react";

export default function JourneyTimeline({ topics, activeTopicTitle, onSelectTopic }) {
  if (topics.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-400">
        No topics generated.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6 flex items-center gap-2">
        <GraduationCap size={15} className="text-gray-400" />
        Curriculum Timeline
      </h3>

      <div className="relative pl-8 space-y-8">
        {/* Timeline vertical connector line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-100" />

        {topics.map((topic, index) => {
          const isCompleted = topic.completed;
          const isCurrent = topic.status === "current";
          const isLocked = !isCompleted && !isCurrent;
          const isActiveWorkspace = activeTopicTitle === topic.title;

          // Determine circle styles
          let circleBg = "bg-gray-100 border-gray-300 text-gray-400";
          let textColor = "text-gray-400";
          let badgeText = "";
          let icon = <Lock size={12} />;

          if (isCompleted) {
            circleBg = "bg-green-500 border-green-500 text-white ring-4 ring-green-100";
            textColor = "text-gray-600 font-semibold";
            icon = <CheckCircle2 size={14} />;
            badgeText = "Completed";
          } else if (isCurrent) {
            circleBg = "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse";
            textColor = "text-blue-900 font-bold";
            icon = <Play size={10} fill="currentColor" className="ml-0.5" />;
            badgeText = "Active Target";
          } else {
            textColor = "text-gray-400 font-medium";
          }

          // Active workspace styling
          const itemBg = isActiveWorkspace
            ? "bg-slate-50 border-slate-200 ring-2 ring-slate-100"
            : "hover:bg-gray-50/50 border-transparent";

          const isClickable = !isLocked;

          return (
            <div
              key={index}
              onClick={() => isClickable && onSelectTopic(topic)}
              className={`relative flex items-center justify-between gap-4 p-3.5 border rounded-xl transition-all duration-200 ${itemBg} ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              {/* Step indicator dot */}
              <div
                className={`absolute -left-[32px] w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${circleBg}`}
              >
                {icon}
              </div>

              {/* Topic Label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm truncate leading-snug ${textColor}`}>
                    {topic.title}
                  </h4>
                  {badgeText && (
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0 tracking-wider ${
                        isCompleted
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {badgeText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium mt-1">
                  <span>{topic.difficulty || "Easy"}</span>
                  <span>•</span>
                  <span>{topic.estimated_time || "15 mins"}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0">
                {isLocked ? (
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                    Locked
                  </span>
                ) : isCurrent ? (
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
                    Study Now
                  </span>
                ) : (
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                    Review
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
