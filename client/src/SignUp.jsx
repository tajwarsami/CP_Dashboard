import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            setMessage('Please enter both username and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/signup', { username, password });
            setMessage('User registered successfully');
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Error registering user');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900">
            <div className="max-w-md w-full bg-teal-200 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign Up
                    </button>
                    {message && <p className="mt-2 text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignUp;
