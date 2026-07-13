import React, { useState, useEffect } from "react";
import JourneyHeader from "./JourneyHeader";
import JourneyTimeline from "./JourneyTimeline";
import TopicWorkspace from "./TopicWorkspace";
import { Compass, Sparkles } from "lucide-react";

export default function LearningJourney({ doc, learningPath, onUpdateProgress, onGenerateRoadmap, loading }) {
  const [activeTopic, setActiveTopic] = useState(null);

  const topics = learningPath?.roadmap?.topics || [];

  // Automatically select the active current topic on mount/doc switch
  useEffect(() => {
    if (topics.length > 0) {
      const current = topics.find((t) => t.status === "current") || topics.find((t) => !t.completed) || topics[0];
      setActiveTopic(current);
    } else {
      setActiveTopic(null);
    }
  }, [learningPath]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        <span className="text-sm font-semibold text-gray-600">Loading learning path...</span>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Compass size={32} />
        </div>
        <div className="max-w-xs">
          <h3 className="text-base font-bold text-gray-800">Select a textbook</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Choose a textbook from your library shelf on the left to begin or continue your customized learning journey!
          </p>
        </div>
      </div>
    );
  }

  if (!learningPath || topics.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-bold text-gray-800">No learning journey has been generated yet.</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Click the button below to analyze this textbook and generate a customized step-by-step roadmap.
          </p>
        </div>
        <button
          onClick={onGenerateRoadmap}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
        >
          Generate Roadmap
        </button>
      </div>
    );
  }

  const activeTopicProgress = topics.find((t) => t.title === activeTopic?.title) || {};

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <JourneyHeader docName={doc.filename} learningPath={learningPath} />

      {/* Main timeline + workspace split */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left segment: Vertical Timeline */}
        <JourneyTimeline
          topics={topics}
          activeTopicTitle={activeTopic?.title}
          onSelectTopic={(topic) => setActiveTopic(topic)}
        />

        {/* Right segment: Study Workspace */}
        <div className="min-w-0">
          {activeTopic ? (
            <TopicWorkspace
              topic={activeTopic}
              docId={doc.id}
              docFilename={doc.filename}
              progressState={activeTopicProgress}
              onUpdateProgress={onUpdateProgress}
            />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              Select a clickable topic from the timeline to start learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
