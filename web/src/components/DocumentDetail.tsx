import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

export interface Document {
    id: number;
    title: string;
    description: string;
    downloads: number;
    views: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        username: string;
        fullName: string;
    };
    files: Array<{
        id: number;
        originalName: string;
        downloads: number;
        views: number;
        bucket: string;
        key: string;
    }>;
}

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [doc, setDoc] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents/${id}`);
                setDoc(response.data);
            } catch (err) {
                setError('Failed to fetch document. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleDownload = async (documentId: number) => {
        setDownloadingId(documentId);
        setError(null);

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${documentId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(`Failed to download document ${documentId}. Please try again.`);
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!doc) return <div>Document not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="text-blue-500 hover:underline mb-4 block">&larr; Back to Documents</Link>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-3xl font-bold text-red-500 mb-4">{doc.title}</h1>
                <p className="text-gray-600 mb-4">{doc.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>By: {doc.user.fullName}</span>
                    <span>Views: {doc.views}</span>
                    <span>Downloads: {doc.downloads}</span>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Files:</h2>
                    <ul>
                        {doc.files.map((file) => (
                            <li key={file.id} className="mb-2">
                                {file.originalName} (Downloads: {file.downloads}, Views: {file.views})
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => handleDownload(doc.id)}
                    disabled={downloadingId === doc.id}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    {downloadingId === doc.id ? 'Downloading...' : 'Download Document'}
                </button>
            </div>
        </div>
    );
};

export default DocumentDetail;