import { useState } from "react";

export default function InterviewViewer({ data }) {
    const questions = data?.interview || [];
    const [openIdx, setOpenIdx] = useState(null);

    if (questions.length === 0) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No interview questions generated. Please try again.
            </div>
        );
    }

    function toggleQuestion(idx) {
        setOpenIdx(openIdx === idx ? null : idx);
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Interview Prep
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                        {questions.length} Questions
                    </span>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className={`border rounded-2xl overflow-hidden bg-white transition duration-300 ${
                                    isOpen ? "border-amber-400 shadow-sm" : "border-gray-200"
                                }`}
                            >
                                <button
                                    onClick={() => toggleQuestion(idx)}
                                    className="w-full text-left px-5 py-4 font-bold text-sm text-gray-800 hover:bg-gray-50 flex items-center justify-between gap-4 transition"
                                >
                                    <span>Q{idx + 1}: {item.question}</span>
                                    <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/40 space-y-4">
                                        {/* What Interviewer Looks For */}
                                        <div className="p-3 bg-amber-50/60 border border-amber-100/50 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
                                            💡 <span className="font-semibold text-amber-950">Interviewer Expectations:</span>{" "}
                                            {item.what_interviewer_looks_for}
                                        </div>

                                        {/* Suggested Answer */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                                Suggested Answer
                                            </h4>
                                            <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                                                {item.suggested_answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                🎯 Practice answering these questions aloud to boost your confidence.
            </div>
        </div>
    );
}
