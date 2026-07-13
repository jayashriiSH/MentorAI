import QuizViewer from "./QuizViewer";
import FlashcardsViewer from "./FlashcardsViewer";
import RevisionViewer from "./RevisionViewer";
import ExerciseViewer from "./ExerciseViewer";
import InterviewViewer from "./InterviewViewer";
import AnalogyViewer from "./AnalogyViewer";
import ExamplesViewer from "./ExamplesViewer";
import { Sparkles } from "lucide-react";

export default function LearningWorkspace({ content }) {
    if (!content) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6 bg-white">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                    <Sparkles size={20} />
                </div>
                <h4 className="text-sm font-semibold text-gray-700">Workspace Inactive</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                    Click any tool in the 📦 Learning Toolbox below an AI answer to activate the workspace!
                </p>
            </div>
        );
    }

    const type = content?.type;

const data =
    content?.data?.data ??
    content?.data ??
    {};

    // Check if generation failed
    if (data?.success === false) {
        return (
            <div className="p-6 flex flex-col items-center justify-center text-center h-full bg-white">
                <div className="text-3xl mb-3">⚠️</div>
                <h4 className="text-sm font-semibold text-red-600">Generation Failed</h4>
                <p className="text-xs text-gray-500 mt-2 max-w-[240px] leading-relaxed">
                    {data.message || "Something went wrong while generating content. Please try again."}
                </p>
            </div>
        );
    }

    // Return the specific tool view
    switch (type) {
        case "quiz":
            return <QuizViewer data={data} />;
        case "flashcards":
            return <FlashcardsViewer data={data} />;
        case "revision":
            return <RevisionViewer data={data} />;
        case "exercise":
            return <ExerciseViewer data={data} />;
        case "interview":
            return <InterviewViewer data={data} />;
        case "analogy":
            return <AnalogyViewer data={data} />;
        case "examples":
            return <ExamplesViewer data={data} />;
        default:
            return (
                <div className="p-6 text-gray-500 text-xs bg-white h-full">
                    <h3 className="font-bold text-sm text-gray-700 mb-2">Unknown Tool Type: {type}</h3>
                    <pre className="overflow-auto max-h-[300px] border p-2 bg-gray-50 rounded-lg">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            );
    }
}
