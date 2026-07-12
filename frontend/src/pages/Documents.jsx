import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { uploadDocuments } from "../services/api";
import {
    getDocuments,
    deleteDocument,
} from "../services/documentService";
import {
    Upload,
    FileText,
    Trash2,
    Eye,
} from "lucide-react";

function Documents() {

    const [files, setFiles] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {

        const docs = await getDocuments();

        setDocuments(docs);
    }

    async function handleUpload() {

        if (files.length === 0) return;

        setLoading(true);

        try {

            await uploadDocuments(files);

            setFiles([]);

            await loadDocuments();

            alert("Documents uploaded!");

        } catch (err) {

            console.error(err);

            alert("Upload failed.");

        }

        setLoading(false);
    }

    async function handleDelete(id) {

        if (!confirm("Delete this document?")) return;

        await deleteDocument(id);

        await loadDocuments();

    }

    return (

        <Layout>

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        My Documents

                    </h1>

                    <p className="text-gray-500 mt-1">

                        Upload and manage your learning resources.

                    </p>

                </div>

                <div className="flex gap-3">

                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={(e) =>
                            setFiles([...e.target.files])
                        }
                    />

                    <button
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                    >
                        <Upload size={18} />

                        {loading
                            ? "Uploading..."
                            : "Upload"}
                    </button>

                </div>

            </div>

            <div className="grid gap-5">

                {documents.map(doc => (

                    <div
                        key={doc.id}
                        className="bg-white rounded-2xl border p-5 shadow-sm flex justify-between items-center"
                    >

                        <div>

                            <div className="flex items-center gap-3">

                                <FileText
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-lg">

                                    {doc.filename}

                                </h2>

                            </div>

                            <div className="text-gray-500 mt-2 text-sm">

                                {doc.pages} Pages

                                •

                                {doc.chunks} Chunks

                            </div>

                            <div className="text-xs text-gray-400 mt-1">

                                Uploaded

                                {" "}

                                {new Date(
                                    doc.uploaded_at
                                ).toLocaleDateString()}

                            </div>

                        </div>

                        <div className="flex gap-2">

                            <button
                                className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                            >
                                <Eye size={16} />

                                Open

                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(doc.id)
                                }
                                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50"
                            >
                                <Trash2 size={16} />

                                Delete

                            </button>

                        </div>

                    </div>

                ))}

                {documents.length === 0 && (

                    <div className="bg-white border rounded-2xl py-20 text-center text-gray-400">

                        No documents uploaded yet.

                    </div>

                )}

            </div>

        </Layout>

    );

}

export default Documents;