import { useState } from "react";

export default function QuizViewer({ data, onComplete }) {

    const questions =
    data?.data?.quiz ??
    data?.quiz ??
    [];
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    if (questions.length === 0) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                No quiz questions generated. Please try again.
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];

    function handleOptionClick(option) {
        if (isAnswerChecked) return;
        setSelectedOpt(option);
    }

    function checkAnswer() {
        if (selectedOpt === null) return;
        setIsAnswerChecked(true);
        if (selectedOpt === currentQuestion.answer) {
            setScore((s) => s + 1);
        }
    }

    function nextQuestion() {
        setSelectedOpt(null);
        setIsAnswerChecked(false);
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx((idx) => idx + 1);
        } else {
            setShowResults(true);
            if (onComplete) {
                onComplete();
            }
        }
    }

    function restartQuiz() {
        setCurrentIdx(0);
        setSelectedOpt(null);
        setIsAnswerChecked(false);
        setScore(0);
        setShowResults(false);
    }

    if (showResults) {
        return (

            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-800">Quiz Completed!</h3>
                <p className="text-gray-500 mt-2">
                    You scored <span className="font-semibold text-blue-600">{score}</span> out of{" "}
                    <span className="font-semibold">{questions.length}</span>
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4 max-w-xs">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(score / questions.length) * 100}%` }}
                    />
                </div>
                <button
                    onClick={restartQuiz}
                    className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between">
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Quiz Mode
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                        Question {currentIdx + 1} of {questions.length}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-1 rounded-full mb-6">
                    <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                    />
                </div>

                {/* Question */}
                <h2 className="text-lg font-bold text-gray-800 mb-6 leading-snug">
                    {currentQuestion.question}
                </h2>

                {/* Options List */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedOpt === option;
                        const isCorrect = option === currentQuestion.answer;
                        let optionStyle = "border-gray-200 hover:bg-gray-50 bg-white";

                        if (isAnswerChecked) {
                            if (isCorrect) {
                                optionStyle = "border-green-500 bg-green-50/50 text-green-700 font-medium";
                            } else if (isSelected) {
                                optionStyle = "border-red-500 bg-red-50/50 text-red-700";
                            } else {
                                optionStyle = "border-gray-200 opacity-60 bg-white";
                            }
                        } else if (isSelected) {
                            optionStyle = "border-blue-600 bg-blue-50/40 text-blue-800 ring-2 ring-blue-600/10";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                disabled={isAnswerChecked}
                                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between text-sm ${optionStyle}`}
                            >
                                <span>{option}</span>
                                {isAnswerChecked && isCorrect && (
                                    <span className="text-green-600 text-xs font-semibold">✓ Correct</span>
                                )}
                                {isAnswerChecked && isSelected && !isCorrect && (
                                    <span className="text-red-600 text-xs font-semibold">✗ Wrong</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-gray-100 shrink-0">
                {!isAnswerChecked ? (
                    <button
                        onClick={checkAnswer}
                        disabled={selectedOpt === null}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="w-full bg-gray-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition shadow-sm"
                    >
                        {currentIdx + 1 < questions.length ? "Next Question" : "View Results"}
                    </button>
                )}
            </div>
        </div>
    );
}
