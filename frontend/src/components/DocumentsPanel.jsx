import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { getDocuments } from "../services/api"; // GET /documents — adjust name if yours differs

export default function DocumentsPanel({ activeFilename, onSelect }) {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        getDocuments()
            .then((res) => setDocs(res.documents ?? res ?? []))
            .catch(() => setDocs([]));
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 py-2.5 border-b border-gray-100 text-sm font-semibold flex items-center gap-2">
                <FileText size={15} className="text-gray-400" />
                Documents
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {docs.length === 0 && (
                    <p className="text-xs text-gray-400 px-2 py-4">No documents uploaded yet.</p>
                )}
                {docs.map((doc) => {
                    const filename = doc.filename || doc.name || doc;
                    const isActive = filename === activeFilename;
                    return (
                        <button
                            key={filename}
                            onClick={() => onSelect(filename)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 truncate transition ${
                                isActive
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {filename}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}