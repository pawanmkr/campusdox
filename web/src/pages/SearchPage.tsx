import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Logo from '../components/Logo';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = (searchQuery: string) => {
        navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    };

    const handleExploreAll = () => {
        navigate('/results');
    };

    return (
        <div className='flex flex-col justify-center items-center h-[60vh]'>
            <div className="flex flex-col justify-center items-center scale-125 space-y-8 w-[800px]">
                <Logo />
                <SearchBar onSearch={handleSearch} />
                <button
                    onClick={handleExploreAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Explore All Documents
                </button>
            </div>
        </div>
    );
};

export default SearchPage;