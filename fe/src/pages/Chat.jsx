import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from "../config.js";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // {id, sender: 'user'|'bot', text}
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const listRef = useRef(null);

  const exampleMessages = [
    {
      id: 1,
      label: "Explain inflation",
      text: "Explain the main causes of inflation in simple terms and give 3 practical steps I can take to protect my savings.",
    },
    {
      id: 2,
      label: "Summarize book",
      text: "Summarize the key ideas of 'Atomic Habits' in 5 bullet points and suggest one habit I can start today.",
    },
    {
      id: 3,
      label: "Write email",
      text: "Write a short, polite email (3–4 sentences) asking a colleague to reschedule tomorrow's meeting to next week.",
    },
    {
      id: 4,
      label: "Debug CORS",
      text: "My fetch request returns a CORS error. What are the most likely causes and 4 concrete fixes I can try?",
    },
  ];

  const scrollToBottom = () => {
    try {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } catch (e) {
      /* ignore */
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now() + Math.random(),
      sender: "user",
      text: message.trim(),
    };

    // Add user message immediately
    setMessages((m) => [...m, userMsg]);
    setMessage("");

    // Add placeholder bot message (will be typed into)
    const botId = Date.now() + Math.random();
    const botMsg = { id: botId, sender: "bot", text: "" };
    setMessages((m) => [...m, botMsg]);
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: userMsg.text }),
      });
      const data = await res.json();
      const fullText = data.text || "";

      // Type the bot response into the last message
      let i = 0;
      const speed = 18; // ms per character
      const interval = setInterval(() => {
        i += 1;
        const partial = fullText.slice(0, i);
        setMessages((prev) =>
          prev.map((it) => (it.id === botId ? { ...it, text: partial } : it))
        );
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
    } catch (err) {
      console.error(err);
      setMessages((m) =>
        m.map((it) => (it.id === botId ? { ...it, text: "Error: unable to reach backend." } : it))
      );
      setIsTyping(false);
    }
  };

  // Auto-type example into the input and optionally auto-send when done
  const typeIntoInput = (textToType, autoSend = true) => {
    if (isTyping || isAutoTyping) return; // don't interrupt
    setIsAutoTyping(true);
    setMessage("");
    let i = 0;
    const speed = 20; // ms per char
    const interval = setInterval(() => {
      i += 1;
      setMessage(textToType.slice(0, i));
      if (i >= textToType.length) {
        clearInterval(interval);
        setIsAutoTyping(false);
        if (autoSend) {
          // slight delay to make it feel natural
          setTimeout(() => handleSend(), 300);
        }
      }
    }, speed);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ChatBot</h2>

      {/* Example quick prompts */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {exampleMessages.map((ex) => (
          <button
            key={ex.id}
            onClick={() => typeIntoInput(ex.text, true)}
            className="text-sm p-2 bg-gray-50 rounded border hover:bg-blue-50 hover:border-blue-300 transition"
            disabled={isTyping || isAutoTyping}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div ref={listRef} className="h-80 overflow-auto p-4 bg-transparent rounded-lg border border-gray-200/20 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No messages yet — say hello 👋</div>
        )}

        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {isTyping && m.sender === "bot" && m.text !== undefined && (
                  <span className="inline-block align-middle ml-2 cursor"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          onClick={handleSend}
          disabled={isTyping}
        >
          {isTyping ? "Waiting..." : "Send"}
        </button>
      </div>
    </div>
  );
}
