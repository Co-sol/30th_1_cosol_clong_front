import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import NicknameModal from '../../components/MyPageModal/NicknameModal';
import CleanSensitive from '../../components/MyPageModal/CleanSensitiveModal';
import GroupLeaveModal from '../../components/MyPageModal/GroupLeaveModal';
import UserLeaveModal from '../../components/MyPageModal/UserLeaveModal';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";
import { resultTextMockData } from '../../data/cleanType';

function MyPage() {
  const [badges, setBadges] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupCreatedAt, setGroupCreatedAt] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [typeCode, setTypeCode] = useState('');
  const [typeName, setTypeName] = useState('');
  const [typeDate, setTypeDate] = useState('');
  const [typeDesc, setTypeDesc] = useState('');
  const [sensitivity, setSensitivity] = useState(0);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isSensitiveModalOpen, setIsSensitiveModalOpen] = useState(false);
  const [isGroupLeaveModalOpen, setIsGroupLeaveModalOpen] = useState(false);
  const [isUserLeaveModalOpen, setIsUserLeaveModalOpen] = useState(false); // 회원 탈퇴 모달 상태
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1) 로컬에 저장된 리프레시 토큰 꺼내기
      const refresh = localStorage.getItem("refreshToken");
      // 2) 서버에 로그아웃 요청 (body에 refresh 토큰 전달)
      await axiosInstance.post("/users/logout/", { refresh });
    } catch (err) {
      console.error("로그아웃 API 호출 실패:", err);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 3) 클라이언트 토큰 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // 4) 첫 화면으로 이동
      navigate("/");
    }
  };
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get('/mypage/info/');
        const d = res.data.data;

        // ID, NAME
        setUserId(d.email);
        setUserName(d.name);

        // 청소 민감도
        setSensitivity(d.clean_sense);

        // 청소 성격 유형
        if (d.clean_type != null) {
          const m = resultTextMockData.find(x => x.label === d.clean_type);
          setTypeCode(m?.key || '');
          setTypeName(m?.title || '알 수 없음');
          setTypeDesc(m?.description || '결과 데이터를 불러올 수 없습니다.');
        }

        // 결과 생성일
        if (d.clean_type_created_at) {
          const dt = new Date(d.clean_type_created_at);
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          setTypeDate(`${yyyy}.${mm}.${dd}`);
        }

        // 뱃지 프로필
        const allBadges = [
          { src: '/assets/badge1.png', label: '청소 응애' },
          { src: '/assets/badge2.png', label: '인간 청소기' },
          { src: '/assets/badge3.png', label: '청소 러버' },
          { src: '/assets/badge4.png', label: '청소 올데이' },
          { src: '/assets/badge5.png', label: '청소의 왕' },
        ];
        setBadges(allBadges.map((b, i) => ({ ...b, active: i === d.profile })));

      } catch (err) {
        console.error('회원 정보 조회 실패:', err);
      }
    };
    fetchUserInfo();

    // ↓ 이 부분만 원래 mock 세팅으로 놔두세요
    setGroupName("Clong's home");
    setGroupCreatedAt('2025.05.22');
    setGroupMembers(['solux', 'A', 'sook']);
  }, []);

  const handleUserLeave = () => {
    console.log('회원 탈퇴가 처리되었습니다.');
    setIsUserLeaveModalOpen(false);
  };  

  const handleGroupLeave = () => {
    console.log('그룹 탈퇴가 처리되었습니다.');
    setIsGroupLeaveModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="mypage-scaled">
        <div className="mypage-wrapper">
          <div className="mypage-container">
            <div className="mypage-left">
              <div className="badge-wrapper">
                <div className="badge-section">
                  <div className="badge-background"></div>
                  <h2 className="section-title">뱃지</h2>
                  <div className="badge-list">
                    {badges.map((badge, index) => (
                      <div
                        className={`badge-item ${badge.active ? 'active' : ''}`}
                        key={index}
                      >
                        <img src={badge.src} alt={badge.label} />
                        <span>{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group-wrapper">
                <div className="group-section">
                  <h2 className="section-title">그룹</h2>
                  <div className="group-content">
                    <div className="group-main">
                      <div className="group-name-row">
                        <img src="/assets/homeicon.png" alt="홈 아이콘" className="home-icon" />
                        <div className="group-name">{groupName}</div>
                      </div>
                      <div className="group-meta">
                        <div className="group-meta-item">
                          <strong>그룹 최초 생성일</strong>
                          <span>{groupCreatedAt}</span>
                        </div>
                        <div className="group-meta-item">
                          <strong>멤버</strong>
                          <span>
                            {groupMembers.map((member, idx) => (
                              <span key={idx} style={{ marginRight: '15px' }}>{member}</span>
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="personality-wrapper">
                  <div className="personality-section">
                    <div className="personality-header">
                      <span className="personality-date">{typeDate}</span>
                      <h2 className="section-title" style={{ textAlign: 'center' }}>청소 성격 유형</h2>
                    </div>
                    <div className="personality-content">
                      <div className="personality-type">
                        <span className="type-code">{typeCode}</span>
                        <span className="type-name">{typeName}</span>
                      </div>
                      <div className="personality-desc" dangerouslySetInnerHTML={{ __html: typeDesc }}></div>
                    </div>
                  </div>
                </div>

                <div className="sensitivity-wrapper">
                  <div className="sensitivity-section">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>청소 민감도</h2>
                    <div className="sensitivity-value">{sensitivity}%</div>
                    <div className="sensitivity-bar">
                      <div className="sensitivity-fill" style={{ width: `${sensitivity}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mypage-right">
              <div className="mypage-sidecard">
                <div className="card-section-header column">
                  <button
                    className="edit-button"
                    style={{ marginRight: '20px' }}
                    onClick={() => setIsNicknameModalOpen(true)}
                    onMouseEnter={(e) => { e.target.style.background = '#74D3A4'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#8BE2B6'; }}
                  >
                    편집
                  </button>
                  <h2 style={{ textAlign: 'center' }}>회원 정보</h2>
                </div>
                <p><strong>NAME</strong> {userName}</p>
                <p><strong>ID</strong> {userId}</p>

                <hr className="card-divider" />

                <h2 className="section-title" style={{ textAlign: 'center' }}>청소 습관 분석</h2>
                <Link to="/personality/1">청소 성격 유형 테스트 하러 가기</Link>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSensitiveModalOpen(true);
                  }}
                >
                  청소 민감도 설정하기
                </a>

                <hr className="card-divider" />

                <h2 className="section-title" style={{ textAlign: 'center' }}>기타</h2>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsGroupLeaveModalOpen(true);
                  }}
                >
                  그룹 탈퇴
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserLeaveModalOpen(true);
                  }}
                >
                  회원 탈퇴
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  로그아웃
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

            <Modal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        contentStyle={{ width: '360px' }}
      >
        <NicknameModal
          currentNickname={userName}
          onSave={(newName) => {
            setUserName(newName);
            setIsNicknameModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isSensitiveModalOpen}
        onClose={() => setIsSensitiveModalOpen(false)}
        contentStyle={{ width: '350px' }}
      >
        <CleanSensitive
          currentSensitivity={sensitivity}
          onSave={(newSensitivity) => {
            setSensitivity(newSensitivity);
            setIsSensitiveModalOpen(false);
          }}
          onClose={() => setIsSensitiveModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isGroupLeaveModalOpen}
        onClose={() => setIsGroupLeaveModalOpen(false)}
        contentStyle={{ width: '320px' }}
      >
        <GroupLeaveModal
          currentGroup={groupName}
          onClose={() => setIsGroupLeaveModalOpen(false)}
          onLeave={handleGroupLeave}
        />
      </Modal>

      <Modal
        isOpen={isUserLeaveModalOpen}
        onClose={() => setIsUserLeaveModalOpen(false)}
        contentStyle={{ width: '320px' }}
      >
        <UserLeaveModal
          onClose={() => setIsUserLeaveModalOpen(false)}
          onLeave={handleUserLeave}
        />
      </Modal>
    </>
  );
}

export default MyPage;