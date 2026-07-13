import { useState } from "react";

export default function RevisionViewer({ data }) {

    console.log("REVISION DATA");
    console.log(data);

    const revision = data?.revision || {};
    const [copied, setCopied] = useState(false);

    if (!revision.summary && !revision.key_points) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No revision notes available. Please try again.
            </div>
        );
    }

    function copyToClipboard() {
        const text = `
Concept Summary:
${revision.summary}

Key Points:
${revision.key_points?.map((pt) => `- ${pt}`).join("\n")}

Rules/Formulas:
${revision.formulas_or_rules?.map((r) => `- ${r}`).join("\n")}
        `.strip();
        
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Revision Notes
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="text-xs text-gray-500 hover:text-emerald-600 border border-gray-200 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition"
                    >
                        {copied ? "Copied! ✓" : "Copy Notes 📋"}
                    </button>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 mb-6">
                    <h4 className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase mb-2">
                        Summary
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {revision.summary}
                    </p>
                </div>

                {/* Key Points */}
                {revision.key_points?.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
                            Key Bullet Points
                        </h4>
                        <ul className="space-y-3">
                            {revision.key_points.map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                                    <span className="text-emerald-500 font-bold select-none">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Formulas or Rules */}
                {revision.formulas_or_rules?.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
                            Formulas & Rules
                        </h4>
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
                            {revision.formulas_or_rules.map((rule, idx) => (
                                <p key={idx} className="text-sm text-gray-700 font-mono flex gap-2">
                                    <span className="text-amber-500">⚙</span>
                                    <span>{rule}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                💡 Review these notes regularly to reinforce your memory retention.
            </div>
        </div>
    );
}
