import { useState } from "react";

export default function ExerciseViewer({ data }) {
    console.log(data);
    const exercise = data?.exercise || {};
    const [userCode, setUserCode] = useState(exercise.starter_code || "");
    const [showHints, setShowHints] = useState({});
    const [revealSolution, setRevealSolution] = useState(false);

    if (!exercise.problem_description) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No exercise challenge generated. Please try again.
            </div>
        );
    }

    function toggleHint(index) {
        setShowHints((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Coding Challenge
                    </span>
                </div>

                {/* Problem Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Problem Description</h3>
                    <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 text-sm text-gray-700 leading-relaxed font-medium">
                        {exercise.problem_description}
                    </div>
                </div>

                {/* Interactive Sandbox */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Write Your Solution</h3>
                    <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        rows={6}
                        className="w-full font-mono text-xs p-4 border border-gray-200 rounded-xl bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
                        placeholder="# Write your python code here..."
                    />
                </div>

                {/* Hints Accordion */}
                {exercise.hints?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                            Stuck? Need a Hint?
                        </h3>
                        <div className="space-y-2">
                            {exercise.hints.map((hint, idx) => {
                                const isOpen = showHints[idx];
                                return (
                                    <div key={idx} className="border border-gray-100 rounded-lg bg-white overflow-hidden">
                                        <button
                                            onClick={() => toggleHint(idx)}
                                            className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-between transition"
                                        >
                                            <span>Hint {idx + 1}</span>
                                            <span>{isOpen ? "▲" : "▼"}</span>
                                        </button>
                                        {isOpen && (
                                            <div className="px-3 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                                                {hint}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Solution Reveal */}
                <div className="mb-4">
                    <button
                        onClick={() => setRevealSolution(!revealSolution)}
                        className="w-full py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-xs font-semibold text-gray-700 transition bg-white"
                    >
                        {revealSolution ? "Hide Suggested Solution" : "Reveal Suggested Solution"}
                    </button>

                    {revealSolution && (
                        <div className="mt-4 p-4 rounded-xl border border-green-100 bg-green-50/20 space-y-3">
                            <div>
                                <h4 className="text-xs font-bold text-green-800 uppercase mb-1">
                                    Suggested Implementation
                                </h4>
                                <pre className="font-mono text-[11px] bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto text-gray-700 leading-relaxed">
                                    {exercise.solution}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                💪 Try to solve the puzzle yourself before peeking at the solution!
            </div>
        </div>
    );
}
