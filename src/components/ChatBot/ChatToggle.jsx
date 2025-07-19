// src/components/ChatToggle.jsx
import React from "react";
import "./ChatToggle.css";

export default function ChatToggle({ onClick }) {
  return (
    <button className="chat-toggle" onClick={onClick}>
      <img src="/assets/toto.png" alt="AI 툴 열기" />
    </button>
  );
}
