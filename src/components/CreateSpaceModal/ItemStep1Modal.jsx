import Modal from "../Modal";
import "./CreateModal.css";

function ItemStep1Modal({
  spaceName,
  setSpaceName,
  onNext,
  isOpen,
  onClose,
  isDuplicate,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentStyle={{
        width: "400px",
        maxWidth: "none",
        minWidth: "auto",
      }}
    >
      <div
        className="modal-title"
        style={{
          fontFamily: "NotoSansKR-Bold, sans-serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        도형을 선택했어요!
      </div>
      <div
        className="modal-section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="modal-label"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "15px",
          }}
        >
          <strong>공간의 이름을 입력해주세요</strong>
        </div>
        <input
          className="modal-input"
          style={{
            marginBottom: "20px",
          }}
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          placeholder="예: 침대"
        />
      </div>

      {isDuplicate && spaceName && (
        <div
          style={{
            color: "red",
            fontSize: "0.85rem",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          이미 존재하는 공간명입니다
        </div>
      )}

      <button
        className="modal-next"
        onClick={onNext}
        disabled={!spaceName || isDuplicate}
      >
        다음
      </button>
    </Modal>
  );
}

export default ItemStep1Modal;
