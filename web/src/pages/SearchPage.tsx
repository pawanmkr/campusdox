import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Logo from '../components/Logo';
import SignInBtn from '../components/buttons/Signin';
import ExploreBtn from '../components/buttons/ExploreBtn';
import LogoutBtn from '../components/buttons/LogoutBtn';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const ltoken = localStorage.getItem('token');
        if (ltoken) {
            setLoggedIn(true);
            return;
        }

        const token = new URLSearchParams(location.search).get('token');
        if (token) {
            localStorage.setItem('token', token);
            setLoggedIn(true);
        }
    }, []);

    const handleSearch = (searchQuery: string) => {
        navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className='flex flex-col justify-center items-center h-[60vh]'>
            <div className="flex flex-col justify-center items-center scale-125 space-y-8 w-[800px]">
                <Logo />
                <SearchBar onSearch={handleSearch} />
                <div className='flex space-x-8'>
                    <ExploreBtn />
                    {loggedIn ? <LogoutBtn /> : <SignInBtn />}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;