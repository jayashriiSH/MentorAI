import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, FileText, AlertTriangle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DOCS_BASE_URL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/documents`
    : "/documents";

export default function PdfViewer({ filename, pageNumber = 1, highlightText, onPageChange }) {
    const [numPages, setNumPages] = useState(null);
    const [page, setPage] = useState(pageNumber);
    const [fileExists, setFileExists] = useState(null);

    useEffect(() => {
        setPage(pageNumber);
    }, [pageNumber, filename]);

   useEffect(() => {
    if (!filename) return;

    const url = `${DOCS_BASE_URL}/${encodeURIComponent(filename)}`;

    console.log("Loading PDF:", url);

    setFileExists(null);

    fetch(url, { method: "HEAD" })
        .then((res) => {
            console.log("Status:", res.status);
            console.log("Content-Type:", res.headers.get("content-type"));
            setFileExists(res.ok);
        })
        .catch((err) => {
            console.error(err);
            setFileExists(false);
        });

}, [filename]);

    if (!filename) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <FileText size={28} className="text-gray-300" />
                Select a document to preview it here.
            </div>
        );
    }

    if (fileExists === null) {
        return <div className="h-full flex items-center justify-center text-sm text-gray-400">Checking file…</div>;
    }

    if (fileExists === false) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-sm text-gray-500 gap-2 px-6">
                <AlertTriangle size={24} className="text-amber-400" />
                Couldn't find <span className="font-medium">{filename}</span> on the server.
            </div>
        );
    }

    const fileUrl = `${DOCS_BASE_URL}/${encodeURIComponent(filename)}`;

    function goTo(next) {
        const clamped = Math.min(Math.max(next, 1), numPages || 1);
        setPage(clamped);
        onPageChange?.(clamped);
    }

    function customTextRenderer({ str }) {
        if (!highlightText) return str;
        const needle = highlightText.trim();
        if (!needle || !str.toLowerCase().includes(needle.toLowerCase().slice(0, 40))) return str;
        const idx = str.toLowerCase().indexOf(needle.toLowerCase().slice(0, 40));
        if (idx === -1) return str;
        return (
            str.slice(0, idx) +
            `<mark class="pdf-highlight">` +
            str.slice(idx, idx + needle.length) +
            `</mark>` +
            str.slice(idx + needle.length)
        );
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0">
                <span className="text-sm font-medium truncate flex items-center gap-2">
                    <FileText size={15} className="text-gray-400" />
                    {filename}
                </span>
                <div className="flex items-center gap-1">
                    <button onClick={() => goTo(page - 1)} disabled={page <= 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-500 font-mono w-16 text-center">
                        {page} / {numPages || "…"}
                    </span>
                    <button onClick={() => goTo(page + 1)} disabled={!numPages || page >= numPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {highlightText && (
                <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 shrink-0">
                    <span className="font-semibold">Highlighted paragraph: </span>
                    "{highlightText.slice(0, 160)}{highlightText.length > 160 ? "…" : ""}"
                </div>
            )}

            <div className="flex-1 overflow-auto bg-gray-100 flex justify-center py-4 min-h-0">
                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<div className="text-sm text-gray-400 py-10">Loading PDF…</div>}
                    error={<div className="text-sm text-red-400 py-10">Couldn't load this PDF.</div>}
                >
                    <Page
                        pageNumber={page}
                        width={380}
                        renderAnnotationLayer={false}
                        customTextRenderer={highlightText ? customTextRenderer : undefined}
                    />
                </Document>
            </div>
        </div>
    );
}