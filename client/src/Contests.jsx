import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imageMap from "./imageMap";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("event");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contests");
        setContests(response.data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = contests.filter((contest) => {
    const searchTerm = search.toLowerCase();

    if (filterType === "event") {
      return contest.event.toLowerCase().includes(searchTerm);
    } else if (filterType === "resource") {
      return contest.resource.name.toLowerCase().includes(searchTerm);
    }

    return true;
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="mx-auto py-10 px-4"
     style={{
         background: '#000000',
         backgroundImage: 'linear-gradient(315deg, #000000 0%, #5e5368 74%)',
     }}>
    <div className="">
        <h1 className="text-2xl font-bold mb-4 text-white">Upcoming Contests</h1>
        <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border rounded p-2 w-full w md:w-1/3"
                />
                <div className="flex items-center space-x-2 font-bold">
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="event"
                            checked={filterType === 'event'}
                            onChange={handleFilterTypeChange}
                        />
                        <span className="ml-1 text-white">Event</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="resource"
                            checked={filterType === 'resource'}
                            onChange={handleFilterTypeChange}
                        />
                        <span className="ml-1 text-white">Resource</span>
                    </label>
                </div> 
            </div>
        </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
            <div key={contest.id} className="shadow-lg rounded-lg p-6 bg-slate-300">
                <div className="flex items-center">
                    <img
                        src={
                            imageMap[contest.resource.name.toLowerCase()] ||
                            "/images/default.png"
                        }
                        alt={contest.resource.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-xl font-bold">
                            <Link
                                to={`/contests/${contest.id}`}
                                className="hover:underline"
                            >
                                {contest.event}
                            </Link>
                        </h2>
                        <p className="text-gray-600">{contest.resource.name}</p>
                        <p className="text-gray-600">
                            Start: {new Date(contest.start).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            End: {new Date(contest.end).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

  );
};

export default Contests;
