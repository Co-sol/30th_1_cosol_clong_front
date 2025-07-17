// src/components/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";

export default function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ from: "bot", text: "무엇을 도와드릴까요?" }]);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    // TODO: 실제 API 호출
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const { reply } = await res.json();
    setMessages(m => [...m, { from: "bot", text: reply }]);
  };

  if (!isOpen) return null;
  return (
    <div className="chat-widget">
      <header className="chat-header">
        <img src="/assets/brush-icon.png" alt="" />
        <span>AI 투두</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </header>
      <div className="chat-body">
        {messages.map((m,i) => (
          <div key={i} className={`chat-message ${m.from}`}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <footer className="chat-input">
        <input
          placeholder="투두에게 질문하세요!"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send()}
        />
        <button onClick={send}>전송</button>
      </footer>
    </div>
  );
}
