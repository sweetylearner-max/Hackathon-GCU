import { useState } from "react";
import { Solution } from "./SolutionGen"; // Ensure correct path for Solution component

export function HistoryView({ history }: { history: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicContent, setTopicContent] = useState<string[]>([]);

  const toggleExpansion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const generateRecommendations = () => {
    if (history.length === 0) {
      setRecommendations(["Start learning by asking questions!"]);
      return;
    }

    const topics = history.map((entry) => entry.question).slice(-3); // Last 3 questions
    const suggestions = [
      ...new Set(
        topics.map((topic) => `Learn more about: ${topic}`)
      ),
    ];

    setRecommendations(suggestions.length > 0 ? suggestions : ["Keep exploring new topics!"]);
  };

  const generateContent = (topic: string) => {
    const content = [
      `1. Introduction to ${topic}`,
      `2. Importance of ${topic} in real-world applications`,
      `3. Key concepts related to ${topic}`,
      `4. Common mistakes when learning ${topic}`,
      `5. Best practices for mastering ${topic}`,
      `6. Useful resources and study materials on ${topic}`,
      `7. How ${topic} connects with other topics`,
      `8. Practical examples and case studies on ${topic}`,
      `9. Exercises and challenges to improve understanding of ${topic}`,
      `10. Summary and next steps for learning ${topic}`
    ];
    setSelectedTopic(topic);
    setTopicContent(content);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">History</h2>
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {history.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">No history available.</p>
        ) : (
          history.map((entry, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 mb-4 pb-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpansion(index)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {entry.question}
                  </h3>
                  {entry.score !== undefined && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold">Score:</span> {entry.score} / {entry.totalQuestions}
                    </p>
                  )}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {expandedIndex === index ? "Collapse" : "Expand"}
                </span>
              </div>

              {expandedIndex === index && (
                <div className="mt-4">
                  <Solution
                    solution={entry.solution}
                    isSpeaking={isSpeaking}
                    onToggleSpeech={setIsSpeaking}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {/* Button to get recommendations */}
        <button
          onClick={generateRecommendations}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          Get Recommendations
        </button>

        {/* Display recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Topics:</h3>
            <ul className="list-disc pl-5 text-gray-800 dark:text-gray-300">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => generateContent(rec)}
                >
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display generated content */}
        {selectedTopic && topicContent.length > 0 && (
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details on {selectedTopic}:</h3>
            <ul className="list-decimal pl-5 text-gray-800 dark:text-gray-300">
              {topicContent.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
