import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

function CodeBlock({ lang, code }) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="rounded-lg overflow-hidden border border-gray-200 my-3 bg-[#f6f8fa]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                    <Code2 size={14} />
                    {lang || "code"}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-gray-900 transition"
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="p-3 overflow-x-auto text-sm">
                <code className="font-mono text-gray-800 whitespace-pre">{code}</code>
            </pre>
        </div>
    );
}

function parseInline(text, key) {
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    return (
        <span key={key}>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-[0.85em]"
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return part;
            })}
        </span>
    );
}

// Lines that start with an emoji + bold label (💡 **Quick Answer**, 📘 **Explanation**...)
// become their own visually separated section, so answers don't run together.
const SECTION_LINE = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}]?\s*)\*\*(.+?)\*\*\s*(.*)$/u;

export default function MarkdownRenderer({ content }) {

    if (content == null) {
        return null;
    }

    const segments = String(content).split(/```(\w*)\n?([\s\S]*?)```/g);
    const nodes = [];

    for (let i = 0; i < segments.length; i += 3) {
        const text = segments[i];
        const lang = segments[i + 1];
        const code = segments[i + 2];

        if (text && text.trim()) {
            const lines = text.split("\n").filter((l) => l.trim() !== "");

            lines.forEach((line, idx) => {
                const trimmed = line.trim();
                const sectionMatch = trimmed.match(SECTION_LINE);

                if (sectionMatch) {
                    const [, emoji, label, rest] = sectionMatch;
                    nodes.push(
                        <div key={`s-${i}-${idx}`} className={idx === 0 ? "mb-3" : "mt-5 mb-3"}>
                            <p className="flex items-center gap-2 font-semibold text-gray-900 text-[15px]">
                                {emoji && <span className="text-base">{emoji.trim()}</span>}
                                {label}
                            </p>
                            {rest && (
                                <p className="mt-1.5 leading-relaxed text-gray-700">
                                    {parseInline(rest)}
                                </p>
                            )}
                        </div>
                    );
                    return;
                }

                if (/^[-•]\s+/.test(trimmed)) {
                    nodes.push(
                        <div key={`b-${i}-${idx}`} className="flex gap-2 pl-1 mb-1.5">
                            <span className="text-gray-400">•</span>
                            <span className="leading-relaxed text-gray-700">
                                {parseInline(trimmed.replace(/^[-•]\s+/, ""))}
                            </span>
                        </div>
                    );
                    return;
                }

                nodes.push(
                    <p key={`p-${i}-${idx}`} className="mb-2 leading-relaxed text-gray-700">
                        {parseInline(trimmed)}
                    </p>
                );
            });
        }

        if (code !== undefined) {
            nodes.push(<CodeBlock key={`c-${i}`} lang={lang} code={code.replace(/\n$/, "")} />);
        }
    }

    return <div className="text-[15px]">{nodes}</div>;
}