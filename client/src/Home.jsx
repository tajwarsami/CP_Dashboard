import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto py-10">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">Welcome to the CP Dashboard</h1>
                <p className="text-lg mb-4">Keep track of all upcoming programming contests.</p>
                <hr className="my-4" />
                <p className="text-md">Click on the Contests tab to see the upcoming contests.</p>
            </div>
        </div>
    );
};

export default Home;
