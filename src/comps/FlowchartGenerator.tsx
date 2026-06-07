import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import html2canvas from "html2canvas";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);

export function FlowchartGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nodes.length > 0) {
      console.log("Flowchart updated:", nodes, edges);
    }
  }, [nodes, edges]);

  // Function to generate a hierarchical flowchart with subtopics
  async function generateFlowchart(topic: string): Promise<string> {
    try {
      const prompt = `
        You are an AI tutor. Generate a structured hierarchical tree flowchart for the topic: "${topic}".
        Each main topic should have 2-3 subtopics, forming a tree structure.
        Format the output as a structured JSON array **inside triple backticks** like this:

        \`\`\`json
        [
          { "id": "1", "label": "Introduction to ${topic}", "next": ["2", "3"] },
          { "id": "2", "label": "History & Background", "next": ["4", "5"] },
          { "id": "3", "label": "Basic Concepts", "next": ["6", "7"] },
          { "id": "4", "label": "Early Developments", "next": [] },
          { "id": "5", "label": "Key Innovations", "next": [] },
          { "id": "6", "label": "Fundamental Theories", "next": [] },
          { "id": "7", "label": "Applications", "next": ["8", "9"] },
          { "id": "8", "label": "Industry Use Cases", "next": [] },
          { "id": "9", "label": "Future Trends", "next": [] }
        ]
        \`\`\`

        Ensure the output is valid JSON and follows a tree-like structure.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      const response = await result.response.text();

      console.log("Raw API Response:", response);

      // Extract JSON data from triple backticks
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) throw new Error("AI did not return valid JSON inside triple backticks.");

      return jsonMatch[1]; // Extract the JSON part
    } catch (error) {
      console.error("Error generating flowchart:", error);
      return "[]"; // Return an empty JSON array on failure
    }
  }

  // Function to parse AI response into React Flow format
  const parseFlowchartData = (data: string) => {
    try {
      console.log("Parsing AI JSON:", data);
      const flowchartSteps = JSON.parse(data);
      if (!Array.isArray(flowchartSteps)) throw new Error("Invalid JSON format");

      // Create React Flow nodes (tree structure)
      const parsedNodes = flowchartSteps.map((step: any, index: number) => ({
        id: step.id,
        data: { label: step.label },
        position: { x: (index % 2 === 0 ? 250 : -250), y: index * 100 }, // Tree-like positioning
      }));

      // Create React Flow edges
      const parsedEdges = flowchartSteps.flatMap((step: any) =>
        step.next.map((nextId: string) => ({
          id: `e${step.id}-${nextId}`,
          source: step.id,
          target: nextId,
          animated: true,
        }))
      );

      return { parsedNodes, parsedEdges };
    } catch (error) {
      console.error("Error parsing flowchart data:", error);
      return { parsedNodes: [], parsedEdges: [] };
    }
  };

  // Handle flowchart generation
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setNodes([]);
    setEdges([]);

    try {
      const flowchartData = await generateFlowchart(topic);
      const { parsedNodes, parsedEdges } = parseFlowchartData(flowchartData);

      if (parsedNodes.length === 0) {
        alert("Failed to generate flowchart. Try again!");
      } else {
        setNodes(parsedNodes);
        setEdges(parsedEdges);
      }
    } catch (error) {
      console.error("Error generating flowchart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding edges dynamically
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to export flowchart as an image
  const handleExport = async () => {
    if (!flowRef.current) return;

    const canvas = await html2canvas(flowRef.current);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `Flowchart_${topic}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg shadow-md w-full h-[85vh] max-w-screen-lg bg-gray-100 text-black">
      <h2 className="text-2xl font-bold text-center">Flowchart Generator</h2>
      <input
        className="w-full p-3 border rounded-lg focus:outline-none max-w-md"
        type="text"
        placeholder="Enter a topic (e.g., Machine Learning)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Flowchart"}
      </button>

      {/* Responsive flowchart container */}
      <div ref={flowRef} className="w-full h-[70vh] border rounded-lg bg-white overflow-auto">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        ) : (
          <p className="text-center text-gray-500 mt-10">No flowchart generated yet.</p>
        )}
      </div>

      {nodes.length > 0 && (
        <button
          onClick={handleExport}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Export as Image
        </button>
      )}
    </div>
  );
}
