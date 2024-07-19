import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import SignInModal from '../components/SignInModal';

const CreateDocument: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        token ? setLoggedIn(true) : setLoggedIn(false);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        files.forEach((file) => formData.append('files', file));

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(`Failed to create document: ${err.response.statusText}`);
            } else {
                setError('Failed to create document. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container w-full h-[100vh] flex place-items-center">
            {loggedIn ? (
                <div className="mx-auto px-8 py-8 shadow rounded-lg bg-white">
                    <h1 className="text-3xl font-bold mb-4">Upload New Document</h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="bg-gray-200 px-4 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-gray-200 px-4 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                                Files
                            </label>
                            <input
                                type="file"
                                id="files"
                                onChange={handleFileChange}
                                multiple
                                required
                                className="mt-1 block w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Creating...</span>
                                </>
                            ) : (
                                'Create Document'
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <SignInModal goBack={() => {
                    history.back();
                }} />
            )}
        </div>
    );
};

export default CreateDocument;