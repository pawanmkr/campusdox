import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CreateDocument from './pages/CreateDocument';
import DocumentDetail from './components/DocumentDetail';


const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 w-full">
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/results" element={<SearchResultsPage />} />
                    <Route path="/create" element={<CreateDocument />} />
                    <Route path="/document/:id" element={<DocumentDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;