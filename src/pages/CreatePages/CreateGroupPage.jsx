import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroupPage.css";
import InvitationModal from "../../components/CreateGroupModal/InvitationModal";
import MemberLimitModal from "../../components/CreateGroupModal/MemberLimitModal";
import AlreadyGroupModal from "../../components/CreateGroupModal/AlreadyGroupModal";
import MemberDeleteModal from "../../components/CreateGroupModal/MemberDeleteModal";
import axios from "axios";

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

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMemberEmail, setDeleteMemberEmail] = useState("");

  const [inviteNickname, setInviteNickname] = useState(""); // 실제 닉네임

  // 편집 모드 여부 판단
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn("accessToken이 없습니다. 로그인 상태를 확인하세요.");
        return;
      }

      try {
        const res = await axios.get("/api/mypage/info/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data?.success && res.data.data) {
          const userInfo = res.data.data;
          const isInGroup = res.data.data.IsInGroup;

          setCurrentUserEmail(userInfo.email);
          setCurrentUserNickname(userInfo.name);

          if (isInGroup) {
            setIsEditMode(true);
            fetchGroupData(userInfo.email);
          } else {
            setIsEditMode(false);
          }
        }
      } catch (error) {
        console.error("로그인 유저 정보 조회 중 오류 발생", error);
      }
    };

    // 그룹 데이터 불러오기
    const fetchGroupData = async (userEmail) => {
      try {
        const token = localStorage.getItem("accessToken");

        // 1. 그룹명 / 그룹 규칙
        const groupRes = await axios.get("/api/groups/group-info/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const groupData = groupRes.data.data;
        setGroupName(groupData.group_name);
        setGroupRule(groupData.group_rule);

        // 2. 멤버
        const memberRes = await axios.get("/api/groups/member-info/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const memberData = memberRes.data.data;

        // 로그인 유저 제외하고, members 에 추가하기
        const filteredMembers = memberData.filter((m) => m.email !== userEmail);

        const mapped = filteredMembers.map((m) => ({
          email: m.email,
          nickname: m.name,
        }));

        setMembers(mapped);
      } catch (error) {
        console.error("❌ 그룹 정보 불러오기 실패:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = groupName.trim() && groupRule.trim();

  const handleAddMember = async () => {
    const trimmedInput = memberInput.trim();

    // 1. 이메일 형식 검사
    if (!validateEmail(trimmedInput)) {
      setEmailMessage("올바른 이메일 형식을 입력해주세요.");
      setMemberInput("");
      return;
    }

    // 2. 본인 이메일 입력 방지
    if (trimmedInput === currentUserEmail) {
      setEmailMessage("본인의 이메일은 입력할 수 없습니다.");
      setMemberInput("");
      return;
    }

    // 3. 멤버 수 제한
    if (members.length >= 3) {
      setIsLimitModalOpen(true);
      setMemberInput("");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        "/api/groups/check-user/",
        {
          email: trimmedInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success && res.data.data?.UserInfo) {
        const user = res.data.data.UserInfo;
        const isInGroup = res.data.data.IsInGroup;

        if (isInGroup) {
          // 이미 그룹에 속한 유저
          setAlreadyGroupInfo({ nickname: user.name, email: user.email });
          setIsAlreadyGroupModalOpen(true);
        } else {
          // 초대 가능한 유저
          setInviteEmail(user.email);
          setInviteNickname(user.name);
          setIsModalOpen(true);
        }
      } else {
        // 가입되지 않은 이메일
        console.warn("[실패] 응답은 왔지만 UserInfo 없음");
        setEmailMessage("아직 가입하지 않은 이메일입니다.");
      }
    } catch (error) {
      console.error("유저 조회 실패:", error);
      setEmailMessage("아직 가입하지 않은 이메일입니다.");
    } finally {
      setMemberInput("");
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
    setDeleteMemberEmail(email);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setMembers(members.filter((m) => m.email !== deleteMemberEmail));
    setShowDeleteModal(false);
    setDeleteMemberEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    // 1. 멤버 배열 재조립 (본인 추가), 이메일 추출
    const memberEmails = [currentUserEmail, ...members.map((m) => m.email)];

    // 2. 그룹 생성
    const requestBody = {
      group_name: groupName,
      group_rule: groupRule,
      members: memberEmails,
    };

    try {
      const res = isEditMode
        ? await axios.patch("/api/groups/modify/", requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        : await axios.post("/api/groups/create/", requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

      if (res.data.success) {
        if (isEditMode) {
          navigate("/groupHome");
        } else {
          navigate("/tutorial");
        }
      }
    } catch (error) {
      console.error(
        isEditMode ? "❌ 그룹 수정 실패:" : "❌ 그룹 생성 실패:",
        error
      );
    }
  };

  return (
    <>
      {isEditMode ? <Header /> : <Header hideMenu />}

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
                  onChange={(e) => {
                    setMemberInput(e.target.value);
                    setEmailMessage("");
                  }}
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

              {emailMessage && (
                <div className=" create-group-error-message">
                  {emailMessage}{" "}
                </div>
              )}

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
              {isEditMode ? "수정하기" : "생성하기"}
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
          setInviteNickname("");
        }}
        nickname={inviteNickname}
        email={inviteEmail}
        onInvite={handleInvite}
      />
      <MemberLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        ownerNickname={currentUserNickname}
        members={members}
      />
      <AlreadyGroupModal
        isOpen={isAlreadyGroupModalOpen}
        onClose={() => setIsAlreadyGroupModalOpen(false)}
        nickname={alreadyGroupInfo.nickname}
        email={alreadyGroupInfo.email}
      />
      <MemberDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteMemberEmail("");
        }}
        onConfirm={handleConfirmDelete}
        memberName={
          members.find((m) => m.email === deleteMemberEmail)?.nickname || ""
        }
      />
    </>
  );
}

export default CreateGroupPage;
