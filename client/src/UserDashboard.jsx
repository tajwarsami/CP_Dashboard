import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        upcomingContests: [],
        bookmarkedContests: [],
        recentActivity: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/user/dashboard', {
                    headers: { 'x-auth-token': token }
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const { upcomingContests, bookmarkedContests, recentActivity } = dashboardData;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Upcoming Contests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingContests.map(contest => (
                        <div key={contest.id} className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-bold">
                                <Link to={`/contest/${contest.id}`} className="hover:underline">{contest.event}</Link>
                            </h3>
                            <p className="text-gray-600">Website: {contest.resource_name}</p>
                            <p className="text-gray-600">Start: {new Date(contest.start).toLocaleString()}</p>
                            <p className="text-gray-600">End: {new Date(contest.end).toLocaleString()}</p>
                            <a 
                            href={contest.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline inline-flex items-center mt-4"
                        >
                            Visit Contest Page <FaExternalLinkAlt className="ml-1"/>
                        </a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Bookmarked Contests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedContests.map(contest => (
                        <div key={contest.id} className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-bold">
                                <Link to={`/contest/${contest.id}`} className="hover:underline">{contest.event}</Link>
                            </h3>
                            <p className="text-gray-600">Website: {contest.resource_name}</p>
                            <p className="text-gray-600">Start: {new Date(contest.start).toLocaleString()}</p>
                            <p className="text-gray-600">End: {new Date(contest.end).toLocaleString()}</p>
                            <a 
                            href={contest.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline inline-flex items-center mt-4"
                        >
                            Visit Contest Page <FaExternalLinkAlt className="ml-1"/>
                        </a>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <ul>
                        {recentActivity.map((activity, index) => (
                            <li key={index} className="mb-4">
                                <p className="text-gray-600">{activity.event_type}</p>
                                <p className="text-gray-600">{activity.event_details}</p>
                                <p className="text-gray-600">{new Date(activity.created_at).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

        </div>
    );
};

export default UserDashboard;