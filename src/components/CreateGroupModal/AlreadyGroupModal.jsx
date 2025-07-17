import Modal from "../Modal";
const fontStyles = {
  "@font-face": {
    "NotoSansKR-Bold": {
      fontFamily: "NotoSansKR-Bold",
      src: "url('/fonts/NotoSansKR-Bold.ttf') format('truetype')",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    "NotoSansKR-Regular": {
      fontFamily: "NotoSansKR-Regular",
      src: "url('/fonts/NotoSansKR-Regular.ttf') format('truetype')",
      fontWeight: "normal",
      fontStyle: "normal",
    },
  },
};

const AlreadyGroupModal = ({ isOpen, onClose, nickname, email }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'NotoSansKR-Bold', sans-serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          margin: "10px 0",
        }}
      >
        초대할 수 없습니다
      </div>
      <div
        style={{
          fontFamily: "'NotoSansKR-Regular', sans-serif",
          fontWeight: "normal",
          marginBottom: 40,
          fontSize: "1rem",
          color: "#000000",
        }}
      >
        이미 다른 그룹에 소속된 멤버입니다
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
        Clong에서는 한 사람당 하나의 그룹만 참여할 수 있어요
      </div>
    </div>
  </Modal>
);

export default AlreadyGroupModal;
