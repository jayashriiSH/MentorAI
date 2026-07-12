import { FileText } from "lucide-react";

export default function SourceList({ sources, onSelect }) {
    if (!sources?.length) return null;

    return (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Sources
            </span>
            <div className="flex flex-wrap gap-2">
                {sources.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect?.(s)}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                        <FileText size={13} />
                        {s.source}
                        {s.page && <span className="text-blue-400">· p.{s.page}</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}