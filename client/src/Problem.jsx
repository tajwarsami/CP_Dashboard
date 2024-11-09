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

    // Function to construct Codeforces problem URL
    const getProblemUrl = (problem) => {
        return `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
    };

    return (
        <div className="App">
            <h1>Codeforces Problem Solver</h1>
            <div>
                <h2>Problems</h2>
                <ul>
                    {problems.map((problem) => (
                        <li
                            key={`${problem.contestId}-${problem.index}`} 
                            onClick={() => handleProblemSelect(problem)}
                            style={{ cursor: "pointer", marginBottom: "10px" }}
                        >
                            <a 
                                href={getProblemUrl(problem)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "blue" }}
                            >
                                {problem.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Selected Problem: {selectedProblem ? selectedProblem.name : "None"}</h2>
                {selectedProblem && (
                    <div>
                        <p>Contest ID: {selectedProblem.contestId}</p>
                        <p>Problem Index: {selectedProblem.index}</p>
                        <a 
                            href={getProblemUrl(selectedProblem)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: "blue", textDecoration: "underline" }}
                        >
                            View Full Problem on Codeforces
                        </a>
                    </div>
                )}

                <MonacoEditor
                    height="400px"
                    language="cpp"
                    value={code}
                    onChange={(newValue) => setCode(newValue)}
                />
                <button onClick={handleCodeExecution}>Run Code</button>
                <h3>Output:</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
}

export default Problem;
