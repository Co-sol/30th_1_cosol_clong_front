// src/components/ChatBot/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatWidget.css";

export default function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  // 로그인 후 받은 JWT 토큰을 로컬스코어지에서 꺼내서
  // 매 요청의 Authorization 헤더에 담아 보내도록 axios 인스턴스 생성
  const token = localStorage.getItem("accessToken");
  const api = axios.create({
    baseURL: "http://13.62.4.52:8000/api",
    withCredentials: true,               // 세션+CSRF 기반일 때도 필요
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  // 챗봇 열릴 때 → 전체 히스토리 가져오기
  useEffect(() => {
    if (!isOpen) return;

    api
      .get("/chatbot/history/")
      .then((res) => {
        const { success, data, message } = res.data;
        if (!success) {
          return;
        }
        if (data.length === 0) {
          setMessages([{ from: "bot", text: "무엇을 도와드릴까요?" }]);
        } else {
          const historyMsgs = data.map((item) => ({
            from: item.role === "user" ? "user" : "bot",
            text: item.message,
          }));
          setMessages([
            ...historyMsgs,
            { from: "bot", text: "무엇을 도와드릴까요?" },
          ]);
        }
      })
      .catch((err) => {
      });
  }, [isOpen]); // isOpen이 true 될 때마다 실행

  // 메시지 바뀔 때마다 자동 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 사용자 입력 전송 함수
  const send = () => {
    const text = input.trim();
    if (!text) return;

    // 1) 화면에 사용자 메시지 바로 추가
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    // 2) 백엔드로 질문 보내기
    api
      .post("/chatbot/ask/", { message: text })
      .then((res) => {
        const { success, data, message } = res.data;
        if (!success) {
          return;
        }
        setMessages((prev) => [...prev, { from: "bot", text: data }]);
      })
      .catch((err) => {
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
        <div className="chat-bot-profile">
          <img src="/assets/toto2.png" alt="AI 프로필" />
        </div>

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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
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
