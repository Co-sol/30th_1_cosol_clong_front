import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import "../CreateSpaceModal/CreateModal.css";

function Edit3Modal({
  modalShape,
  shapeDirection: initialDirection,
  spaceName: initialName,
  shapeSize: initialSize,
  onNext,
  onBack,
  setPreviewShape,
  isOpen,
  onClose,
}) {
  const [shapeDirection, setShapeDirection] = useState(
    initialDirection || "horizontal"
  );
  const [shapeSize, setShapeSize] = useState(initialSize || 1);
  const [spaceName, setSpaceName] = useState(initialName || "");

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때마다 props로 전달된 값으로 초기화
      setShapeDirection(initialDirection || "horizontal");
      setShapeSize(initialSize || 1);
      setSpaceName(initialName || "");
    }
  }, [isOpen, initialDirection, initialSize, initialName]);

  // 원본 도형 크기 계산
  const originalW =
    modalShape.original_w || modalShape.w / (modalShape.size || 1);
  const originalH =
    modalShape.original_h || modalShape.h / (modalShape.size || 1);

  // 방향에 따라 w, h 결정 (원본 크기 기준)
  let w = originalW;
  let h = originalH;

  const handlePreviewAndNext = () => {
    // 방향에 따른 최종 크기 계산
    let finalW = w;
    let finalH = h;

    if (shapeDirection === "vertical") {
      finalW = h;
      finalH = w;
    }

    finalW *= shapeSize;
    finalH *= shapeSize;

    const previewShape = {
      ...modalShape,
      w: finalW,
      h: finalH,
      name: spaceName,
      type: 0,
      direction: shapeDirection,
    };
    setPreviewShape(previewShape);
    onNext();
  };

  // 미리보기 도형 style 계산 (원본 크기 기준)
  const baseWidth = 70 * w;
  const baseHeight = 70 * h;
  const previewWidth = baseWidth;
  const previewHeight = baseHeight;

  // ratio는 최종 크기로 표시
  const finalW = shapeDirection === "vertical" ? h * shapeSize : w * shapeSize;
  const finalH = shapeDirection === "vertical" ? w * shapeSize : h * shapeSize;
  const ratioW = finalW;
  const ratioH = finalH;

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
        좋아요!
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
        원하는 위치를 클릭하면 도형이 생성돼요
      </div>

      <div
        className="modal-shape-preview"
        style={{
          width: previewWidth,
          height: previewHeight,
          margin: "30px auto 20px",
          background: "#EBFEF4",
          border: "2px solid #8BE2B6",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          whiteSpace: "nowrap",
          overflow: "visible",
          position: "relative",
        }}
      >
        {spaceName}
        <span className="shape-ratio">
          {ratioW}x{ratioH}
        </span>
      </div>

      <button className="modal-next" onClick={handlePreviewAndNext}>
        다음
      </button>
    </Modal>
  );
}

export default Edit3Modal;
