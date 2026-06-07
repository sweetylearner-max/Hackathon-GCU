import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export function ResourceFinder() {
  const [topic, setTopic] = useState<string>("");

  // Generate search URLs
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(topic)}+learning+resources`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial`;

  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg shadow-md w-full max-w-4xl bg-gray-100 text-black">
      <h2 className="text-2xl font-bold text-center">Find Online Resources & Videos</h2>

      <div className="flex w-full max-w-md space-x-2">
        <input
          className="flex-grow p-3 border rounded-lg focus:outline-none"
          type="text"
          placeholder="Enter a topic (e.g., Artificial Intelligence)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <a
          href={googleSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 flex items-center space-x-2"
        >
          <FaSearch />
          <span>Google</span>
        </a>
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-500 flex items-center space-x-2"
        >
          <FaSearch />
          <span>YouTube</span>
        </a>
      </div>

      {/* Display Direct Search Links */}
      {topic && (
        <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="list-disc pl-5">
            <li>
              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google: {topic} Learning Resources
              </a>
            </li>
            <li>
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:underline"
              >
                YouTube: {topic} Tutorials
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
