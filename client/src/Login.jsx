import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogIn = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const { username, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            setMessage('Please enter both username and password.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            setErrors(error.response.data.msg);
            setMessage(error.response?.data?.msg || 'Error signing in');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900">
            <div className="max-w-md w-full bg-teal-200 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors && <div className="text-red-500 mb-4">{errors}</div>}
                    <div>
                        <label className="block text-gray-700 font-bold" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            className=" mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Sign In
                        </button>
                    </div>
                    {message && <p className="mt-2 text-center text-red-600">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default LogIn;
