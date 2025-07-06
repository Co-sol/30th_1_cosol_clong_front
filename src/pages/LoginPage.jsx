
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 백엔드 요청 없이 바로 이동
    navigate('/personality/1');
  };

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

          body {
            margin: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #ffffff;
            height: 100vh;
            overflow: hidden;
          }

          .page-wrapper {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
          }

          .login-container {
            transform: scale(0.7);
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
          }

          .title {
            font-family: 'Inter', sans-serif;
            font-size: 64px;
            font-weight: 800;
            font-style: italic;
            color: #1AC2A9;
            margin-bottom: 20px;
            text-align: center;
          }

          .subtitle {
            font-size: 32px;
            font-weight: 700;
            color: #B5B5B5;
            margin-bottom: 60px;
            text-align: center;
          }

          form .form-row:first-of-type {
            margin-top: 30px;
          }

          form {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .form-row {
            display: flex;
            align-items: center;
            width: 100%;
            height: 65px;
            background-color: #f5f5f5;
            border-radius: 15px;
            padding: 0 14px;
            box-sizing: border-box;
          }

          .form-row input {
            border: none;
            background: transparent;
            font-size: 20px;
            width: 100%;
            outline: none;
            font-weight: 500;
            color: #545454;
            font-family: 'Noto Sans KR', sans-serif;
          }

          .form-row span {
            white-space: nowrap;
            color: #787878;
            font-size: 20px;
            font-weight: 400;
          }

          .error-message {
            color: #FF5C5C;
            font-size: 16px;
            font-weight: 500;
            height: 20px;
            margin-top: -5px;
            text-align: left;
            width: 100%;
            padding-left: 10px;
          }

          .form-row.button {
            width: 100%;
            height: 70px;
            background-color: #8BE2B6;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin-top: 0px;
          }

          .form-row.button button {
            background: none;
            border: none;
            color: white;
            font-size: 32px;
            font-weight: 900;
            cursor: pointer;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            font-family: 'Noto Sans KR', sans-serif;
          }

          .bottom-text {
            margin-top: 50px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .bottom-text .label {
            font-size: 20px;
            font-weight: 500;
            color: #000;
          }

          .bottom-text a {
            font-size: 16px;
            font-weight: 400;
            color: #4381EB;
            text-decoration: none;
          }

          @media (max-width: 1024px) {
            .title {
              font-size: 48px;
            }

            .subtitle {
              font-size: 24px;
              margin-bottom: 50px;
            }

            .form-row {
              height: 60px;
            }

            .form-row.button {
              height: 65px;
            }

            .form-row.button button {
              font-size: 28px;
            }

            .bottom-text .label {
              font-size: 18px;
            }

            .bottom-text a {
              font-size: 14px;
            }
          }
        `}
      </style>

      <div className="page-wrapper">
        <div className="login-container">
          <div className="title">Clong</div>
          <div className="subtitle">Clean along with</div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="error-message">{errorMessage}</div>
            <div className="form-row button">
              <button type="submit">로그인</button>
            </div>
          </form>

          <div className="bottom-text">
            <div className="label">계정이 없으신가요?</div>
            <Link to="/signup">회원가입하기</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
