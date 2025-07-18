import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginSignup/LoginPage";
import SignupPage from "./pages/LoginSignup/SignupPage";
import CleanPersonality_1 from "./pages/CleanPersonality/CleanPersonality_1";
import CleanPersonality_2 from "./pages/CleanPersonality/CleanPersonality_2";
import CleanPersonality_3 from "./pages/CleanPersonality/CleanPersonality_3";
import CreateGroupPage from "./pages/CreatePages/CreateGroupPage";
import TutorialPage from "./pages/CreatePages/TutorialPage";
import CreateSpacePage from "./pages/CreatePages/CreateSpacePage";
import GroupHomePage from "./pages/GroupHomePage/GroupHomePage";
import NoGroupPage from "./pages/CreatePages/NoGroupPage";
import GroupSpacePage from "./pages/GroupSpacePage/GroupSpacePage";
import GroupJournalPage from "./pages/GroupJournalPage/GroupJournalPage";
import GroupEvalPage from "./pages/GroupHomePage/GroupEvalPage";
import MyPage from "./pages/MyPage/MyPage";
import { useAuthStatus } from "./hooks/useAuthStatus";

// 채팅봇 컴포넌트
import ChatToggle from "./components/ChatBot/ChatToggle";
import ChatWidget from "./components/ChatBot/ChatWidget";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const { isLoggedIn, hasGroup } = useAuthStatus();
  const { pathname } = useLocation();
  const noChatPaths = [
    "/", "/signup", "/login",
    "/personality/1", "/personality/2", "/result",
    "/noGroup", "/createGroup", "/tutorial",
    "/createSpace",
  ];
  const showChat = !noChatPaths.includes(pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/personality/1" element={<CleanPersonality_1 />} />
        <Route path="/personality/2" element={<CleanPersonality_2 />} />
        <Route path="/result" element={<CleanPersonality_3 />} />
        <Route path="/noGroup" element={<NoGroupPage />} />
        <Route path="/createGroup" element={<CreateGroupPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/createSpace" element={<CreateSpacePage />} />
        <Route path="/groupSpace" element={<GroupSpacePage />} />
        <Route path="/groupHome" element={<GroupHomePage />} />
        <Route path="/groupJournal" element={<GroupJournalPage />} />
        <Route path="/groupEval" element={<GroupEvalPage />} />
        <Route path="/mypage" element={<MyPage />} />
        

        <Route
          path="/redirect"
          element={
            isLoggedIn ? (
              hasGroup ? (
                <Navigate to="/createSpace" replace />
              ) : (
                <Navigate to="/createGroup" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<div>잘못된 페이지입니다.</div>} />
      </Routes>

      {showChat && !chatOpen && (
        <ChatToggle onClick={() => setChatOpen(o => !o)} />
      )}

      {showChat && (
        <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}    </>
  );
}

export default App;
