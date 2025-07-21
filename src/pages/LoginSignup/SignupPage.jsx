import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";
import eyeOpen from "/assets/eye.png";
import eyeClosed from "/assets/eyeblock.png";
import axios from "axios";

function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sensitivity, setSensitivity] = useState(50);
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // 비밀번호 보이기 토글용 state
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.setProperty("--value", sensitivity);
  }, [sensitivity]);

  const validateEmailFormat = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkEmailAvailability = async (email) => {
    try {
      const response = await axios.post("/api/users/email-check/", { email });
      return response.data.available;
    } catch (error) {
      console.error("이메일 확인 실패:", error);
      return false;
    }
  };

  const handleEmailCheck = async () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      setIsEmailChecked(false);
      return;
    }

    if (!validateEmailFormat(email)) {
      setEmailMessage("올바른 이메일 형식을 입력해주세요.");
      setIsEmailChecked(false);
      return;
    }

    const isAvailable = await checkEmailAvailability(email);
    if (isAvailable) {
      setEmailMessage("사용 가능한 이메일이에요.");
      setIsEmailChecked(true);
    } else {
      setEmailMessage("이미 사용 중인 이메일이에요.");
      setIsEmailChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname || !email || !password || !confirmPassword) {
      setSubmitError("모든 항목을 입력해주세요.");
      return;
    }

    if (!isEmailChecked) {
      if (!validateEmailFormat(email)) {
        setEmailMessage("올바른 이메일 형식을 입력해주세요.");
      } else {
        setEmailMessage("이메일 중복 확인을 해주세요.");
      }
      setSubmitError("");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMessage("비밀번호가 일치하지 않아요.");
      setSubmitError("");
      return;
    }

    setPasswordMessage("비밀번호가 일치해요.");
    setSubmitError("");

    try {
      await axios.post("/api/users/signup/", {
        name: nickname,
        password: password,
        email: email,
        clean_sense: sensitivity,
      });

      console.log("회원가입 성공");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setSubmitError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // const handleEmailCheck = () => {
  //   if (!email) {
  //     setEmailMessage("이메일을 입력해주세요.");
  //     setIsEmailChecked(false);
  //     return;
  //   }
  //   if (!validateEmailFormat(email)) {
  //     setEmailMessage("올바른 이메일 형식을 입력해주세요.");
  //     setIsEmailChecked(false);
  //     return;
  //   }
  //   if (email === "test@sookmyung.ac.kr") {
  //     setEmailMessage("사용 불가능한 이메일이에요.");
  //     setIsEmailChecked(false);
  //   } else {
  //     setEmailMessage("사용 가능한 이메일이에요.");
  //     setIsEmailChecked(true);
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!nickname || !email || !password || !confirmPassword) {
  //     setSubmitError("모든 항목을 입력해주세요.");
  //     return;
  //   }

  //   if (!isEmailChecked) {
  //     if (!validateEmailFormat(email)) {
  //       setEmailMessage("올바른 이메일 형식을 입력해주세요.");
  //     } else {
  //       setEmailMessage("이메일 중복 확인을 해주세요.");
  //     }
  //     setSubmitError("");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setPasswordMessage("비밀번호가 일치하지 않아요.");
  //     setSubmitError("");
  //     return;
  //   }

  //   setPasswordMessage("비밀번호가 일치해요.");
  //   setSubmitError("");
  //   console.log("회원가입 시도");
  //   navigate("/login");
  // };

  return (
    <div className="page-wrapper">
      <div className="signup-container">
        <Link to="/login" className="title">
          Clong
        </Link>
        <Link to="/login" className="subtitle">
          Clean along with
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className="form-row email-check">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
              }}
            />
            <button type="button" onClick={handleEmailCheck}>
              중복 확인
            </button>
          </div>
          <div
            className={
              emailMessage.includes("가능")
                ? "correct-message"
                : "error-message"
            }
          >
            {emailMessage}
          </div>

          {/* 비밀번호 입력 및 토글 */}
          <div className="form-row password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword) {
                  setPasswordMessage(
                    e.target.value === confirmPassword
                      ? "비밀번호가 일치해요."
                      : "비밀번호가 일치하지 않아요."
                  );
                } else {
                  setPasswordMessage("");
                }
              }}
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="toggle"
              className="toggle-icon"
              onClick={() => setShowPassword((v) => !v)}
            />
          </div>

          {/* 비밀번호 확인 (토글 제거) */}
          <div className="form-row">
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password && e.target.value) {
                  setPasswordMessage(
                    password === e.target.value
                      ? "비밀번호가 일치해요."
                      : "비밀번호가 일치하지 않아요."
                  );
                } else {
                  setPasswordMessage("");
                }
              }}
            />
          </div>
          <div
            className={
              passwordMessage.includes("일치하지")
                ? "error-message"
                : "correct-message"
            }
          >
            {passwordMessage}
          </div>

          <div className="sensitivity-row">
            <div className="sensitivity-header">
              <div className="sensitivity-label">
                청소 민감도 :{" "}
                <span className="sensitivity-value">{sensitivity}</span>
              </div>
              <div className="sensitivity-texts">
                <span>0: 둔감해요</span>
                <span>50: 적당히 깨끗해요</span>
                <span>100: 청결대마왕</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sensitivity}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (!isNaN(newValue)) {
                  setSensitivity(newValue);
                  document.documentElement.style.setProperty(
                    "--value",
                    newValue
                  );
                }
              }}
              className="sensitivity-slider"
            />
            <div className="sensitivity-ticks">
              <span style={{ left: "0%" }}>0</span>
              <span style={{ left: "50%", transform: "translateX(-50%)" }}>
                50
              </span>
              <span style={{ right: "0%" }}>100</span>
            </div>
          </div>

          {submitError && (
            <div
              className="error-message"
              style={{ marginTop: "-25px", marginBottom: "-15px" }}
            >
              {submitError}
            </div>
          )}

          <div className="form-row button">
            <button type="submit">회원 가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
