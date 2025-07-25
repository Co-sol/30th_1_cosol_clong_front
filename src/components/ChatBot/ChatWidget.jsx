// src/components/ChatBot/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatWidget.css";

export default function ChatWidget({ isOpen, onClose }) {
  const [historyMessages, setHistoryMessages] = useState([]);
  const [chatMessages, setChatMessages]       = useState([]);
  const [input, setInput]                     = useState("");
  const endRef                                = useRef(null);

  // axios 인스턴스 (토큰 + 세션/CSRF)
  const token = localStorage.getItem("accessToken");
  const api = axios.create({
    baseURL: "http://13.62.4.52:8000/api",
    withCredentials: true,
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

  // 1) 열릴 때 과거 히스토리만 불러오기
  useEffect(() => {
    if (!isOpen) return;
    api.get("/chatbot/history/")
      .then(({ data: { success, data } }) => {
        if (success) {
          const msgs = data.map(item => ({
            from: item.role === "user" ? "user" : "bot",
            text: item.message,
          }));
          setHistoryMessages(msgs);
        } else {
          setHistoryMessages([]);
        }
      })
      .catch(() => {
        setHistoryMessages([]);
      });
    // 리셋 채팅창
    setChatMessages([]);
  }, [isOpen]);

  // 2) 메시지 변경 시 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyMessages, chatMessages]);

  // 3) 사용자 메시지 전송
  const send = () => {
    const text = input.trim();
    if (!text) return;
    // 3-1) 화면에 사용자 메시지 추가
    setChatMessages(prev => [...prev, { from: "user", text }]);
    setInput("");
    // 3-2) 백엔드 호출
    api.post("/chatbot/ask/", { message: text })
      .then(({ data: { success, data } }) => {
        if (success) {
          setChatMessages(prev => [...prev, { from: "bot", text: data }]);
        }
      })
      .catch(() => {
        setChatMessages(prev => [
          ...prev,
          { from: "bot", text: "죄송해요. 응답을 가져오지 못했어요." },
        ]);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-widget">
      <header className="chat-header">
        <span>AI 투투</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </header>

      <div className="chat-body">
        {/* 1) 과거 기록 */}
        {historyMessages.map((m, i) => (
          <div key={i} className={`chat-message ${m.from}`}>
            {m.text}
          </div>
        ))}

        {historyMessages.length > 0 && <div className="chat-gap" />}

        {/* 2) 프로필 이미지 (메시지 형식 아님) */}
        <div className="chat-bot-profile">
          <img src="/assets/toto2.png" alt="AI 프로필" />
        </div>

        {/* 3) 첫 인사 */}
        <div className="chat-message bot">
          무엇을 도와드릴까요?
        </div>

        {/* 4) 사용자 대화 및 봇 응답 */}
        {chatMessages.map((m, i) => (
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
