import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import Contests from './Contests';
import ContestDetails from './ContestDetails';
import ResourceList from './ResourceList';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Profile from './Profile';
import About from './About';

import ResourceDetails from './ResourceDetails';
import UserDashboard from './UserDashboard';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                <nav className="bg-teal-950 p-4 text-white">
                    <div className="container mx-auto flex justify-between">
                        <Link to="/" className="text-xl font-bold">Contest Tracker</Link>
                        <div className="space-x-4">
                            <Link to="/" className="hover:underline">Home</Link>
                            <Link to="/contests" className="hover:underline">Contests</Link>
                            <Link to="/resources" className="hover:underline">Resources</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                                    <Link to="/profile" className="hover:underline">Profile</Link>
                                    <button onClick={handleLogout} className="hover:underline">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signup" className="hover:underline">Sign Up</Link>
                                    <Link to="/login" className="hover:underline">Login</Link>
                                </>
                            )}
                            <Link to="/about" className="hover:underline">About</Link>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contests" element={<Contests />} />
                    <Route path="/resources" element={<ResourceList />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
                    <Route path="/contests/:id" element={<ContestDetails />} />
                    <Route path="/resources/:id" element={<ResourceDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;