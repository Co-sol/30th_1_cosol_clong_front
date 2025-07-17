import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroupPage.css";
import InvitationModal from "../../components/CreateGroupModal/InvitationModal";
import MemberLimitModal from "../../components/CreateGroupModal/MemberLimitModal";
import AlreadyGroupModal from "../../components/CreateGroupModal/AlreadyGroupModal";

function CreateGroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupRule, setGroupRule] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isAlreadyGroupModalOpen, setIsAlreadyGroupModalOpen] = useState(false);
  const [alreadyGroupInfo, setAlreadyGroupInfo] = useState({
    nickname: "",
    email: "",
  });

  const [currentUserEmail, setCurrentUserEmail] = useState("solux1@gmail.com");
  const [currentUserNickname, setCurrentUserNickname] = useState("solux1");

  // 편집 모드 여부 판단
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // 로그인 유저 정보 불러오기 (localStorage)
    /*
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    setCurrentUserEmail(parsed.email);     
    setCurrentUserNickname(parsed.name);   
  }
  */

    const mockEmail = "solux1@gmail.com";
    const mockName = "solux1";
    setCurrentUserEmail(mockEmail);
    setCurrentUserNickname(mockName);

    // 그룹 데이터 불러오기
    async function fetchGroupData() {
      try {
        // api 연동
        // const res = await fetch("/api/group");
        // if (!res.ok) throw new Error("그룹 없음");
        // const data = await res.json();

        // const data = {
        //   groupName: "Clong's home",
        //   groupRule:
        //     "1. 설거지는 돌아가면서\n2. 화장실 청소는 일주일마다\n3. 청소 실패 시마다 3,000원",
        //   members: [
        //     { nickname: "solux1", email: "solux1@gmail.com" },
        //     { nickname: "solux2", email: "solux2@gmail.com" },
        //     { nickname: "solux3", email: "solux3@gmail.com" },
        //   ],
        // };

        setGroupName(data.groupName);
        setGroupRule(data.groupRule);

        // 현재 로그인 이메일을 기준으로 멤버 목록 필터링
        const visibleMembers = data.members.filter(
          (member) => member.email !== mockEmail // 추후 currentUserEmail로 교체
        );
        setMembers(visibleMembers);

        setIsEditMode(true);
      } catch (e) {
        setIsEditMode(false);
      }
    }

    fetchGroupData();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddMember = () => {
    const trimmedInput = memberInput.trim();

    // 이미 추가된 멤버(중복) 체크
    if (
      members.some((m) => m.email === trimmedInput) ||
      trimmedInput === currentUserEmail
    ) {
      const nickname = trimmedInput.split("@")[0];
      setAlreadyGroupInfo({ nickname, email: trimmedInput });
      setIsAlreadyGroupModalOpen(true);
      setMemberInput("");
      return;
    }

    // 이메일 형식 검사 추가
    if (!validateEmail(trimmedInput)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      setMemberInput("");
      return;
    }

    if (members.some((m) => m.email === trimmedInput)) {
      // 중복일 때 모달 오픈
      const nickname = trimmedInput.split("@")[0];
      setAlreadyGroupInfo({ nickname, email: trimmedInput });
      setIsAlreadyGroupModalOpen(true);
      setMemberInput("");
      return;
    }
    // 멤버 수 제한
    if (members.length >= 3) {
      setIsLimitModalOpen(true);
      setMemberInput("");
      return;
    }
    // 공백 제한, 중복 제한
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setInviteEmail(memberInput.trim());
      setIsModalOpen(true);
    }
  };

  const handleInvite = () => {
    if (inviteEmail && !members.some((m) => m.email === inviteEmail)) {
      const nickname = inviteEmail.split("@")[0];
      setMembers([...members, { nickname, email: inviteEmail }]);
    }
    setIsModalOpen(false);
    setMemberInput("");
    setInviteEmail("");
  };

  // 멤버 삭제
  const handleRemoveMember = (email) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 현재 유저 객체 만들기
    const currentUser = {
      nickname: currentUserNickname,
      email: currentUserEmail,
    };

    // 2. 전체 멤버 리스트 재조립
    const fullMembers = [currentUser, ...members];

    // 3. 데이터 구성
    const groupData = {
      groupName,
      groupRule,
      members: fullMembers,
      ownerNickname: currentUserNickname,
    };

    console.log("임시 저장 데이터:", groupData);
    if (isEditMode) {
      navigate("/groupHome");
    } else {
      navigate("/tutorial");
    }
  };

  return (
    <>
<<<<<<< Updated upstream:src/pages/CreatePages/CreateGroupPage.jsx
      {isEditMode ? <Header /> : <Header hideMenu />}

=======
      <Header />
>>>>>>> Stashed changes:src/pages/CreateGroupPage.jsx
      <main className="create-group-bg">
        <div className="create-group-card">
          <h2 className="create-group-title">
            {isEditMode ? "그룹 정보 수정하기" : "새 그룹 만들기"}
          </h2>

          <form className="create-group-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label className="form-label">1. 그룹명</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                className="form-name"
                placeholder="그룹명을 입력해주세요."
              />
            </div>
            <div className="form-section">
              <label className="form-label">2. 그룹 규칙</label>
              <textarea
                value={groupRule}
                onChange={(e) => setGroupRule(e.target.value)}
                rows={4}
                className="form-rule"
                placeholder="그룹 규칙을 입력해주세요."
              />
            </div>
            <div className="form-section">
              <label className="form-label">3. 멤버 추가</label>
              <div className="member-input-row">
                <input
                  type="email"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  className="form-email"
                  placeholder="이메일을 입력해주세요."
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="invite-btn"
                >
                  초대
                </button>
              </div>
              <div className="member-list">
                {members.map((member) => (
                  <div className="member-chip" key={member.email}>
                    {member.nickname}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.email)}
                      className="remove-member-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
<<<<<<< Updated upstream:src/pages/CreatePages/CreateGroupPage.jsx
            <button
              type="submit"
              className="create-btn"
              disabled={!isFormValid}
            >
              {isEditMode ? "수정하기" : "생성하기"}
=======
            <button type="submit" className="create-btn">
              생성하기
>>>>>>> Stashed changes:src/pages/CreateGroupPage.jsx
            </button>
          </form>
        </div>
      </main>
      <InvitationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMemberInput("");
          setInviteEmail("");
        }}
        nickname={inviteEmail ? inviteEmail.split("@")[0] : ""}
        email={inviteEmail}
        onInvite={handleInvite}
      />
      <MemberLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        ownerNickname="solux"
        members={members}
      />
      <AlreadyGroupModal
        isOpen={isAlreadyGroupModalOpen}
        onClose={() => setIsAlreadyGroupModalOpen(false)}
        nickname={alreadyGroupInfo.nickname}
        email={alreadyGroupInfo.email}
      />
    </>
  );
}

export default CreateGroupPage;
