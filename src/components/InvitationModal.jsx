import Modal from "./Modal";

const InvitationModal = ({ isOpen, onClose, nickname, email, onInvite }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "NotoSansKR-Bold, sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            marginTop: 10,
            marginBottom: 50,
          }}
        >
          멤버를 초대하시겠습니까?
        </div>
        <div
          style={{
            textAlign: "left",
            marginLeft: 15,
            marginBottom: 15,
            fontFamily: "NotoSansKR-Regular, sans-serif",
            fontWeight: 400,
          }}
        >
          <div style={{ marginBottom: 25 }}>
            <span style={{ fontWeight: "bold" }}>닉네임 &nbsp;:&nbsp;</span>
            <span style={{ marginLeft: 20 }}>{nickname}</span>
          </div>
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontWeight: "bold" }}>이메일 &nbsp;:&nbsp;</span>
            <span style={{ marginLeft: 20 }}>{email}</span>
          </div>
        </div>
        <div
          style={{
            color: "#787878",
            fontSize: "0.85rem",
            marginBottom: 30,
            fontFamily: "NotoSansKR-Regular, sans-serif",
            fontWeight: 400,
          }}
        >
          입력하신 정보가 맞는지 다시 확인해주세요.
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            onClick={onInvite}
            onMouseEnter={(e) => {
              e.target.style.background = "#74D3A4";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#8BE2B6";
            }}
            style={{
              background: "#8be2b6",
              color: "#fff",
              border: "none",
              borderRadius: 15,
              padding: "10px 20px",
              fontFamily: "NotoSansKR-Bold, sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            초대하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvitationModal;
