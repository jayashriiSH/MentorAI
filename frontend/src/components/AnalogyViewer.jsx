export default function AnalogyViewer({ data }) {
    const analogy = data?.analogy || {};

    if (!analogy.analogy_scenario) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No analogy notes available. Please try again.
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Real-world Analogy
                    </span>
                </div>

                {/* Concept Banner */}
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100/60 mb-6 text-center">
                    <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Concept</span>
                    <h3 className="text-base font-extrabold text-purple-950 mt-1">{analogy.concept}</h3>
                </div>

                {/* Analogy Scenario */}
                <div className="mb-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl relative shadow-sm">
                    <div className="text-3xl text-slate-300 font-serif absolute -top-3 left-4 select-none bg-slate-50 px-2 leading-none">“</div>
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Scenario</h4>
                    <p className="text-sm text-gray-700 italic leading-relaxed font-medium">
                        {analogy.analogy_scenario}
                    </p>
                </div>

                {/* Explanation */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">How it maps back</h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {analogy.explanation}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                🌈 Everyday visual analogies help your brain encode memory pathways faster.
            </div>
        </div>
    );
}
