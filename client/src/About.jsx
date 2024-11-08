import React, { useState, useEffect } from 'react';

const About = () => {
    const images = [
        "/images/cd1.jpg",  // Image 1 URL
        "/images/cd2.png",  // Image 2 URL
        "/images/cd3.jpg"   // Image 3 URL
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Set up a timer to change the image every 3 seconds
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // 3 seconds interval

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="min-h-screen bg-teal-900 text-white py-10 px-4">
            {/* About Us Section */}
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="text-lg leading-relaxed">
                    Contest Tracker is designed to help competitive programmers stay updated with the latest contests from various platforms. Our mission is to provide a comprehensive and user-friendly platform for tracking contests and accessing valuable resources to improve your programming skills.
                </p>
            </div>

            {/* Image Carousel */}
            <div className="max-w-lg mx-auto mb-12">
                <img 
                    src={images[currentImageIndex]} 
                    alt={`Slide ${currentImageIndex + 1}`} 
                    className="w-full h-72 object-cover rounded-lg shadow-md transition-opacity duration-1000"
                />
            </div>

            {/* Message Us Section */}
            <div className="max-w-2xl mx-auto bg-teal-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Message Us</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="w-full p-2 rounded border border-gray-300 text-gray-800"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="w-full p-2 rounded border border-gray-300 text-gray-800"
                            placeholder="Your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                        <textarea 
                            id="message" 
                            className="w-full p-2 rounded border border-gray-300 text-gray-800" 
                            rows="4" 
                            placeholder="Your message"
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default About;
