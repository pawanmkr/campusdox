import React, { useState, useRef } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="flex items-center border border-gray-400 py-2 relative rounded pr-2">
                <input
                    ref={inputRef}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Search documents..."
                    value={query}
                    onChange={handleInputChange}
                />
                <button
                    className="flex-shrink-0 bg-black text-white hover:bg-gray-300 hover:text-black transition-colors text-sm py-1 px-2 rounded"
                    type="submit"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;