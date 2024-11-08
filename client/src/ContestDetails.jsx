import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import imageMap from './imageMap';
import axios from 'axios';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ContestDetails = () => {

    const {id} = useParams()
    const [contest, setContest] = useState(null);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const fetchContest = async ()=>{
            try {
                const response = await axios.get(`http://localhost:5000/api/contests/${id}`);
                setContest(response.data);
            } catch (error) {
                console.error('Error fetching contest details:', error);
            }
        }

        fetchContest();
    }, [id]);

    useEffect(() => {
        if(contest){
            const interval = setInterval (()=>{
                const now = new Date().getTime();
                const start = new Date(contest.start).getTime();
                const end = new Date(contest.end).getTime();
                const distance = start - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % ( 1000* 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);

                if(distance < 0){
                    clearInterval(interval);
                    setCountdown('Contest Started');
                }
            }, 1000);

            return ()=> clearInterval(interval);
        }
    }, [contest]);


    const handleParticipate = async() => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/contests/${id}/participate`, {}, {
                headers:{'x-auth-token': token}
            });

            alert('Marked as participating!');
        } catch (error) {
            alert('Failed to mark as participating. Please try again later.');
        }
    }

   
    
    const handleBookmark = async() => {
        try {
            const token = localStorage.getItem('token');

            await axios.post(`http://localhost:5000/api/contests/${id}/bookmark`, {}, {
                headers: {'x-auth-token': token}
            });
            alert('Bookmarked successfully!');
        } catch (error) {
            alert('Failed to bookmark contest. Please try again later.');
        }
    }

    if (!contest) {
        return <div>Loading...</div>;
    }

    const contestImageUrl = imageMap[contest.resource.name] || '/images/default.png';

    return (
        <div className="mx-auto py-10 px-4 min-h-calc-screen bg-teal-800"
       >
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                    <img src={contestImageUrl} alt={contest.resource.name} className="w-20 h-20 rounded-full mr-6" />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{contest.event}</h1>
                        <p className="text-gray-600">Resource: {contest.resource.name}</p>
                        <p className="text-gray-600">
                            Start: {new Date(contest.start).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            End: {new Date(contest.end).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            Duration: {parseFloat(contest.duration)/3600.0} hours
                        </p>
                        <p className="text-red-600 font-bold">
                            Countdown: {countdown}
                        </p>
                        <a 
                            href={contest.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline inline-flex items-center mt-4"
                        >
                            Visit Contest Page <FaExternalLinkAlt className="ml-1"/>
                        </a>
                    </div>
                </div>

                <div className="mt-4">
                    <button onClick={handleParticipate} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
                        Participate
                    </button>
                    <button onClick={handleBookmark} className="bg-green-500 text-white px-4 py-2 rounded">
                        Bookmark
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContestDetails