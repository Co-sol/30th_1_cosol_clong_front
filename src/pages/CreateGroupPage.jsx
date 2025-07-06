import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroupPage.css";
import InvitationModal from "../components/InvitationModal";
import MemberLimitModal from "../components/MemberLimitModal";
import AlreadyGroupModal from "../components/AlreadyGroupModal";

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = groupName.trim() && groupRule.trim();

  const handleAddMember = () => {
    // 이미 추가된 멤버(중복) 체크
    const trimmedInput = memberInput.trim();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력 데이터 수집
    const groupData = {
      groupName: groupName,
      groupRule: groupRule,
      members: members,
      ownerNickname: "solux", // 임시 고정값
    };

    navigate("/tutorial");
  };

  return (
    <>
      <Header hideMenu />
      <main className="create-group-bg">
        <div className="create-group-card">
          <h2 className="create-group-title">새 그룹 만들기</h2>
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
            <button
              type="submit"
              className="create-btn"
              disabled={!isFormValid}
            >
              생성하기
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
