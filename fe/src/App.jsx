import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import ComparePDFs from "./pages/ComparePDFs";
import SummarizePDF from "./pages/SummarizePDF";
import './App.css'

import { useState, useEffect } from "react";

function Home() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to AI Chat App";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="px-4 py-20 max-w-6xl mx-auto">
        {/* Main Title with Typing Animation */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            {displayText}
          </h1>
          <p className="text-xl text-gray-700 fade-in-up-delay-1">
            Powered by AI
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-16 fade-in-up-delay-2">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI with our comprehensive suite of tools designed to help you analyze text, compare documents, and more.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up-delay-3">
          {/* Chat Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform duration-300 border-t-4 border-blue-500 glow">
            <div className="text-4xl mb-3 float">💬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Chat</h3>
            <p className="text-gray-600 text-sm">Chat with Gemini AI and get intelligent responses powered by advanced language models.</p>
            <div className="mt-4 text-blue-600 font-semibold text-sm">→ Start Chatting</div>
          </div>

          {/* Sentiment Analysis Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform duration-300 border-t-4 border-green-500 glow">
            <div className="text-4xl mb-3 float" style={{ animationDelay: "0.5s" }}>📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sentiment Analysis</h3>
            <p className="text-gray-600 text-sm">Analyze the sentiment of any text with real-time polarity and subjectivity metrics.</p>
            <div className="mt-4 text-green-600 font-semibold text-sm">→ Analyze Now</div>
          </div>

          {/* Compare PDFs Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform duration-300 border-t-4 border-orange-500 glow">
            <div className="text-4xl mb-3 float" style={{ animationDelay: "1s" }}>📄</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Compare PDFs</h3>
            <p className="text-gray-600 text-sm">Compare multiple PDF documents side by side and extract key differences.</p>
            <div className="mt-4 text-orange-600 font-semibold text-sm">→ Compare</div>
          </div>

          {/* Summarize PDF Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform duration-300 border-t-4 border-red-500 glow">
            <div className="text-4xl mb-3 float" style={{ animationDelay: "1.5s" }}>📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Summarize PDF</h3>
            <p className="text-gray-600 text-sm">Get concise summaries of PDF documents with AI-powered key findings extraction.</p>
            <div className="mt-4 text-red-600 font-semibold text-sm">→ Summarize</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center fade-in-up-delay-3">
          <p className="text-gray-700 mb-6 text-lg">
            Ready to get started? Select a feature from the navigation menu above.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              📬 Try Chat Now
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              🚀 Explore All Features
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-4 md:gap-8 text-center fade-in-up-delay-3">
          <div className="p-4">
            <div className="text-4xl font-bold text-blue-600">4</div>
            <p className="text-gray-600 mt-2">Powerful Tools</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-purple-600">∞</div>
            <p className="text-gray-600 mt-2">Unlimited Usage</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-green-600">⚡</div>
            <p className="text-gray-600 mt-2">Real-time Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/sentiment" element={<SentimentAnalysis />} />
        <Route path="/compare-pdfs" element={<ComparePDFs />} />
        <Route path="/summarize-pdf" element={<SummarizePDF />} />
      </Routes>
    </Router>
  );
}
