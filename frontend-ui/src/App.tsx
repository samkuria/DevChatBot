import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./index.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { message: input });
      const reply = res.data.reply;

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Unable to reach backend" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg: Message, i: number) => {
  // Match code blocks in the format ```language\ncode```
  const codeBlockMatch = msg.text.match(/```(\w+)?\n?([\s\S]*?)```/);
  if (!codeBlockMatch) return <p key={i} className={msg.sender}>{msg.text}</p>;

  const language = codeBlockMatch[1] || "javascript";
  const code = codeBlockMatch[2].trim();
  return (
    <div key={i} className={msg.sender}>
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

  return (
    <div className="chat-container">
      <h1>DevChatBot 💻</h1>
      <div className="chat-box">
        {messages.map((msg, i) => renderMessage(msg, i))}
        {loading && <p className="bot">Thinking...</p>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt or paste your code..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
