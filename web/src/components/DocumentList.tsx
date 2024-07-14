import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

interface Document {
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
    }>;
}

interface DocumentListProps {
    documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleDownload = async (documentId: number) => {
        setDownloadingId(documentId);
        setError(null);

        try {
            const response = await axios.get(`/documents/${documentId}/download`, {
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

    if (documents.length === 0) {
        return <p className="text-center text-gray-500">No documents found.</p>;
    }

    return (
        <div className="space-y-12">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {documents.map((doc) => (
                <div
                    key={doc.id}
                    onMouseEnter={() => setHoveredId(doc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <h2
                        className="text-xl text-red-700 mb-2 truncate hover:underline"
                        onClick={() => navigate(`/document/${doc.id}`)}
                        style={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                        {doc.title}
                    </h2>
                    <p
                        className="text-gray-600 mb-2"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {doc.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                            <span>By: {doc.user.fullName}</span>
                            <span className='ml-8'>Views: {doc.views}</span>
                            <span className='ml-8'>Downloads: {doc.downloads}</span>
                        </div>
                        {hoveredId === doc.id && (
                            <div>
                                <button
                                    onClick={() => handleDownload(doc.id)}
                                    disabled={downloadingId === doc.id}
                                    className="text-blue-800 rounded transition-colors flex items-center mr-2 hover:underline"
                                >
                                    {downloadingId === doc.id ? (
                                        <>
                                            <LoadingSpinner />
                                            <span className="mr-2">Downloading...</span>
                                        </>
                                    ) : (
                                        'Download'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentList;