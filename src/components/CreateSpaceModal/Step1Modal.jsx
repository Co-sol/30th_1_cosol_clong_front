import Modal from "../Modal";
import "./CreateModal.css";

function Step1Modal({
  spaceType,
  setSpaceType,
  spaceName,
  setSpaceName,
  onNext,
  isOpen,
  onClose,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentStyle={{
        width: "400px",
        maxWidth: "none", // 최대 너비 제한 해제
        minWidth: "auto", // 최소 너비 제거
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
          <strong>이 공간은 어떤 공간인가요?</strong>
        </div>
        <div
          className="modal-radio-group"
          style={{
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            gap: "20px",
            marginBottom: "40px",
            justifyContent: "center",
          }}
        >
          <label
            style={{
              fontFamily: "NotoSansKR-Regular, sans-serif",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              checked={spaceType === 0}
              onChange={() => setSpaceType(0)}
            />
            <span>공용 공간</span>
          </label>

          <label
            style={{
              fontFamily: "NotoSansKR-Regular, sans-serif",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              checked={spaceType === 1}
              onChange={() => setSpaceType(1)}
            />
            <span>개인 공간</span>
          </label>
        </div>

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
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          placeholder="예: 거실"
        />
      </div>

      <button className="modal-next" onClick={onNext} disabled={!spaceName}>
        다음
      </button>
    </Modal>
  );
}

export default Step1Modal;
