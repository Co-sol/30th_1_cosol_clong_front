import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import "../CreateSpaceModal/CreateModal.css";

function Edit1Modal({
  isOpen,
  spaceName: initialSpaceName,
  spaceType: initialSpaceType,
  onClose,
  onNext,
}) {
  const [spaceName, setSpaceName] = useState(initialSpaceName || "");
  const [spaceType, setSpaceType] = useState(initialSpaceType ?? 0);

  useEffect(() => {
    if (isOpen) {
      setSpaceName(initialSpaceName || "");
      setSpaceType(initialSpaceType);
    }
  }, [isOpen, initialSpaceName, initialSpaceType]);

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
        공간 정보 수정
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

      <button
        className="modal-next"
        onClick={() => onNext({ space_name: spaceName, space_type: spaceType })}
        disabled={!spaceName}
      >
        다음
      </button>
    </Modal>
  );
}

export default Edit1Modal;
