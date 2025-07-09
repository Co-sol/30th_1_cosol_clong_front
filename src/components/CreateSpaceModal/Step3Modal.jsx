import Modal from "../Modal";
import "./CreateModal.css";

function Step3Modal({ previewShape, onNext, onBack, isOpen, onClose }) {
  if (!previewShape) return null;
  // // 방향에 따라 w, h 결정
  // let w = modalShape.w;
  // let h = modalShape.h;
  // if (shapeDirection === "vertical") {
  //   w = modalShape.h;
  //   h = modalShape.w;
  // }

  // const handlePreviewAndNext = () => {
  //   const previewShape = {
  //     ...modalShape,
  //     w: w * shapeSize,
  //     h: h * shapeSize,
  //     name: spaceName,
  //     type: 0,
  //     direction: shapeDirection,
  //   };
  //   setPreviewShape(previewShape);
  //   onNext();
  // };

  const { w, h, name, ratioW, ratioH } = previewShape;

  const previewWidth = 70 * w;
  const previewHeight = 70 * h;

  // const handlePreviewAndNext = () => {
  //   setPreviewShape(pendingShape); // preview 상태 저장
  //   onNext(); // 다음 단계로 진행 (도형 배치 준비 완료)
  // };

  // const ratioW = w * shapeSize;
  // const ratioH = h * shapeSize;

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
        {name}
        <span className="shape-ratio">
          {ratioW}x{ratioH}
        </span>
      </div>

      <button className="modal-next" onClick={onNext}>
        다음
      </button>
    </Modal>
  );
}

export default Step3Modal;
