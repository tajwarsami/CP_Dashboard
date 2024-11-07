import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaGithub, FaLinkedin, FaEdit } from 'react-icons/fa';

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
        <div
        className="min-h-screen flex items-end justify-center"
        style={{
          backgroundColor: '#000000',
          backgroundImage: 'linear-gradient(315deg, #000000 0%, #5e5368 74%)',
          position: 'relative'
        }}
      >
        <div
          className="shadow-md rounded-lg flex w-full"
          style={{
            height: '75vh', // Adjust the height to 75% of the viewport height
            backgroundColor: '#e2e8f0', // Change the background color of the box
            position: 'relative'
          }}
        >
          {/* Left Side - Profile Picture and Social Media Links */}
          <div className="bg-black p-6 flex flex-col items-center w-1/2 relative">
            <div
              className=" shadow-md mb-4"
              style={{
                marginTop: '-150px', // Move it up to overlap the outer div
                zIndex: 10 // Ensure the image is on top
              }}
            >
              <img
                src="https://via.placeholder.com/300"
                alt="Profile"
                className="w-300 h-300 object-cover"
                style={{
                  width: '300px', // Increase the width
                  height: '250px', // Increase the height
                }}
              />
            </div>
            <p className="text-gray-200 mb-10 mt-4">
              <strong>Username: </strong>
              {user.username}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="text-white hover:text-blue-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://github.com/" className="text-white hover:text-gray-300">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/" className="text-white hover:text-blue-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
      
          {/* Right Side - User Details and Edit Profile Link */}
          <div className="bg-red-300 p-6 w-1/2">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Profile</h1>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Full Name:</strong> {user.fullname || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {user.address || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <strong>Education:</strong> {user.education || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <strong>Phone Number:</strong> {user.phone || 'Not provided'}
              </p>
            </div>
            <div className="text-center">
              <a href="/edit-profile" className="text-gray-600 hover:underline flex items-center justify-center">
                <FaEdit className="mr-2" /> Edit Profile
              </a>
            </div>
          </div>
        </div>
      </div>
      

    );
};

export default Profile;
