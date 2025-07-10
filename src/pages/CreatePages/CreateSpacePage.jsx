import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Step1Modal from "../../components/CreateSpaceModal/Step1Modal";
import Step2Modal from "../../components/CreateSpaceModal/Step2Modal";
import Step3Modal from "../../components/CreateSpaceModal/Step3Modal";
import DeleteModal from "../../components/CreateSpaceModal/DeleteModal";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import "./CreateSpacePage.css";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 10;
const GRID_GAP = 0.8;

// 도형 정보 정의
const SHAPES = [
  { id: "shape-1x1", w: 1, h: 1 },
  { id: "shape-2x1", w: 2, h: 1 },
  { id: "shape-3x1", w: 3, h: 1 },
  { id: "shape-4x1", w: 4, h: 1 },
  { id: "shape-3x2", w: 3, h: 2 },
  { id: "shape-4x3", w: 4, h: 3 },
];

const SHAPE_COLORS = [
  "#DFF2DD",
  "#CFF1DA",
  "#BEEFD6",
  "#ADEBCB",
  "#9CE7C1",
  "#8CE3B8",
  "#7CDFAD",
  "#6BDBA3",
  "#5BD799",
  "#4AD38F",
  "#3ACF85",
  "#30C57A",
  "#2CB570",
  "#28A466",
  "#24945C",
];

// 백엔드 연동
const calculateEndCoordinates = (shape) => {
  return {
    end_x: shape.start_x + shape.w,
    end_y: shape.start_y + shape.h,
  };
};

const formatForBackend = (shape) => {
  const endCoords = calculateEndCoordinates(shape);
  return {
    // group_id는 아직 없음
    space_id: shape.space_id,
    space_name: shape.space_name,
    space_type: shape.space_type,
    start_x: shape.start_x,
    start_y: shape.start_y,
    end_x: endCoords.end_x,
    end_y: endCoords.end_y,
  };
};

