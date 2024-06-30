import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Contest Tracker</h1>
            <p className="text-lg mb-8 text-center ">
                Your one-stop solution for tracking programming contests from various platforms. Stay updated with the latest contests and resources to enhance your competitive programming skills.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link to="/contests" className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow">
                    <div className="flex flex-col items-center">
                        <img src="/images/contests.png" alt="Contests" className="w-24 h-24 mb-4" />
                        <h2 className="text-2xl font-bold mb-2 ">Contests</h2>
                        <p className="text-gray-600 text-center">Explore upcoming and ongoing programming contests from various platforms.</p>
                    </div>
                </Link>
                <Link to="/resources" className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow">
                    <div className="flex flex-col items-center">
                        <img src="/images/resources.png" alt="Resources" className="w-24 h-24 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Resources</h2>
                        <p className="text-gray-600 text-center">Find valuable resources to help you improve your competitive programming skills.</p>
                    </div>
                </Link>
                <Link to="/about" className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow">
                    <div className="flex flex-col items-center">
                        <img src="/images/about.png" alt="About Us" className="w-24 h-24 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">About Us</h2>
                        <p className="text-gray-600 text-center">Learn more about our mission and the team behind Contest Tracker.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;