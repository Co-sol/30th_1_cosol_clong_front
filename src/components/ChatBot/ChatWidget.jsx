// src/components/ChatBot/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";

/**
 * - isOpen: 채팅창 표시여부
 * - onClose: 닫기 버튼 클릭 시 호출
 */
export default function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef();

  // 열릴 때 첫 인사
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ from: "bot", text: "무엇을 도와드릴까요?" }]);
    }
  }, [isOpen]);

  // 새 메시지 추가 시 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    // 1) 사용자 메시지
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");
    // 2) 목데이터 답변 (0.5초 딜레이)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "이것은 프론트 목데이터 답변입니다." }
      ]);
    }, 500);
  };

  if (!isOpen) return null;
  return (
    <div className="chat-widget">
      <header className="chat-header">
        <img src="/assets/toto2.png" alt="아이콘" />
        <span>AI 투투</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </header>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.from}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <footer className="chat-input">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="투투에게 질문하세요!"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <img
            className="input-icon"
            src="/assets/send.png"
            alt="전송"
            onClick={send}
          />
        </div>
      </footer>
    </div>
  );
}
