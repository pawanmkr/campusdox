import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DocumentList from '../components/DocumentList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import { Document } from '../components/DocumentDetail';

const ITEMS_PER_PAGE = 20;

const SearchResultsPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();

    const searchQuery = new URLSearchParams(location.search).get('query') || '';
    const page = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const endpoint = searchQuery
                    ? `/documents/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=${ITEMS_PER_PAGE}`
                    : `/documents?page=${page}&limit=${ITEMS_PER_PAGE}`;
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);

                setDocuments(response.data);
                setTotalPages(10);
                setCurrentPage(page);
            } catch (err) {
                setError('Failed to fetch documents. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [searchQuery, page]);

    const handleSearch = (query: string) => {
        navigate(`/results?query=${encodeURIComponent(query)}`);
    };

    const handlePageChange = (newPage: number) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', newPage.toString());
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 pb-8">
            <div className='flex justify-between mb-8 items-center bg-[#F3F4F6] sticky top-0 py-4 border-b-2 w-full'>
                {searchQuery ? (
                    <div>
                        <p className='text-xs text-gray-500'>Search results for</p>
                        <p className='text-xl'>{searchQuery}</p>
                    </div>
                ) : (
                    <div className='flex space-x-4 items-center'>
                        <Logo />
                        <a
                            className='text-gray-400 cursor-pointer text-lg -mb-1 underline hover:text-blue-800'
                            href='/document/create'
                        >
                            upload
                        </a>
                    </div>
                )}
                <SearchBar onSearch={handleSearch} />
            </div>

            {loading ? (
                <div className='flex place-items-center mt-80'>
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <DocumentList documents={documents} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            {error && <div className="text-center mt-8 text-red-500">{error}</div>}
        </div>
    );
};

export default SearchResultsPage;