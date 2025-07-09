import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import "../CreateSpaceModal/CreateModal.css";

function Edit3Modal({
  modalShape,
  shapeDirection: initialDirection,
  spaceName: initialName,
  shapeSize: initialSize,
  original_w,
  original_h,
  direction,
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

  const originalW =
    original_w ||
    modalShape.original_w ||
    modalShape.w / (modalShape.size || 1);
  const originalH =
    original_h ||
    modalShape.original_h ||
    modalShape.h / (modalShape.size || 1);

  let w = originalW;
  let h = originalH;

  if (direction && direction !== shapeDirection) {
    [w, h] = [h, w];
  }

  if (shapeDirection === "vertical") {
    w = originalH;
    h = originalW;
  } else {
    w = originalW;
    h = originalH;
  }

  const handlePreviewAndNext = () => {
    const finalW = w * shapeSize;
    const finalH = h * shapeSize;

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

  const ratioW = w * shapeSize;
  const ratioH = h * shapeSize;

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
