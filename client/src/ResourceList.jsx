

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import imageMap from './imageMap';
import { Link } from 'react-router-dom';

const ResourceList = () => {

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');


    useEffect(()=>{
        const fetchResources = async ()=>{
            try {
                const response = await axios.get('http://localhost:5000/api/resources');
                setResources(response.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        }

        fetchResources();
    }, []);

    const handleSearchChange = (e)=>{
         setSearch( e.target.value);
    }

    const filteredResources = resources.filter((resource)=>
        resource.name.toLowerCase().includes(search.toLowerCase())
     )


  return (
    <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Resources</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border rounded p-2 w-full md:w-1/3"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                    <div key={resource.id} className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center">
                            <img src={imageMap[resource.name]} alt={resource.name} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h2 className="text-xl font-bold">
                                    <Link to={`/resources/${resource.id}`} className="hover:underline">{resource.name}</Link>
                                </h2>
                                <p className="text-gray-600">{resource.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default ResourceList;

