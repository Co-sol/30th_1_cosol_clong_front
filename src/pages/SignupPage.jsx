import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';

function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sensitivity, setSensitivity] = useState(50);
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    document.documentElement.style.setProperty('--value', sensitivity);
  }, []);

  const validateEmailFormat = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailCheck = () => {
    if (!email) {
      setEmailMessage('이메일을 입력해주세요.');
      return;
    }
    if (!validateEmailFormat(email)) {
      setEmailMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (email === 'test@sookmyung.ac.kr') {
      setEmailMessage('사용 불가능한 이메일이에요.');
    } else {
      setEmailMessage('사용 가능한 이메일이에요.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMessage('비밀번호가 일치하지 않아요.');
      return;
    }
    setPasswordMessage('비밀번호가 일치해요.');
    console.log('회원가입 시도');
  };

  return (
    <div className="page-wrapper">
      <div className="signup-container">
        <Link to="/login" className="title">Clong</Link>
        <Link to="/login" className="subtitle">Clean along with</Link>


        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              id="nickname"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className="form-row email-check">
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={handleEmailCheck}>
              중복 확인
            </button>
          </div>
          <div className={emailMessage.includes('가능') ? 'correct-message' : 'error-message'}>
            {emailMessage}
          </div>

          <div className="form-row">
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword) {
                  if (e.target.value === confirmPassword) {
                    setPasswordMessage('비밀번호가 일치해요.');
                  } else {
                    setPasswordMessage('비밀번호가 일치하지 않아요.');
                  }
                } else {
                  setPasswordMessage('');
                }
              }}
            />
          </div>

          <div className="form-row">
            <input
              type="password"
              id="confirm-password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password && e.target.value) {
                  if (password === e.target.value) {
                    setPasswordMessage('비밀번호가 일치해요.');
                  } else {
                    setPasswordMessage('비밀번호가 일치하지 않아요.');
                  }
                } else {
                  setPasswordMessage('');
                }
              }}
            />
          </div>
          <div className={passwordMessage.includes('일치하지') ? 'error-message' : 'correct-message'}>
            {passwordMessage}
          </div>

          <div className="sensitivity-row">
            <div className="sensitivity-header">
              <div className="sensitivity-label">
                청소 민감도 : <span className="sensitivity-value">{sensitivity}</span>
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
                  document.documentElement.style.setProperty('--value', newValue);
                }
              }}
              className="sensitivity-slider"
            />
            <div className="sensitivity-ticks">
              <span style={{ left: '0%' }}>0</span>
              <span style={{ left: '50%', transform: 'translateX(-50%)' }}>50</span>
              <span style={{ right: '0%' }}>100</span>
            </div>
          </div>

          <div className="form-row button">
            <button
              type="submit"
              disabled={!nickname || !email || !password || !confirmPassword}
            >
              회원 가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
