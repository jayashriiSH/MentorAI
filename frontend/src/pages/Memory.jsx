import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
    getMemory,
    getLearningPath,
    generateLearningPath,
    updateLearningPath
} from "../services/api";
import { Brain, Award, AlertCircle, Bookmark, Compass, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Memory() {
    const { user } = useAuth();
    const [memoryData, setMemoryData] = useState(null);
    const [pathData, setPathData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user]);

    async function fetchData() {
        setLoading(true);
        try {
            const [memRes, pathRes] = await Promise.all([
                getMemory(user.id).catch(() => null),
                getLearningPath(user.id).catch(() => null)
            ]);

            if (memRes?.success) setMemoryData(memRes.memory);
            if (pathRes?.success) setPathData(pathRes.path);
        } catch (err) {
            console.error("Error fetching student profile:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleGeneratePath() {
        setActionLoading(true);
        try {
            const res = await generateLearningPath(user.id);
            if (res.success) {
                setPathData(res.path);
            } else {
                alert("Failed to generate path: " + res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error generating learning path.");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCompleteTopic() {
        if (!pathData || !pathData.current_topic) return;
        setActionLoading(true);

        const completed = [...(pathData.completed || []), pathData.current_topic];
        const roadmap = pathData.roadmap || [];

        // Find next current and next topics
        const remaining = roadmap.filter((t) => !completed.includes(t));
        const nextCurrent = remaining[0] || "";
        const nextNext = remaining[1] || "";

        try {
            const res = await updateLearningPath(user.id, completed, nextCurrent, nextNext, roadmap);
            if (res.success) {
                setPathData({
                    ...pathData,
                    completed,
                    current_topic: nextCurrent,
                    next_topic: nextNext
                });
            } else {
                alert("Failed to update learning path: " + res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error updating learning path progress.");
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-140px)]">
                <h1 className="text-3xl font-bold mb-1">Learning Memory & Path</h1>
                <p className="text-gray-500 mb-6">Track your long-term memory updates and customized document roadmap.</p>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                        <span>Loading learning profile…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden flex-1 min-h-0">
                        {/* LEFT: Student Profile / Memory */}
                        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
                            {/* Summary Card */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-blue-600 mb-4">
                                    <Brain size={20} />
                                    <h2 className="font-extrabold text-lg text-gray-800">Student Profile</h2>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {memoryData?.summary || "No profile summary yet. Chat with MentorAI to build your profile!"}
                                </p>
                            </div>

                            {/* Strengths & Weak Topics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-green-600 mb-3">
                                        <Award size={18} />
                                        <h3 className="font-bold text-sm text-gray-800">Strengths</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                                        {memoryData?.strengths || "Strengths will be identified as you learn."}
                                    </p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-red-600 mb-3">
                                        <AlertCircle size={18} />
                                        <h3 className="font-bold text-sm text-gray-800">Weak Topics</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                                        {memoryData?.weak_topics || "Struggles or review areas will appear here."}
                                    </p>
                                </div>
                            </div>

                            {/* Learning Style */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 text-purple-600 mb-2">
                                    <Bookmark size={18} />
                                    <h3 className="font-bold text-sm text-gray-800">Learning Style</h3>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    Deduction: <span className="font-bold text-purple-700">{memoryData?.learning_style || "Undetermined"}</span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Learning Path Progress */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between overflow-y-auto">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <Compass size={20} />
                                        <h2 className="font-extrabold text-lg text-gray-800">Custom Learning Path</h2>
                                    </div>
                                    <button
                                        onClick={handleGeneratePath}
                                        disabled={actionLoading}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition disabled:opacity-40"
                                    >
                                        <RefreshCw size={12} className={actionLoading ? "animate-spin" : ""} />
                                        Regenerate Roadmap
                                    </button>
                                </div>

                                {!pathData || !pathData.roadmap?.length ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 gap-2">
                                        <p className="text-sm">No custom roadmap generated yet.</p>
                                        <p className="text-xs max-w-[280px] leading-relaxed">
                                            We generate a learning roadmap by inspecting your uploaded document library!
                                        </p>
                                        <button
                                            onClick={handleGeneratePath}
                                            disabled={actionLoading}
                                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                                        >
                                            Generate Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Current Focus Panel */}
                                        {pathData.current_topic && (
                                            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex justify-between items-center gap-4">
                                                <div>
                                                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                                                        Active Topic
                                                    </span>
                                                    <h3 className="text-base font-extrabold text-indigo-950 mt-0.5">
                                                        {pathData.current_topic}
                                                    </h3>
                                                    {pathData.next_topic && (
                                                        <p className="text-xs text-indigo-600 mt-1">
                                                            Up next: <span className="font-semibold">{pathData.next_topic}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleCompleteTopic}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                                                >
                                                    <CheckCircle2 size={13} />
                                                    Complete
                                                </button>
                                            </div>
                                        )}

                                        {/* Full Roadmap Steps */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">
                                                Curriculum Roadmap
                                            </h4>
                                            <div className="relative border-l border-gray-100 pl-6 ml-3 space-y-6">
                                                {pathData.roadmap.map((topic, index) => {
                                                    const isCompleted = pathData.completed?.includes(topic);
                                                    const isActive = pathData.current_topic === topic;

                                                    let dotStyle = "bg-gray-200 border-gray-300";
                                                    let textStyle = "text-gray-500 font-medium";

                                                    if (isCompleted) {
                                                        dotStyle = "bg-green-500 border-green-200 ring-4 ring-green-50";
                                                        textStyle = "text-gray-400 line-through decoration-gray-300";
                                                    } else if (isActive) {
                                                        dotStyle = "bg-indigo-600 border-indigo-200 ring-4 ring-indigo-50 animate-pulse";
                                                        textStyle = "text-indigo-900 font-bold";
                                                    }

                                                    return (
                                                        <div key={index} className="relative flex items-center">
                                                            {/* Step indicator dot */}
                                                            <div className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[8px] text-white ${dotStyle}`}>
                                                                {isCompleted && "✓"}
                                                            </div>
                                                            <span className={`text-sm ${textStyle}`}>{topic}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}