import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';


const App = () => {
    return (
        <Router>
            <div>
                <nav className="bg-blue-600 p-4 text-white">
                    <div className="container mx-auto flex justify-between">
                        <Link to="/" className="text-xl font-bold">Competitive Programming Dashboard</Link>
                        <div className="space-x-4">
                            <Link to="/" className="hover:underline">Home</Link>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
