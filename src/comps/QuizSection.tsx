import React, { useState } from "react";
import { analyzeText } from "../utils/gemini"; // Function to generate quiz questions

interface QuizSectionProps {
  theme: "light" | "dark";
  history: any[];
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuizSection({ theme, history, setHistory }: QuizSectionProps) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10); // Default: 10 questions
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(numQuestions).fill(""));
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(quiz.length / questionsPerPage);

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScore(null);
    setQuiz([]);

    try {
      const prompt = `
        You are a quiz generator. Create a quiz with ${numQuestions} multiple-choice questions on the topic: "${topic}".
        Each question should have:
        - A clear and concise question.
        - Four answer options labeled A, B, C, D.
        - The correct answer indicated.

        Format your response strictly as:
        ---
        1. What is the capital of France?
        A) Berlin
        B) Madrid
        C) Paris
        D) Rome
        Answer: C
        ---
      `;

      const response = await analyzeText(prompt);
      const questions = parseQuizResponse(response);

      setQuiz(questions);
      setUserAnswers(Array(questions.length).fill("")); // Reset user answers
      setCurrentPage(0); // Reset to first page
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  /** 🛠️ FIXED: Properly parse AI response to extract correct answers */
  const parseQuizResponse = (text: string): Question[] => {
    text = text.replace(/^\s*[\r\n]+/, ""); // Remove leading empty lines
    const questionBlocks = text.split(/\n(?=\d+\.)/); // Split questions properly

    return questionBlocks
      .map((block) => {
        const lines = block.split("\n").map((line) => line.trim());
        const questionMatch = lines[0].match(/^\d+\.\s*(.+)/);
        if (!questionMatch) return null;

        const question = questionMatch[1];
        const options = lines.slice(1, 5).map((opt) => opt.replace(/^[A-D]\)\s*/, "").trim());
        const answerMatch = lines.find((line) => line.startsWith("Answer:"));
        
        // Fix: Extract the correct answer properly
        const correctAnswerLetter = answerMatch ? answerMatch.split(":")[1].trim() : "";
        const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(correctAnswerLetter);
        const correctAnswer = correctAnswerIndex !== -1 ? options[correctAnswerIndex] : "";

        return options.length === 4 ? { question, options, correctAnswer } : null;
      })
      .filter((q) => q !== null) as Question[];
  };

  /** ✅ FIXED: Ensure `userAnswers` updates properly */
  const handleAnswerChange = (index: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  /** ✅ FIXED: Ensure score calculation properly checks correct answers */
  const calculateScore = () => {
    let correctCount = 0;

    quiz.forEach((q, index) => {
      if (
        userAnswers[index] &&
        userAnswers[index].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      ) {
        correctCount++;
      }
    });

    setScore(correctCount);

    // Store quiz attempt in history
    const newHistoryItem = {
      question: `Quiz on ${topic}`,
      solution: "See answers in the quiz section",
      score: correctCount,
      totalQuestions: quiz.length,
    };

    setHistory([newHistoryItem, ...history]);
  };

  return (
    <div
      className={`flex flex-col items-center space-y-4 p-6 rounded-lg shadow-md w-full max-w-3xl ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold">AI-Generated Quiz</h2>

      {/* Topic Input */}
      <input
        type="text"
        placeholder="Enter topic (e.g., Space Science)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className={`w-full p-3 border rounded-lg focus:outline-none ${
          theme === "dark"
            ? "bg-gray-900 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />

      {/* Dropdown to Select Number of Questions */}
      <select
        value={numQuestions}
        onChange={(e) => {
          setNumQuestions(Number(e.target.value));
          setUserAnswers(Array(Number(e.target.value)).fill("")); // Reset answers when changing number of questions
        }}
        className="w-full p-2 border rounded-lg focus:outline-none bg-white text-black"
      >
        <option value={5}>5 Questions</option>
        <option value={10}>10 Questions</option>
        <option value={15}>15 Questions</option>
        <option value={20}>20 Questions</option>
        <option value={25}>25 Questions</option>
      </select>

      {/* Generate Quiz Button */}
      <button
        onClick={generateQuiz}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
          theme === "dark"
            ? "bg-blue-500 text-white hover:bg-blue-400"
            : "bg-blue-600 text-white hover:bg-blue-500"
        } disabled:opacity-50`}
      >
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {quiz.length > 0 && (
        <div className="w-full">
          {quiz.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage).map((q, index) => (
            <div key={index} className="p-4 border rounded-lg mb-2">
              <p className="font-semibold">{`${currentPage * questionsPerPage + index + 1}. ${q.question}`}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      userAnswers[currentPage * questionsPerPage + index] === option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentPage * questionsPerPage + index}`}
                      value={option}
                      onChange={() => handleAnswerChange(currentPage * questionsPerPage + index, option)}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Quiz */}
          <button onClick={calculateScore} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg">
            Submit Quiz
          </button>

          {/* Score Display */}
          {score !== null && (
            <p className="mt-4 text-xl font-bold">
              You scored {score} / {quiz.length} 🎉
            </p>
          )}
        </div>
      )}
    </div>
  );
}
