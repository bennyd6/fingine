import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, User, Bot } from "lucide-react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Store chat history
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null); // For auto-scroll
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };

  recognition.onerror = () => {
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const res = await fetch("http://127.0.0.1:5000/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await res.json();
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      setInput("");
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Chatbot</h2>

      <div style={{ height: "300px", overflowY: "auto", padding: "10px", borderBottom: "1px solid #ddd" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            textAlign: msg.sender === "user" ? "right" : "left", 
            margin: "5px 0" 
          }}>
            <span style={{ 
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "10px",
              background: msg.sender === "user" ? "#DCF8C6" : "#E5E5EA"
            }}>
              {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />} {msg.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "5px", padding: "8px", background: "#007BFF", color: "#fff", borderRadius: "5px" }}>
          <Send size={18} />
        </button>
        <button onClick={toggleVoiceInput} style={{ marginLeft: "5px", padding: "8px", background: isListening ? "red" : "gray", color: "#fff", borderRadius: "5px" }}>
          {isListening ? "Stop" : "Start"} <Mic size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;