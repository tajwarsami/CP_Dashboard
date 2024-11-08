import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import  imageMap from './imageMap';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ResourceDetails = () => {
    const { id } = useParams();
    const [resource, setResource] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/resources/${id}`);
                setResource(response.data);
            } catch (error) {
                console.error('Error fetching resource details:', error);
            }
        };

        fetchResource();
    }, [id]);

    if (!resource) {
        return <div>Loading...</div>;
    }


    const resourceImageUrl = imageMap[resource.name] ;

    return (
        <div className="mx-auto py-10 px-4 min-h-calc-screen bg-teal-800"
       >
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                    <img src={resourceImageUrl} alt={resource.name} className="w-15 h-15 rounded-full mr-6" />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
                        <p className="text-gray-600">{resource.description}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-2">Details</h2>
                    <ul className="list-disc list-inside">
                        <li>Resource ID: {resource.id}</li>
                        <li>Contest Count: {resource.contest_count}</li>
                        <li>Resource URL: 
                            <a 
                                href={resource.name.startsWith('http') ? resource.name : `http://${resource.name}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline ml-2 inline-flex items-center"
                            >
                                Visit Site <FaExternalLinkAlt className="ml-1"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetails;