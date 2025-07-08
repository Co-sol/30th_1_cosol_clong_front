const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    background: "#fff",
    borderRadius: "16px",
    padding: "35px 40px",
    width: "20vw",
    minWidth: "280px",
    maxWidth: "50vw",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#888",
    fontFamily: "NotoSansKR-Regular, sans-serif",
    fontWeight: 400,
  },
};

const Modal = ({
  isOpen,
  onClose,
  children,

  // modal 하드 코딩 때매 외부 파일에서 css 변경 불가라 매게변수 넣어줌 (이러면 밖에서도 Modal css 변경 가능)
  overlayStyle,
  contentStyle,
  closeStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ ...styles.overlay, ...overlayStyle }} onClick={onClose}>
      <div
        style={{ ...styles.content, ...contentStyle }}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={{ ...styles.close, ...closeStyle }} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
