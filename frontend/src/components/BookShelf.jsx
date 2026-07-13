import React from "react";
import BookItem from "./BookItem";

export default function BookShelf({ documents, selectedDocId, onSelectBook, pathsByDocId }) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>📚</span> Your Library
        </h2>
        <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2.5 py-1 rounded-full">
          {documents.length} {documents.length === 1 ? "Book" : "Books"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {documents.map((doc) => (
          <BookItem
            key={doc.id}
            doc={doc}
            isSelected={selectedDocId === doc.id}
            onClick={() => onSelectBook(doc)}
            learningPath={pathsByDocId[doc.id]}
          />
        ))}

        {documents.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
            <p className="text-sm font-medium">No books uploaded yet.</p>
            <p className="text-xs mt-1">
              Go to the <span className="font-semibold text-blue-600">Documents</span> page to upload your first PDF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
