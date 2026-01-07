import { useState } from "react";
import { BACKEND_URL } from "../config.js";

export default function SentimentAnalysis() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [history, setHistory] = useState([]);

  const exampleMessages = [
    { text: "I love this product! It's amazing and works perfectly.", type: "positive" },
    { text: "This is terrible. I'm very disappointed with the service.", type: "negative" },
    { text: "The weather is cloudy today.", type: "neutral" },
    { text: "The meeting went well but could have been better.", type: "mixed" }
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSentiment(data);
      
      // Add to history
      setHistory([{ ...data, timestamp: new Date().toLocaleTimeString() }, ...history]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error analyzing sentiment");
    }
  };

  const useExampleMessage = (exampleText) => {
    setText(exampleText);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 border-green-500 text-green-800";
      case "negative":
        return "bg-red-100 border-red-500 text-red-800";
      case "neutral":
        return "bg-gray-100 border-gray-500 text-gray-800";
      default:
        return "bg-gray-100";
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "❓";
    }
  };

  const getPolairtyBarColor = (polarity) => {
    if (polarity > 0.3) return "bg-green-500";
    if (polarity < -0.3) return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">📊 FeedBack Analysis</h2>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <textarea
            className="border-2 border-gray-300 p-3 w-full mb-3 rounded focus:border-blue-500 focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze sentiment..."
            rows="4"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.ctrlKey) handleAnalyze();
            }}
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
            onClick={handleAnalyze}
          >
            Analyze
          </button>

          {/* Example Messages */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">📝 Try These Examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleMessages.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => useExampleMessage(example.text)}
                  className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded border border-gray-300 hover:border-blue-400 transition-all duration-200"
                >
                  <div className="text-xs font-semibold text-blue-600 mb-1">
                    {example.type.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-800">{example.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Sentiment Display */}
        {sentiment && (
          <div className={`mb-6 p-4 border-2 rounded-lg ${getSentimentColor(sentiment.sentiment)}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{getSentimentEmoji(sentiment.sentiment)}</span>
              <div>
                <h3 className="text-2xl font-bold">{sentiment.sentiment.toUpperCase()}</h3>
                <p className="text-sm opacity-75">Last analyzed</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Polarity Bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Polarity</span>
                  <span className="text-sm">{sentiment.polarity}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPolairtyBarColor(sentiment.polarity)}`}
                    style={{ width: `${((sentiment.polarity + 1) / 2) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 opacity-70">
                  <span>-1 (Very Negative)</span>
                  <span>0 (Neutral)</span>
                  <span>+1 (Very Positive)</span>
                </div>
              </div>

              {/* Subjectivity Bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Subjectivity</span>
                  <span className="text-sm">{sentiment.subjectivity}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${sentiment.subjectivity * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 opacity-70">
                  <span>0 (Objective)</span>
                  <span>1 (Subjective)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Graph */}
        {history.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Analysis History</h3>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div key={idx} className={`p-4 border-l-4 rounded ${getSentimentColor(item.sentiment)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSentimentEmoji(item.sentiment)}</span>
                      <div>
                        <p className="font-semibold capitalize">{item.sentiment}</p>
                        <p className="text-xs opacity-70">{item.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>Polarity: <span className="font-bold">{item.polarity}</span></p>
                      <p>Subjectivity: <span className="font-bold">{item.subjectivity}</span></p>
                    </div>
                  </div>
                  <p className="text-sm mt-2 italic opacity-80">"{item.text.substring(0, 80)}..."</p>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded border border-green-300">
                <p className="text-sm text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-green-600">
                  {history.filter(h => h.sentiment === "positive").length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-600">Neutral</p>
                <p className="text-2xl font-bold text-gray-600">
                  {history.filter(h => h.sentiment === "neutral").length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded border border-red-300">
                <p className="text-sm text-gray-600">Negative</p>
                <p className="text-2xl font-bold text-red-600">
                  {history.filter(h => h.sentiment === "negative").length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
