import React, { useState, useEffect } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";

function Problem() {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n\t// Write your code here\n\treturn 0;\n}`);
    const [output, setOutput] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/problems")
            .then((response) => setProblems(response.data))
            .catch((error) => console.error("Error fetching problems:", error));
    }, []);

    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
    };

    const handleCodeExecution = () => {
        axios.post("http://localhost:5000/api/execute", { code, language: "cpp" })
            .then((response) => setOutput(response.data.output))
            .catch((error) => console.error("Error executing code:", error));
    };

    const getProblemUrl = (problem) => {
        return `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
    };

    return (
        <div className="min-h-screen bg-teal-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8">Codeforces Problem Solver</h1>
            
            <div className="flex flex-col md:flex-row md:space-x-8 w-full max-w-6xl">
                
                <div className="w-full md:w-1/3 bg-teal-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-black text-5xl font-bold mb-4">Problems</h2>
                    <ul className="space-y-2">
                        {problems.map((problem) => (
                            <li
                                key={`${problem.contestId}-${problem.index}`}
                                onClick={() => handleProblemSelect(problem)}
                                className="cursor-pointer text-black hover:underline"
                            >
                                <a 
                                    href={getProblemUrl(problem)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-black-300"
                                >
                                    {problem.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full md:w-2/3 bg-teal-100 p-6 rounded-lg shadow-md mt-8 md:mt-0">
                    <h2 className="text-2xl text-black font-semibold mb-4">
                        Selected Problem: {selectedProblem ? selectedProblem.name : "None"}
                    </h2>
                    {selectedProblem && (
                        <div className="mb-4">
                            <p className="text-sm">Contest ID: <span className="font-semibold">{selectedProblem.contestId}</span></p>
                            <p className="text-sm">Problem Index: <span className="font-semibold">{selectedProblem.index}</span></p>
                            <a 
                                href={getProblemUrl(selectedProblem)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-black hover:text-cyan-600 underline"
                            >
                                View Full Problem on Codeforces
                            </a>
                        </div>
                    )}
                    
                    <div className="mt-6">
                        <MonacoEditor
                            height="400px"
                            language="cpp"
                            value={code}
                            onChange={(newValue) => setCode(newValue)}
                            className="border rounded-lg"
                            theme="vs-dark"
                        />
                    </div>
                    
                    <button 
                        onClick={handleCodeExecution} 
                        className="mt-4 bg-teal-500 hover:bg-cyan-600 text-black font-semibold py-2 px-4 rounded"
                    >
                        Run Code
                    </button>
                    
                    <div className="mt-4 bg-teal-500 text-black p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Output:</h3>
                        <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Problem;