function CreateSpacePage() {
  // 그리드에 배치된 도형 배열 정보
  const [placedShapes, setPlacedShapes] = useState([]);
  const [nextSpaceId, setNextSpaceId] = useState(0); // 다음 space_id를 위한 카운터
  const [colorIndex, setColorIndex] = useState(0); // 색상 인덱스를 별도로 관리

  const [modalStep, setModalStep] = useState(0);
  const [modalShape, setModalShape] = useState(null); // 선택된 도형 정보
  const [spaceType, setSpaceType] = useState(0);
  const [spaceName, setSpaceName] = useState("");
  const [shapeDirection, setShapeDirection] = useState("horizontal");
  const [shapeSize, setShapeSize] = useState(1); // 도형 크기
  const [pendingShape, setPendingShape] = useState(null); // 실제 배치할 shape (modal3 종료 후)
  const [hoverCell, setHoverCell] = useState(null); // 그리드 패널 - 미리보기
  const [previewShape, setPreviewShape] = useState(null); // modal3에서 사용

  const [deleteShapeId, setDeleteShapeId] = useState(null); // 삭제할 shape_id
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (modalStep === 3 && pendingShape) {
      const { w, h, name } = pendingShape;

      const previewShape = {
        w: Math.max(1, w / shapeSize),
        h: Math.max(1, h / shapeSize),
        ratioW: w,
        ratioH: h,
        name,
      };

      setPreviewShape(previewShape);
    }
  }, [modalStep, pendingShape, shapeSize]);

  // 도형 버튼 클릭 시
  const handleShapeSelect = (shape) => {
    setModalShape(shape);
    setModalStep(1);
    setSpaceType(0);
    setSpaceName("");
    setShapeDirection("horizontal");
    setShapeSize(1);
    setPendingShape(null);
  };

  // step1: 공간 종류 선택 / 공간 이름 입력
  const handleStep1 = () => {
    if (!spaceName) return;
    setModalStep(2);
  };

  // step2: 도형 방향 / 크기 선택
  const handleStep2 = () => {
    let w = modalShape.w;
    let h = modalShape.h;

    if (shapeDirection === "vertical") {
      w = modalShape.h;
      h = modalShape.w;
    }

    const newPending = {
      ...modalShape,
      w: w * shapeSize,
      h: h * shapeSize,
      name: spaceName,
      type: spaceType,
      direction: shapeDirection,
    };

    setPendingShape(newPending);
    setModalStep(3);
  };

  // step3: 위치 선택 안내
  const handleStep3 = () => {
    setModalStep(0);
    setModalShape(null);
  };

  // 뒤로 가기
  const handleBack = () => {
    setModalStep((prev) => Math.max(1, prev - 1));
  };

  // 닫기
  const handleClose = () => {
    setModalStep(0);
    setModalShape(null);
  };

  const renderModal = () => {
    if (!modalStep) return null;

    if (modalStep === 1) {
      return (
        <Step1Modal
          isOpen={!!modalStep}
          onClose={handleClose}
          spaceType={spaceType}
          setSpaceType={setSpaceType}
          spaceName={spaceName}
          setSpaceName={setSpaceName}
          onNext={handleStep1}
        />
      );
    }

    if (modalStep === 2) {
      return (
        <Step2Modal
          isOpen={!!modalStep}
          onClose={handleClose}
          modalShape={modalShape}
          shapeDirection={shapeDirection}
          setShapeDirection={setShapeDirection}
          onNext={handleStep2}
          shapeSize={shapeSize}
          setShapeSize={setShapeSize}
          onBack={handleBack}
        />
      );
    }

    if (modalStep === 3) {
      return (
        <Step3Modal
          isOpen={!!modalStep}
          onClose={handleClose}
          previewShape={previewShape}
          onNext={handleStep3}
          onBack={handleBack}
        />
      );
    }

    return null;
  };

  const renderDeleteModal = () => (
    <DeleteModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={() => {
        setPlacedShapes((prev) =>
          prev.filter((shape) => shape.space_id !== deleteShapeId)
        );
        setShowDeleteModal(false);
        setDeleteShapeId(null);
      }}
      spaceName={
        placedShapes.find((s) => s.space_id === deleteShapeId)?.name || ""
      }
    />
  );

  return (
    <>
      <div className="create-space-bg">
        <Header hideMenu />
        <div className="create-space-content">
          <div className="grid-panel">
            <div className="grid-container">
              <div
                className="grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                  gap: "0.8px",
                }}
              >
                {[...Array(GRID_SIZE * GRID_SIZE)].map((_, idx) => {
                  const row = Math.floor(idx / GRID_SIZE);
                  const col = idx % GRID_SIZE;

                  let isHighlighted = false;
                  if (pendingShape && hoverCell) {
                    const { w, h } = pendingShape;
                    // 미리보기 영역이 placedShapes와 겹치는지 체크
                    let overlap = false;
                    for (const shape of placedShapes) {
                      const { w: pw, h: ph, top, left } = shape;
                      if (
                        row >= hoverCell.row &&
                        row < hoverCell.row + h &&
                        col >= hoverCell.col &&
                        col < hoverCell.col + w
                      ) {
                        if (
                          row >= top &&
                          row < top + ph &&
                          col >= left &&
                          col < left + pw
                        ) {
                          overlap = true;
                          break;
                        }
                      }
                    }
                    // placedShapes와 겹치지 않을 때만 하이라이트
                    if (
                      !overlap &&
                      row >= hoverCell.row &&
                      row < hoverCell.row + h &&
                      col >= hoverCell.col &&
                      col < hoverCell.col + w
                    ) {
                      isHighlighted = true;
                    }
                  }

                  // placedShapes에 포함된 셀인지 확인 및 shape 정보 저장
                  let isPlaced = false;
                  let placedShape = null;
                  for (const shape of placedShapes) {
                    const { w, h, top, left } = shape;
                    if (
                      row >= top &&
                      row < top + h &&
                      col >= left &&
                      col < left + w
                    ) {
                      isPlaced = true;
                      placedShape = shape;
                      break;
                    }
                  }

                  const isTopLeft =
                    isPlaced &&
                    placedShape &&
                    row === placedShape.top &&
                    col === placedShape.left;

                  return (
                    <div
                      key={idx}
                      className={`grid-cell${
                        isHighlighted ? " highlight" : ""
                      }${isPlaced ? " placed" : ""}`}
                      onMouseEnter={() => {
                        if (pendingShape) {
                          setHoverCell({ row, col });
                        }
                      }}
                      onMouseLeave={() => {
                        if (pendingShape) setHoverCell(null);
                      }}
                      onClick={() => {
                        if (
                          pendingShape &&
                          hoverCell &&
                          row === hoverCell.row &&
                          col === hoverCell.col
                        ) {
                          // 그리드 밖으로 나가는지 체크
                          const { w, h } = pendingShape;
                          if (
                            hoverCell.row + h <= GRID_SIZE &&
                            hoverCell.col + w <= GRID_SIZE
                          ) {
                            // 도형 배치 전, placedShapes와 겹치는지 체크
                            let overlap = false;
                            for (const shape of placedShapes) {
                              const { w: pw, h: ph, top, left } = shape;
                              for (let r = 0; r < h; r++) {
                                for (let c = 0; c < w; c++) {
                                  const checkRow = hoverCell.row + r;
                                  const checkCol = hoverCell.col + c;
                                  if (
                                    checkRow >= top &&
                                    checkRow < top + ph &&
                                    checkCol >= left &&
                                    checkCol < left + pw
                                  ) {
                                    overlap = true;
                                    break;
                                  }
                                }
                                if (overlap) break;
                              }
                              if (overlap) break;
                            }
                            if (!overlap) {
                              // 색상 할당
                              const color =
                                SHAPE_COLORS[colorIndex % SHAPE_COLORS.length];
                              // API 연동
                              const newShape = {
                                ...pendingShape,
                                // 백엔드 API 명세서 변수명 (루트 공간)
                                space_id: nextSpaceId,
                                space_name: pendingShape.name,
                                space_type: pendingShape.type,
                                start_x: hoverCell.col,
                                start_y: hoverCell.row,
                                // 기존 UI용 필드
                                top: hoverCell.row,
                                left: hoverCell.col,
                                color,
                              };

                              setPlacedShapes([...placedShapes, newShape]);
                              setNextSpaceId(nextSpaceId + 1);
                              setPendingShape(null);
                              setHoverCell(null);
                              setColorIndex((prevIndex) => prevIndex + 1);
                            }
                          }
                        }
                      }}
                      style={
                        isPlaced
                          ? {
                              border: "none",
                              background: "none",
                              position: "relative",
                              padding: 0,
                            }
                          : {}
                      }
                    >
                      {isTopLeft && placedShape && (
                        <div
                          className="placed-shape"
                          style={{
                            width: `calc(${placedShape.w * 100}% + ${
                              (placedShape.w - 1) * GRID_GAP
                            }px)`,
                            height: `calc(${placedShape.h * 100}% + ${
                              (placedShape.h - 1) * GRID_GAP
                            }px)`,
                            background: placedShape.color || undefined,
                            position: "absolute",
                          }}
                        >
                          {placedShape.name}
                          <FaPencilAlt
                            className="pencil-icon"
                            style={{
                              position: "absolute",
                              top: "6px",
                              right: "6px",
                              width: "15px",
                              height: "15px",
                              color: "#1a1a1a",
                              cursor: "pointer",
                              zIndex: 3,
                            }}
                          />

                          <FaTrashAlt
                            className="trash-icon"
                            style={{
                              position: "absolute",
                              bottom: "6px",
                              right: "6px",
                              width: "15px",
                              height: "15px",
                              color: "#1a1a1a",
                              cursor: "pointer",
                              zIndex: 3,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteShapeId(placedShape.space_id);
                              setShowDeleteModal(true);

                              // setPlacedShapes((prevShapes) =>
                              //   prevShapes.filter(
                              //     (shape) =>
                              //       shape.space_id !== placedShape.space_id
                              //   )
                              // );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shape-panel">
            <div className="shape-panel-inner">
              <div className="shape-panel-title">공간 도형</div>
              <div className="shape-row">
                <ShapeButton shape={SHAPES[0]} onClick={handleShapeSelect} />
                <ShapeButton shape={SHAPES[1]} onClick={handleShapeSelect} />
              </div>
              <div className="shape-row">
                <ShapeButton shape={SHAPES[2]} onClick={handleShapeSelect} />
              </div>
              <div className="shape-row">
                <ShapeButton shape={SHAPES[3]} onClick={handleShapeSelect} />
              </div>
              <div className="shape-row">
                <ShapeButton shape={SHAPES[4]} onClick={handleShapeSelect} />
              </div>
              <div className="shape-row">
                <ShapeButton shape={SHAPES[5]} onClick={handleShapeSelect} />
              </div>
              <button
                className="save-btn"
                onClick={async () => {
                  const backendData = placedShapes.map((shape) =>
                    formatForBackend(shape)
                  );
                  // TODO: 백엔드 API 호출
                  // try {
                  //   await fetch('/api/spaces', {
                  //     method: 'POST',
                  //     headers: { 'Content-Type': 'application/json' },
                  //     body: JSON.stringify(backendData)
                  //   });
                  //   navigate("/groupSpace");
                  // } catch (e) {
                  //   alert("저장에 실패했습니다.");
                  // }
                  // 임시로 바로 이동
                  navigate("/groupSpace");
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </>
  );
}

function ShapeButton({ shape, onClick, direction = "horizontal" }) {
  const w = direction === "vertical" ? shape.h : shape.w;
  const h = direction === "vertical" ? shape.w : shape.h;
  return (
    <button
      className="shape-btn"
      style={{
        width: `${w * 20}%`,
        aspectRatio: `${w} / ${h}`,
        position: "relative",
      }}
      onClick={() => onClick(shape)}
    >
      +
      <span className="shape-ratio">
        {w}x{h}
      </span>
    </button>
  );
}

export default CreateSpacePage;
