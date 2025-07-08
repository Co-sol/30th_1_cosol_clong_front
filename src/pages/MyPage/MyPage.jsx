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

  const handleLogout = () => {
    // 로그인 정보 삭제 (예시로 localStorage 사용)
    localStorage.removeItem('token'); // 필요에 따라 키 이름 수정
    navigate('/'); // 첫 화면으로 이동
  };
  useEffect(() => {
    const resultTextMap = {
      CRSL: {
        title: "✨정리 요정형",
        description:
          "청소를 완벽하게 해내는 정돈 마스터인 당신!</br>체계적인 루틴과 함께 팀워크까지 겸비한 리더형이에요. ✨",
      },
      CRSI: {
        title: "🧽말없는 실천가형",
        description:
          "항상 깔끔하고 계획적으로 움직이는 당신!</br>리더 역할보다는 혼자서 조용히 청소하는 걸 선호해요. 🧽",
      },
      CRQL: {
        title: "🧠빠른 해결사형",
        description:
          "빠르고 효율적인 정리를 좋아하는 당신!</br>상황에 딱 맞는 최적의 청소 방식을 찾아내요. 🧠",
      },
      CRQI: {
        title: "🧺센스 정리러형",
        description:
          "눈치가 빠르고, 상황 판단에 능한 당신!</br>자신만의 실용적인 방식으로 청소를 해나가요. 🧺",
      },
      CASL: {
        title: "🧹게으른 정리러형",
        description:
          "평소 청소를 잘 하지 않는 당신!</br>하지만, 한 번 시작하면 체계적으로 청소를 해내는 반전 매력의 소유자에요. 🧹",
      },
      CASI: {
        title: "🪣방치적 질서러형",
        description:
          "스스로 먼저 청소하지 않는 당신!</br>하지만, 누군가가 요청한다면 누구보다 열심히 청소해요. 🪣",
      },
      CAQL: {
        title: "🪠순간 정리 마스터형",
        description:
          "급할 땐 누구보다 청소 속도가 빨라지는 당신!</br>빠른 수습에 능숙해요. 🪠",
      },
      CAQI: {
        title: "😶위장 깔끔러형",
        description:
          "겉보기엔 완벽하게 깔끔한 당신!</br>하지만, 청소 완료의 기준은 남과 다를 수 있어요. 😶",
      },
      DRSL: {
        title: "🌀폭주형 청소 리더",
        description:
          "청소를 몰아서 한 번에 해치우는 당신!<br>작정하면 폭풍처럼 공간을 리셋해요. 🌀",
      },
      DRSI: {
        title: "🔄비정기적 실천가형",
        description:
          "정해진 루틴 없이 필요할 때만 나서는 당신!<br>평소엔 안 해도 할 때는 확실하게 하는 스타일이에요. 🔄",
      },
      DRQL: {
        title: "⚡효율 정리꾼형",
        description:
          "미루다가도 한 번 시작하면 똑 부러지는 당신!<br>빠르고 효율적으로 마무리하는 정리꾼이에요. ⚡",
      },
      DRQI: {
        title: "🤔대응형 정리꾼",
        description:
          "눈치 빠르게 상황을 파악하는 당신!<br>팀의 분위기에 맞춰 유연하게 청소해요. 🤔",
      },
      DASL: {
        title: "💡계획형 게으름러",
        description:
          "완벽한 청소 계획을 세우는 당신!<br>하지만, 실행은 조금 미루는 스타일이에요. 💡",
      },
      DASI: {
        title: "😮방치형 관망러",
        description:
          "정리의 필요성을 알고 있는 당신!<br>하지만, 누군가 먼저 시작해주길 바라는 마음이 커요. 😮",
      },
      DAQL: {
        title: "🧊냉정한 미룸러",
        description:
          "“나중에 할게요” 가 자연스러운 당신!<br>그래도 속으로는 청소 계획이 잡혀 있는 타입이에요. 🧊",
      },
      DAQI: {
        title: "🫠카오스형",
        description:
          "미래의 나에게 모든 걸 맡기는 당신!</br>그래도 혼돈 속에서 자신만의 질서는 유지하고 있어요. 🫠",
      },
    };

    const mockTypeCode = 'CRSL';
    const result = resultTextMap[mockTypeCode] || {
      title: '알 수 없음',
      description: '결과 데이터를 불러올 수 없습니다.',
    };

    setTypeCode(mockTypeCode);
    setTypeName(result.title);
    setTypeDesc(result.description);
    setTypeDate('2025.05.01');

    const mockActiveBadges = ['청소 응애'];
    const allBadges = [
      { src: '/assets/badge1.png', label: '청소 응애' },
      { src: '/assets/badge2.png', label: '인간 청소기' },
      { src: '/assets/badge3.png', label: '청소 러버' },
      { src: '/assets/badge4.png', label: '청소 올데이' },
      { src: '/assets/badge5.png', label: '청소의 왕' },
    ];
    const updated = allBadges.map((badge) => ({
      ...badge,
      active: mockActiveBadges.includes(badge.label),
    }));
    setBadges(updated);

    setGroupName("Clong's home");
    setGroupCreatedAt('2025.05.22');
    setGroupMembers(['solux', 'A', 'sook']);

    setSensitivity(70);
    setUserName('크롱이');
    setUserId('cosol@sookmyung.ac.kr');
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

      <Modal isOpen={isNicknameModalOpen} onClose={() => setIsNicknameModalOpen(false)}>
        <NicknameModal
          currentNickname={userName}
          onSave={(newName) => {
            setUserName(newName);
            setIsNicknameModalOpen(false);
          }}
        />
      </Modal>

      <Modal isOpen={isSensitiveModalOpen} onClose={() => setIsSensitiveModalOpen(false)}>
        <CleanSensitive
          currentSensitivity={sensitivity}
          onSave={(newSensitivity) => {
            setSensitivity(newSensitivity);
            setIsSensitiveModalOpen(false);
          }}
          onClose={() => setIsSensitiveModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isGroupLeaveModalOpen} onClose={() => setIsGroupLeaveModalOpen(false)}>
        <GroupLeaveModal
          currentGroup={groupName}
          onClose={() => setIsGroupLeaveModalOpen(false)}
          onLeave={handleGroupLeave}
        />
      </Modal>

      <Modal isOpen={isUserLeaveModalOpen} onClose={() => setIsUserLeaveModalOpen(false)}>
        <UserLeaveModal
          onClose={() => setIsUserLeaveModalOpen(false)}
          onLeave={handleUserLeave}
        />
      </Modal>
    </>
  );
}

export default MyPage;