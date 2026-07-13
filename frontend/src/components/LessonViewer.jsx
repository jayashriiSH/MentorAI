import React from "react";
import { BookOpen, Star, HelpCircle, Code, MessageSquare, AlertCircle } from "lucide-react";

export default function LessonViewer({ lesson, difficulty, estimatedTime, onStartQuiz, onStartExercise, onAskMentor, progress }) {
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 min-h-[300px]">
        <AlertCircle size={32} className="mb-2 text-slate-300" />
        <p className="text-sm font-medium">No lesson content generated.</p>
      </div>
    );
  }

  const { title, explanation, examples = [], key_takeaways = [] } = lesson;

  return (
    <div className="space-y-6">
      {/* Lesson Metadata Banner */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-500" size={18} />
            {title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mt-1">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
              {difficulty || "Easy"}
            </span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
              {estimatedTime || "15 mins"}
            </span>
          </div>
        </div>

        {/* Completion status summary */}
        <div className="flex items-center gap-1 bg-blue-50/50 border border-blue-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700">
          <span>Target Progress:</span>
          <span>
            {[progress.read, progress.quiz, progress.exercise].filter(Boolean).length} / 3 Complete
          </span>
        </div>
      </div>

      {/* Lesson Body */}
      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
            Concept Explanation
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
            {explanation}
          </p>
        </div>

        {/* Examples Section */}
        {examples && examples.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Code size={14} className="text-rose-500" />
              Code & Concept Examples
            </h4>
            <div className="space-y-3">
              {examples.map((example, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-gray-100 overflow-x-auto shadow-inner leading-relaxed"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {key_takeaways && key_takeaways.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" />
              Key Takeaways
            </h4>
            <ul className="grid grid-cols-1 gap-2.5">
              {key_takeaways.map((takeaway, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 bg-amber-50/30 border border-amber-100/30 rounded-xl p-3 text-xs text-amber-950 font-medium"
                >
                  <span className="w-5 h-5 bg-amber-100 text-amber-700 font-bold rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-6">
        <button
          onClick={onStartQuiz}
          className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
            progress.quiz
              ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <HelpCircle size={15} />
          {progress.quiz ? "Retake Quiz" : "Start Quiz"}
        </button>

        <button
          onClick={onStartExercise}
          className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
            progress.exercise
              ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
              : "bg-rose-600 text-white hover:bg-rose-700"
          }`}
        >
          <Code size={15} />
          {progress.exercise ? "Retake Exercise" : "Start Exercise"}
        </button>

        <button
          onClick={onAskMentor}
          className="px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <MessageSquare size={15} />
          Ask Mentor
        </button>
      </div>
    </div>
  );
}
