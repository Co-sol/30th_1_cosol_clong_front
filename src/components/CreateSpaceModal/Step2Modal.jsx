import Modal from "../Modal";

function Step2Modal({
    modalShape,
    shapeDirection,
    setShapeDirection,
    shapeSize,
    setShapeSize,
    onNext,
    onBack,
    isOpen,
    onClose,
    placedShapes,
    editingShapeId,
}) {
    // 10x10 그리드 기반 배치 가능성 검사 함수
    const canPlaceAnywhere = (w, h) => {
        const grid = Array.from({ length: 10 }, () => Array(10).fill(false));
        for (const shape of placedShapes) {
            if (shape.space_id === editingShapeId) continue;

            for (let r = shape.top; r < shape.top + shape.h; r++) {
                for (let c = shape.left; c < shape.left + shape.w; c++) {
                    grid[r][c] = true;
                }
            }
        }

        for (let row = 0; row <= 10 - h; row++) {
            for (let col = 0; col <= 10 - w; col++) {
                let canPlace = true;
                for (let r = 0; r < h; r++) {
                    for (let c = 0; c < w; c++) {
                        if (grid[row + r][col + c]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (!canPlace) break;
                }
                if (canPlace) return true;
            }
        }
        return false;
    };

    // 현재 선택된 방향과 사이즈로 배치 가능한지 검사
    const baseW = modalShape?.w ?? 1;
    const baseH = modalShape?.h ?? 1;

    const targetW =
        shapeDirection === "horizontal" ? baseW * shapeSize : baseH * shapeSize;
    const targetH =
        shapeDirection === "horizontal" ? baseH * shapeSize : baseW * shapeSize;

    const isPlaceable = canPlaceAnywhere(targetW, targetH);

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
                도형 편집하기
            </div>
            <div
                className="modal-shape-preview"
                style={{
                    width: `${50 * (modalShape?.w ?? 1)}px`,
                    height: `${50 * (modalShape?.h ?? 1)}px`,
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
                        checked={shapeDirection === "horizontal"}
                        onChange={() => setShapeDirection("horizontal")}
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
                        checked={shapeDirection === "vertical"}
                        onChange={() => setShapeDirection("vertical")}
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
                    onChange={(e) => setShapeSize(Number(e.target.value))}
                    style={{ "--value": (shapeSize - 1) * 100 }}
                />
                <div className="slider-label">
                    <span>1</span>
                    <span>2</span>
                </div>
            </div>

            {!isPlaceable && (
                <div
                    style={{
                        color: "red",
                        fontSize: "0.85rem",
                        marginTop: 10,
                        textAlign: "center",
                    }}
                >
                    현재 그리드에 배치할 공간이 없어요
                </div>
            )}

            <button
                className="modal-next"
                onClick={onNext}
                disabled={!isPlaceable}
            >
                다음
            </button>
        </Modal>
    );
}

export default Step2Modal;
