import { useState } from "react";

export default function FlashcardsViewer({ data }) {
    const cards = data?.flashcards || [];
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCount, setMasteredCount] = useState(0);
    const [masteredList, setMasteredList] = useState([]);

    if (cards.length === 0) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No flashcards generated. Please try again.
            </div>
        );
    }

    const currentCard = cards[currentIdx];
    const isMastered = masteredList.includes(currentIdx);

    function nextCard() {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIdx((idx) => (idx + 1) % cards.length);
        }, 150);
    }

    function prevCard() {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIdx((idx) => (idx - 1 + cards.length) % cards.length);
        }, 150);
    }

    function toggleMastered() {
        if (isMastered) {
            setMasteredList((prev) => prev.filter((i) => i !== currentIdx));
            setMasteredCount((c) => Math.max(0, c - 1));
        } else {
            setMasteredList((prev) => [...prev, currentIdx]);
            setMasteredCount((c) => c + 1);
        }
    }

    // Styles for 3D flip card
    const containerStyle = {
        perspective: "1000px",
        height: "280px",
    };

    const innerCardStyle = {
        position: "relative",
        width: "100%",
        height: "100%",
        textAlign: "center",
        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    };

    const cardSideBase = {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1.25rem",
        border: "1px solid #e2e8f0",
        padding: "2rem",
    };

    const frontStyle = {
        ...cardSideBase,
        backgroundColor: "#ffffff",
        color: "#1e293b",
    };

    const backStyle = {
        ...cardSideBase,
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        transform: "rotateY(180deg)",
    };

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Flashcards
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                        Card {currentIdx + 1} of {cards.length}
                    </span>
                </div>

                {/* Score / Progress */}
                <div className="flex justify-between items-center mb-6 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span>Mastered: {masteredCount} / {cards.length}</span>
                    <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(masteredCount / cards.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Flippable Card Container */}
                <div style={containerStyle} onClick={() => setIsFlipped(!isFlipped)}>
                    <div style={innerCardStyle}>
                        {/* Front Side */}
                        <div style={frontStyle} className="shadow-sm hover:shadow-md transition">
                            <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-4">
                                QUESTION
                            </span>
                            <p className="text-base font-bold text-gray-800 leading-relaxed text-center">
                                {currentCard.front}
                            </p>
                            <span className="text-xs text-blue-500 mt-6 font-medium animate-pulse">
                                Click to Flip 🔄
                            </span>
                        </div>

                        {/* Back Side */}
                        <div style={backStyle} className="shadow-md">
                            <span className="text-[10px] text-indigo-500 font-semibold tracking-widest uppercase mb-4">
                                ANSWER
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed text-center font-medium overflow-y-auto max-h-[140px]">
                                {currentCard.back}
                            </p>
                            <span className="text-xs text-gray-400 mt-6">
                                Click to Flip 🔄
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 pt-4 border-t border-gray-100 shrink-0">
                <div className="flex gap-3 justify-between items-center">
                    <button
                        onClick={prevCard}
                        className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-600 transition"
                    >
                        ← Prev
                    </button>

                    <button
                        onClick={toggleMastered}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border ${
                            isMastered
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {isMastered ? "★ Mastered" : "☆ Mark Mastered"}
                    </button>

                    <button
                        onClick={nextCard}
                        className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-600 transition"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}
