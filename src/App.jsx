import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< Updated upstream
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
import { useAuthStatus } from "./hooks/useAuthStatus";
import MyPage from "./pages/MyPage/MyPage";
import GroupEvalPage from "./pages/GroupHomePage/GroupEvalPage";
=======
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CleanPersonality_1 from "./pages/CleanPersonality_1";
import CleanPersonality_2 from "./pages/CleanPersonality_2";
import CleanPersonality_3 from "./pages/CleanPersonality_3";
import CreateGroupPage from "./pages/CreateGroupPage";
import TutorialPage from "./pages/TutorialPage";
import CreateSpacePage from "./pages/CreateSpacePage";
import GroupHomePage from "./pages/GroupHomePage";
import NoGroupPage from "./pages/NoGroupPage";
import { useAuthStatus } from "./hooks/useAuthStatus";
import GroupSpacePage from "./pages/GroupSpacePage";
>>>>>>> Stashed changes

function App() {
    const { isLoggedIn, hasGroup } = useAuthStatus();

    return (
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
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/groupEval" element={<GroupEvalPage />} />

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
    );
}

export default App;
