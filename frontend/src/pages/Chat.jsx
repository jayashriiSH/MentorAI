import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { askQuestion } from "../services/api";
import MarkdownRenderer from "../components/MarkdownRenderer";
import SourceList from "../components/SourceList";
import PdfViewer from "../components/PdfViewer";
import { Send, Bot, User, Plus, Trash2 } from "lucide-react";
import {
    createSession,
    getSessions,
    saveMessage,
    getMessages,
    updateSessionTitle,
    deleteSession,
} from "../services/chatService";
import { learningAction } from "../services/api";
import LearningToolbox from "../components/LearningToolbox";

function Chat() {
    const [params] = useSearchParams();
    const selectedDocument = params.get("document");

    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [pdfState, setPdfState] = useState({
        filename: selectedDocument,
        page: 1,
        highlight: null,
    });
    const [learningContent, setLearningContent] = useState(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        async function loadChats() {
            const chats = await getSessions();
            setSessions(chats);

            if (chats.length > 0) {
                setCurrentSession(chats[0]);
                const history = await getMessages(chats[0].id);
                setMessages(
                    history.map((msg) => ({
                        role: msg.role,
                        text: msg.message,
                        sources: msg.sources,
                    }))
                );
            }
        }

        loadChats();
    }, []);

    // If Documents navigates here with ?document=..., keep the PDF panel synced
    useEffect(() => {
        if (selectedDocument) {
            setPdfState({ filename: selectedDocument, page: 1, highlight: null });
        }
    }, [selectedDocument]);

    async function newChat() {
        const session = await createSession("New Chat");
        setSessions((prev) => [session, ...prev]);
        setCurrentSession(session);
        setMessages([]);
    }

    async function openSession(session) {
        setCurrentSession(session);
        const history = await getMessages(session.id);
        setMessages(
            history.map((msg) => ({
                role: msg.role,
                text: msg.message,
                sources: msg.sources,
            }))
        );
    }

    async function removeSession(e, sessionId) {
        e.stopPropagation();
        if (!confirm("Delete this chat?")) return;

        await deleteSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        if (currentSession?.id === sessionId) {
            setCurrentSession(null);
            setMessages([]);
        }
    }

    function openSource(source) {
        setPdfState({
            filename: source.source,
            page: source.page || 1,
            // If your backend returns the retrieved chunk text as
            // source.snippet/source.text, pass it here to highlight it.
            highlight: source.snippet || source.text || null,
        });
    }

    async function sendQuestion() {
        if (!question.trim()) return;

        let session = currentSession;

        if (!session) {
            session = await createSession("New Chat");
            setCurrentSession(session);
            setSessions((prev) => [session, ...prev]);
        }

        const userQuestion = question;

        if (session.title === "New Chat") {
            const title =
                userQuestion.length > 40 ? userQuestion.slice(0, 40) + "..." : userQuestion;

            await updateSessionTitle(session.id, title);
            session.title = title;

            setSessions((prev) =>
                prev.map((chat) => (chat.id === session.id ? { ...chat, title } : chat))
            );
        }

        setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
        await saveMessage(session.id, "user", userQuestion);

        setQuestion("");
        setLoading(true);

        try {
            const response = await askQuestion(userQuestion);

            const aiMessage = {
                role: "assistant",
                question: userQuestion,
                text: response.answer,
                sources: response.sources,
                toolbox: response.toolbox,
            };

            setMessages((prev) => [...prev, aiMessage]);

            await saveMessage(session.id, "assistant", response.answer, response.sources);
        } catch (err) {
            console.error(err);
            alert("Failed to get answer.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-140px)]">
                <h1 className="text-3xl font-bold mb-1">AI Tutor</h1>
                <p className="text-gray-500 mb-6">Ask anything about your uploaded documents.</p>

                <div className="grid grid-cols-[240px_1fr_400px] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex-1 min-h-0">
                    {/* Sessions sidebar */}
                    <div className="border-r border-gray-200 flex flex-col min-h-0">
                        <div className="p-4 border-b border-gray-200 shrink-0">
                            <button
                                onClick={newChat}
                                className="w-full bg-blue-600 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-700 transition"
                            >
                                <Plus size={16} />
                                New Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            {sessions.length === 0 && (
                                <p className="text-xs text-gray-400 px-4 py-4">No chats yet.</p>
                            )}
                            {sessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => openSession(session)}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between gap-2 group transition ${
                                        currentSession?.id === session.id ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <span className="font-medium truncate text-sm text-gray-700">
                                        {session.title}
                                    </span>
                                    <span
                                        onClick={(e) => removeSession(e, session.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition shrink-0"
                                    >
                                        <Trash2 size={14} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="flex flex-col min-w-0 min-h-0 border-r border-gray-200">
                        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 min-h-0">
                            {messages.length === 0 && (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    Ask your first question to get started.
                                </div>
                            )}

                            {messages.map((message, index) => {
                                const isUser = message.role === "user";
                                return (
                                    <div key={index} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                                        <div
                                            className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                                                isUser ? "bg-blue-600 text-white" : "bg-gray-900 text-white"
                                            }`}
                                        >
                                            {isUser ? <User size={15} /> : <Bot size={15} />}
                                        </div>

                                        <div className={`max-w-[78%] ${isUser ? "flex flex-col items-end" : ""}`}>
                                            <span className="text-[11px] font-medium text-gray-400 mb-1 block">
                                                {isUser ? "User" : "MentorAI"}
                                            </span>
                                            <div
                                                className={`px-4 py-3 rounded-2xl ${
                                                    isUser
                                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                                        : "bg-gray-50 border border-gray-200 rounded-tl-sm"
                                                }`}
                                            >
                                                {isUser ? (
                                                    <p className="text-[15px] leading-relaxed">{message.text}</p>
                                                ) : (
                                                    <>
                                                        <MarkdownRenderer content={message.text} />

                                                        <SourceList
                                                            sources={message.sources}
                                                            onSelect={openSource}
                                                        />

                                                        <LearningToolbox
                                                            actions={message.toolbox}
                                                            onClick={async (action) => {
                                                                const result = await learningAction(
                                                                    action.type,
                                                                    message.question,
                                                                    message.text
                                                                );

                                                                setLearningContent(result);
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {loading && (
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 text-white flex items-center justify-center">
                                        <Bot size={15} />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-50 border border-gray-200 text-sm text-gray-400">
                                        Thinking…
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {learningContent && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                                <h2 className="font-bold mb-2">Learning Tool</h2>

                                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                    {JSON.stringify(learningContent, null, 2)}
                                </pre>
                            </div>
                        )}

                        <div className="border-t border-gray-100 p-4 flex gap-3 bg-white shrink-0">
                            <input
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                placeholder="Ask anything..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendQuestion();
                                }}
                            />
                            <button
                                onClick={sendQuestion}
                                disabled={loading || !question.trim()}
                                className="bg-blue-600 text-white px-5 rounded-xl flex items-center gap-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                            >
                                <Send size={16} />
                                Send
                            </button>
                        </div>
                    </div>

                    {/* PDF panel */}
                    <div className="min-h-0">
                        <PdfViewer
                            filename={pdfState.filename}
                            pageNumber={pdfState.page}
                            highlightText={pdfState.highlight}
                            onPageChange={(p) => setPdfState((s) => ({ ...s, page: p }))}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Chat;