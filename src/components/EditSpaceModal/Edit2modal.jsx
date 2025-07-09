import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import "../CreateSpaceModal/CreateModal.css";

function Edit2Modal({
  modalShape,
  shapeDirection: initialSpaceDirection,
  setShapeDirection,
  shapeSize: initialShapeSize,
  setShapeSize,
  onNext,
  onBack,
  isOpen,
  onClose,
}) {
  const [shapeDirection, setInternalShapeDirection] = useState(
    initialSpaceDirection || "vertical"
  );
  const [shapeSize, setInternalShapeSize] = useState(initialShapeSize || 1);

  // 미리보기 보정
  const isHorizontal = shapeDirection === "horizontal";
  const baseWidth = modalShape?.w || 1;
  const baseHeight = modalShape?.h || 1;

  const swappedWidth = isHorizontal ? baseHeight : baseWidth;
  const swappedHeight = isHorizontal ? baseWidth : baseHeight;

  const previewWidth =
    (50 * (isHorizontal ? modalShape.h : modalShape.w)) / shapeSize;
  const previewHeight =
    (50 * (isHorizontal ? modalShape.w : modalShape.h)) / shapeSize;

  useEffect(() => {
    if (isOpen) {
      setInternalShapeDirection(initialSpaceDirection || "vertical");
      setInternalShapeSize(initialShapeSize || 1);
    }
  }, [isOpen, initialSpaceDirection, initialShapeSize]);

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
      <button className="modal-back" onClick={onBack}>
        ←
      </button>

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
        도형 편집하기
      </div>
      <div
        className="modal-shape-preview"
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          margin: "5px auto 20px",
          background: "#EBFEF4",
          border: "2px solid #8BE2B6",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        +
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
        <strong>도형의 방향을 선택해주세요</strong>
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
            checked={shapeDirection === "vertical"}
            onChange={() => setInternalShapeDirection("vertical")}
          />
          <span>가로</span>
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
            checked={shapeDirection === "horizontal"}
            onChange={() => setInternalShapeDirection("horizontal")}
          />
          <span>세로</span>
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
        <strong>도형의 크기를 선택해주세요</strong>
      </div>
      <div className="modal-slider-group">
        <input
          type="range"
          className="modal-slider"
          min="1"
          max="2"
          value={shapeSize}
          onChange={(e) => setInternalShapeSize(Number(e.target.value))}
          style={{ "--value": (shapeSize - 1) * 100 }}
        />
        <div className="slider-label">
          <span>1</span>
          <span>2</span>
        </div>
      </div>

      <button
        className="modal-next"
        onClick={() =>
          onNext({
            shape_direction: shapeDirection,
            shape_size: shapeSize,
          })
        }
      >
        다음
      </button>
    </Modal>
  );
}

export default Edit2Modal;
