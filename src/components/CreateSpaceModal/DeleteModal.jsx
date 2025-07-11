import Modal from "../Modal";
import "./CreateModal.css";

function DeleteModal({ isOpen, onClose, onConfirm, spaceName }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      overlayStyle={{
        alignItems: "flex-start",
        justifyContent: "center",
      }}
      contentStyle={{
        width: "380px",
        maxWidth: "none",
        minWidth: "auto",
        top: "30vh",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "NotoSansKR-Bold, sans-serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          marginTop: 10,
          marginBottom: 35,
        }}
      >
        정말로 삭제하시겠습니까?
      </div>

      <div
        style={{
          textAlign: "center",
          fontFamily: "'NotoSansKR-Regular', sans-serif",
          marginBottom: 20,
          fontSize: "1rem",
          color: "#1a1a1a",
        }}
      >
        <div>
          <span style={{ color: "#8BE2B6" }}>
            <strong>{spaceName}</strong>
          </span>{" "}
          공간에 포함된 <br />
          모든 리스트도 함께 삭제됩니다.
        </div>
        <div
          style={{
            color: "#787878",
            fontSize: "0.85rem",
            marginTop: 20,
            fontFamily: "NotoSansKR-Regular, sans-serif",
            fontWeight: 400,
          }}
        >
          한번 삭제된 공간과 리스트는 복구할 수 없습니다.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="modal-next"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "30%",
            height: "20%",
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
          onClick={onConfirm}
          onMouseEnter={(e) => {
            e.target.style.background = "#74D3A4";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#8BE2B6";
          }}
        >
          삭제
        </button>
      </div>
    </Modal>
  );
}

export default DeleteModal;
