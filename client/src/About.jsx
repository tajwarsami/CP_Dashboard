import React from 'react';

const About = () => {
    return (
        <div className="mx-auto py-10 px-4 min-h-calc-screen"
     style={{
         backgroundColor: '#000000',
         backgroundImage: 'linear-gradient(315deg, #000000 0%, #5e5368 74%)',
     }}>
            <div className='flex flex-col items-center'>
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-lg">
                Contest Tracker is designed to help competitive programmers stay updated with the latest contests from various platforms. Our mission is to provide a comprehensive and user-friendly platform for tracking contests and accessing valuable resources to improve your programming skills.
            </p>
            </div>
        </div>
    );
};

export default About;