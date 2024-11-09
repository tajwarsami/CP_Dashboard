import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
    const images = ["/images/cd1.jpg", "/images/cd2.png", "/images/cd3.jpg"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/send-message', formData);
            if (response.data.success) {
                setResponseMessage("Message sent successfully!");
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setResponseMessage("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-teal-900 text-white py-10 px-4">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="text-lg leading-relaxed">
                    Contest Tracker is designed to help competitive programmers stay updated with the latest contests from various platforms. Our mission is to provide a comprehensive and user-friendly platform for tracking contests and accessing valuable resources to improve your programming skills.
                </p>
            </div>
            <div className="max-w-lg mx-auto mb-12">
                <img
                    src={images[currentImageIndex]}
                    alt={`Slide ${currentImageIndex + 1}`}
                    className="w-full h-72 object-cover rounded-lg shadow-md transition-opacity duration-1000"
                />
            </div>
            <div className="max-w-2xl mx-auto bg-teal-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Message Us</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border border-gray-300 text-gray-800"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border border-gray-300 text-gray-800"
                            placeholder="Your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
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
                {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>}
            </div>
        </div>
    );
};

export default About;
