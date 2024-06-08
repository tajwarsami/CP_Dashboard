import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', { username, password });
            setMessage('User registered successfully');
        } catch (error) {
            setMessage(error.response.data.msg || 'Error registering user');
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Sign Up</button>
                {message && <p className="mt-4 text-red-600">{message}</p>}
            </form>
        </div>
    );
};

export default SignUp;