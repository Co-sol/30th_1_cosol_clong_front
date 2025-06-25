import Modal from "./Modal";

const MemberLimitModal = ({ isOpen, onClose, members, ownerNickname }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: "1.2rem", margin: "10px 0" }}>
        그룹 인원이 가득 찼어요
      </div>
      <div style={{ marginBottom: 40, fontSize: "1rem", color: "#000000" }}>
        이미 4명이 모두 참여 중이에요
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          justifyContent: "center",
          marginBottom: 20,
          width: "100%",
        }}
      >
        {/* 그룹장 닉네임 */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 16,
            padding: "6px 18px",
            fontWeight: 500,
            flex: "0 0 calc(50% - 6px)",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {ownerNickname}
        </div>
        {/* 멤버 닉네임 */}
        {members.map((m) => (
          <div
            key={m.email}
            style={{
              background: "#f5f5f5",
              borderRadius: 16,
              padding: "6px 18px",
              fontWeight: 500,
              flex: "0 0 calc(50% - 6px)",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {m.nickname}
          </div>
        ))}
      </div>
      <div
        style={{
          color: "#b0b0b0",
          fontSize: "0.75rem",
          marginTop: 10,
        }}
      >
        Clong에서는 한 그룹당 최대 4명까지 참여할 수 있어요
      </div>
    </div>
  </Modal>
);

export default MemberLimitModal;
