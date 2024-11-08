

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <Router>
            <div>
                <nav className="bg-teal-950 p-4 text-white">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="text-xl font-bold">Contest Tracker</Link>
                        <div className="lg:hidden">
                           
                            <button onClick={toggleMenu} aria-label="Toggle menu">
                                {isMenuOpen ? <FiX size={24} className="text-white" /> : <FiMenu size={24} className="text-white" />}
                            </button>
                        </div>
                      
                        <div className={`lg:flex lg:items-center lg:space-x-6 ${isMenuOpen ? 'flex flex-col items-center mt-4 space-y-4 lg:space-y-0' : 'hidden'}`}>
                            <Link to="/" className="hover:underline py-1 lg:py-0">Home</Link>
                            <Link to="/contests" className="hover:underline py-1 lg:py-0">Contests</Link>
                            <Link to="/resources" className="hover:underline py-1 lg:py-0">Resources</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="hover:underline py-1 lg:py-0">Dashboard</Link>
                                    <Link to="/profile" className="hover:underline py-1 lg:py-0">Profile</Link>
                                    <button onClick={handleLogout} className="hover:underline py-1 lg:py-0">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signup" className="hover:underline py-1 lg:py-0">Sign Up</Link>
                                    <Link to="/login" className="hover:underline py-1 lg:py-0">Login</Link>
                                </>
                            )}
                            <Link to="/about" className="hover:underline py-1 lg:py-0">About</Link>
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
