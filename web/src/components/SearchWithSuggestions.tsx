import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Document } from './DocumentDetail';
import debounce from 'lodash.debounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchWithSuggestions: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Document[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (query.trim() !== '') {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents/search?query=${encodeURIComponent(query)}&limit=5`);
            setSuggestions(response.data);
            setSelectedSuggestionIndex(-1); // Reset selected suggestion index
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300); // Debounce time in milliseconds

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
        setSuggestions([]); // Clear suggestions after search
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedFetchSuggestions();
    };

    const handleSuggestionClick = (suggestion: Document) => {
        setQuery(suggestion.title); // Set suggestion title as query
        onSearch(suggestion.title); // Trigger search with suggestion title
        setSuggestions([]); // Clear suggestions after clicking
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedSuggestionIndex < suggestions.length - 1) {
                setSelectedSuggestionIndex((prevIndex) => prevIndex + 1);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedSuggestionIndex > 0) {
                setSelectedSuggestionIndex((prevIndex) => prevIndex - 1);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex !== -1) {
                handleSuggestionClick(suggestions[selectedSuggestionIndex]);
            }
        }
    };

    useEffect(() => {
        // Focus input when suggestions change to enable keyboard navigation
        if (suggestions.length > 0 && selectedSuggestionIndex === -1 && inputRef.current) {
            inputRef.current.focus();
        }
    }, [suggestions, selectedSuggestionIndex]);

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="flex items-center border-b-2 border-red-600 py-2 relative">
                <input
                    ref={inputRef}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Search documents..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-sm text-white py-1 px-2 rounded"
                    type="submit"
                >
                    Search
                </button>
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white w-full mt-1 border border-gray-200 rounded-lg shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                                }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.title}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchWithSuggestions;