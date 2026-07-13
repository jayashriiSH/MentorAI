import { useState } from "react";

export default function ExamplesViewer({ data }) {
    const examples = data?.examples || [];
    const [activeIdx, setActiveIdx] = useState(0);

    if (examples.length === 0) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No practical examples generated. Please try again.
            </div>
        );
    }

    const currentExample = examples[activeIdx];

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[calc(100vh-340px)] pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Practical Examples
                    </span>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-100 mb-6 gap-2">
                    {examples.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`pb-2.5 px-3 text-xs font-bold transition ${
                                activeIdx === idx
                                    ? "text-sky-600 border-b-2 border-sky-500"
                                    : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
                            }`}
                        >
                            Example {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Example Content */}
                <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-gray-800">
                        {currentExample.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {currentExample.description}
                    </p>
                    
                    {currentExample.code_or_scenario && (
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                Demo / Scenario
                            </h4>
                            <pre className="font-mono text-[11px] p-4 border border-gray-200 rounded-xl bg-gray-900 text-gray-100 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                                {currentExample.code_or_scenario}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                🚀 Practical implementation grounds theoretical learning.
            </div>
        </div>
    );
}
