import Select from "react-select";
import Modal from "../Modal";
import "./CreateModal.css";

function OwnerSelectionModal({
  isOpen,
  onClose,
  members,
  selectedOwner,
  setSelectedOwner,
  onNext,
  onBack,
}) {
  const options = members.map((member) => ({
    value: member.email,
    label: `${member.nickname} (${member.email})`,
  }));

  const selectedOption = options.find((opt) => opt.value === selectedOwner);
  console.log("🍉 selectedOption 계산 결과:", selectedOption);

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
        소유자 선택하기
      </div>

      <button className="modal-back" onClick={onBack}>
        ←
      </button>

      <div
        className="modal-section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          className="modal-label"
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "15px",
          }}
        >
          <strong>개인 공간의 소유자를 선택해 주세요</strong>
        </div>

        <div style={{ width: "100%" }}>
          {console.log("🟢 OwnerSelectionModal 렌더")}
          {console.log("👉 selectedOwner prop:", selectedOwner)}
          {console.log("👉 members prop:", members)}

          <Select
            options={options}
            value={selectedOption}
            // value={
            //   typeof selectedOwner === "string"
            //     ? options.find(
            //         (opt) => opt.value.trim() === selectedOwner.trim()
            //       )
            //     : null
            // }
            onChange={(option) => setSelectedOwner(option.value)}
            placeholder="선택하세요"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: 15,
                padding: "4px 8px",
                fontSize: "1rem",
                borderColor: "#ccc",
                boxShadow: "none",
                "&:hover": { borderColor: "#8be2b6" },
              }),
              menu: (base) => ({
                ...base,
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#9CE7C1"
                  : state.isFocused
                  ? "#f0f0f0"
                  : "white",
                color: "black",
                fontSize: "1rem",
                padding: "8px 12px",
              }),
            }}
          />
        </div>
      </div>

      <button className="modal-next" onClick={onNext} disabled={!selectedOwner}>
        다음
      </button>
    </Modal>
  );
}

export default OwnerSelectionModal;
