import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaGithub, FaTwitter, FaInstagram, FaEdit, FaLink } from 'react-icons/fa';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex justify-center bg-teal-900 py-10">
            <div className="w-4/5 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                
                {/* Left Upper - Profile Picture, Follow & Message */}
                <div className="bg-teal-300 p-4 rounded-lg shadow-md flex flex-col items-center text-black">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="w-32 h-32 rounded-full shadow-md mb-4"
                    />
                    <h2 className="text-2xl font-semibold mb-4">{user.username || 'John Doe'}</h2>
                    <div className="flex space-x-4 mb-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Follow</button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded">Message</button>
                    </div>
                </div>

                {/* Right Upper - User Details */}
                <div className="bg-teal-300 p-4 rounded-lg shadow-md text-black">
                    <h3 className="text-xl font-semibold mb-4">User Details</h3>
                    <div className="space-y-2">
                        <p><strong>Full Name:</strong> {user.fullname || 'Not provided'}</p>
                        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                        <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
                        <p><strong>Nickname:</strong> {user.nickname || 'Not provided'}</p>
                    </div>
                    <div className="mt-4 text-center">
                        <a href="/edit-profile" className="text-blue-600 hover:underline flex items-center justify-center">
                            <FaEdit className="mr-2" /> Edit Profile
                        </a>
                    </div>
                </div>

                {/* Left Lower - Social Media Links */}
                <div className="bg-teal-300 p-4 rounded-lg shadow-md text-black">
                    <h3 className="text-lg font-semibold mb-4 text-center">Social Links</h3>
                    <div className="space-y-2">
                        <a href="https://www.website.com" className="flex items-center text-blue-600 hover:underline">
                            <FaLink className="mr-2" /> Website
                        </a>
                        <a href="https://github.com/" className="flex items-center text-gray-800 hover:underline">
                            <FaGithub className="mr-2" /> GitHub
                        </a>
                        <a href="https://twitter.com/" className="flex items-center text-blue-400 hover:underline">
                            <FaTwitter className="mr-2" /> Twitter
                        </a>
                        <a href="https://instagram.com/" className="flex items-center text-pink-500 hover:underline">
                            <FaInstagram className="mr-2" /> Instagram
                        </a>
                        <a href="https://facebook.com/" className="flex items-center text-blue-700 hover:underline">
                            <FaFacebook className="mr-2" /> Facebook
                        </a>
                    </div>
                </div>

                {/* Right Lower - Project Status */}
                <div className="bg-teal-300 p-4 rounded-lg shadow-md text-black">
                    <h4 className="text-lg font-semibold mb-4">Project Status</h4>
                    <div className="space-y-2">
                        {['Web Design', 'Website Markup', 'One Page', 'Mobile Template', 'Backend API'].map((project, index) => (
                            <div key={index}>
                                <p>{project}</p>
                                <div className="w-full bg-gray-300 rounded h-2.5 mb-2">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded"
                                        style={{ width: `${(index + 1) * 20}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
