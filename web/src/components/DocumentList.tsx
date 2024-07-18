import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { Document } from './DocumentDetail';
// import SignInModal from './SignInModal';

interface DocumentListProps {
    documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleDownload = async (documentId: number) => {
        // const userIsSignedIn = false; // Replace with actual sign-in check

        // if (!userIsSignedIn) {
        //     setIsModalOpen(true);
        //     return;
        // }

        setDownloadingId(documentId);
        setError(null);

        try {
            const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}?downloaded=true`);
            if (res.status === 200) {
                const document = documents.filter(d => d.id === documentId);
                document[0].downloads = res.data.downloads;
            }

            const selected = documents.filter(doc => doc.id === documentId);

            for (const file of selected[0].files) {
                const res = await axios.get(`${import.meta.env.VITE_R2_PUBLIC_URL}/${file.key}`, {
                    responseType: 'blob'
                });

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.setAttribute('download', file.originalName);
                link.href = url;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
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
                                        `Download ${doc.files.length} ${doc.files.length > 1 ? 'files' : 'file'}`
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {/* {isModalOpen && <SignInModal goBack={() => setIsModalOpen(false)} />} */}
        </div>
    );
};

export default DocumentList;