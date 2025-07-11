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

const formatForBackend = (shape) => {
  return {
    space_id: shape.space_id,
    space_name: shape.space_name,
    space_type: shape.space_type,
    start_x: shape.start_x,
    start_y: shape.start_y,
    width: shape.w,
    height: shape.h,
    direction: shape.direction,
    size: shape.shapeSize,
  };
};

const parseFromBackend = (spaceData) => {
  // direction에 따라 기본 크기 계산
  let baseW, baseH;
  if (spaceData.direction === "vertical") {
    baseW = spaceData.height / spaceData.size; // 실제 세로를 기본 가로로
    baseH = spaceData.width / spaceData.size; // 실제 가로를 기본 세로로
  } else {
    baseW = spaceData.width / spaceData.size; // 실제 가로를 기본 가로로
    baseH = spaceData.height / spaceData.size; // 실제 세로를 기본 세로로
  }

  return {
    space_id: spaceData.space_id,
    space_name: spaceData.space_name,
    name: spaceData.space_name,
    space_type: spaceData.space_type,
    start_x: spaceData.start_x,
    start_y: spaceData.start_y,
    top: spaceData.start_y,
    left: spaceData.start_x,
    w: spaceData.width,
    h: spaceData.height,
    direction: spaceData.direction,
    shapeSize: spaceData.size,
    color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
    originalW: baseW, // 기본 크기 저장
    originalH: baseH, // 기본 크기 저장
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

  const [editingShapeId, setEditingShapeId] = useState(null); // 수정 중인 도형 ID
  const [shouldReplaceShapeId, setShouldReplaceShapeId] = useState(null); // 실제 교체할 ID

  const navigate = useNavigate();

  useEffect(() => {
    // TODO: 백엔드에서 초기 도형 데이터를 불러오는 로직
    async function fetchInitialShapes() {
      try {
        // const response = await fetch("/api/spaces");
        // const data = await response.json();

        // const parsedShapes = data.map((item) => ({
        //   space_id: item.space_id,
        //   space_name: item.space_name,
        //   space_type: item.space_type,
        //   start_x: item.start_x,
        //   start_y: item.start_y,
        //   top: item.start_y,
        //   left: item.start_x,
        //   w: item.end_x - item.start_x,
        //   h: item.end_y - item.start_y,
        //   color: SHAPE_COLORS[item.space_id % SHAPE_COLORS.length],
        //   originalW: item.end_x - item.start_x,
        //   originalH: item.end_y - item.start_y,
        //   shapeSize: 1, // 기본값 또는 백에서 받는 값으로 수정 가능
        // }));

        // setPlacedShapes(parsedShapes);
        // setNextSpaceId(
        //   parsedShapes.length > 0
        //     ? Math.max(...parsedShapes.map((s) => s.space_id)) + 1
        //     : 0
        // );

        const mockData = [
          {
            space_id: 0,
            space_name: "거실",
            space_type: 0,
            start_x: 1,
            start_y: 1,
            width: 2,
            height: 2,
            direction: "horizontal",
            size: 2,
          },
          {
            space_id: 1,
            space_name: "서재",
            space_type: 0,
            start_x: 3,
            start_y: 1,
            width: 3,
            height: 2,
            direction: "horizontal",
            size: 1,
          },
          {
            space_id: 2,
            space_name: "안방",
            space_type: 1,
            start_x: 4,
            start_y: 4,
            width: 3,
            height: 4,
            direction: "vertical",
            size: 1,
          },
        ];

        // const response = await fetch("/api/spaces");
        // const data = await response.json();
        const parsedShapes = mockData.map(parseFromBackend);
        setPlacedShapes(parsedShapes);
        setNextSpaceId(
          parsedShapes.length > 0
            ? Math.max(...parsedShapes.map((s) => s.space_id)) + 1
            : 0
        );
      } catch (error) {
        console.error("초기 도형 데이터를 불러오는 데 실패했습니다:", error);
      }
    }

    fetchInitialShapes();
  }, []);

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

    // 상태 초기화
    setSpaceType(0);
    setSpaceName("");
    setShapeDirection("horizontal");
    setShapeSize(1);
    setPendingShape(null);
    setPreviewShape(null);
    setEditingShapeId(null);
    setShouldReplaceShapeId(null);
  };

  // step1: 공간 종류 선택 / 공간 이름 입력
  const handleStep1 = () => {
    if (!spaceName) return;
    setModalStep(2);
  };

  // step2: 도형 방향 / 크기 선택
  const handleStep2 = () => {
    if (!modalShape) {
      console.error("[handleStep2] modalShape가 null입니다.");
      return;
    }

    let w, h;

    if (shapeDirection === "vertical") {
      w = modalShape.h;
      h = modalShape.w;
    } else {
      w = modalShape.w;
      h = modalShape.h;
    }

    const newPending = {
      ...modalShape,
      w: w * shapeSize,
      h: h * shapeSize,
      name: spaceName,
      type: spaceType,
      direction: shapeDirection,
      originalW: modalShape.w,
      originalH: modalShape.h,
    };

    setPendingShape(newPending);
    setModalStep(3);
  };

  // step3: 위치 선택 안내
  const handleStep3 = () => {
    if (editingShapeId !== null) {
      setShouldReplaceShapeId(editingShapeId); // 교체 시작
    }
    setModalStep(0);
    setModalShape(null);
  };

  // 뒤로 가기
  const handleBack = () => {
    if (modalStep === 3) {
      setPreviewShape(null);
      setPendingShape(null);
      setHoverCell(null);
    }
    setModalStep((prev) => Math.max(1, prev - 1));
  };

  // 닫기
  const handleClose = () => {
    setModalStep(0);
    setModalShape(null);
    setPendingShape(null);
    setPreviewShape(null);
    setHoverCell(null);
    setEditingShapeId(null);
    setShouldReplaceShapeId(null);
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
          placedShapes={placedShapes}
          editingShapeId={editingShapeId}
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
                      if (shape.space_id === shouldReplaceShapeId) continue;

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
                    if (shape.space_id === shouldReplaceShapeId) continue;

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
                          !pendingShape ||
                          !hoverCell ||
                          !pendingShape.w ||
                          !pendingShape.h ||
                          modalStep !== 0
                        )
                          return;
                        // 보호 코드
                        if (
                          pendingShape &&
                          hoverCell &&
                          row === hoverCell.row &&
                          col === hoverCell.col
                        ) {
                          const isEditing =
                            shouldReplaceShapeId !== null &&
                            editingShapeId !== null &&
                            editingShapeId === shouldReplaceShapeId;

                          const assignedSpaceId = isEditing
                            ? shouldReplaceShapeId
                            : nextSpaceId;

                          console.log("[디버깅] isEditing:", isEditing);
                          console.log(
                            "[디버깅] assignedSpaceId:",
                            assignedSpaceId
                          );
                          console.log(
                            "[디버깅] shouldReplaceShapeId:",
                            shouldReplaceShapeId
                          );
                          console.log(
                            "[디버깅] editingShapeId:",
                            editingShapeId
                          );
                          // 그리드 밖으로 나가는지 체크
                          const { w, h } = pendingShape;
                          if (
                            hoverCell.row + h <= GRID_SIZE &&
                            hoverCell.col + w <= GRID_SIZE
                          ) {
                            // 도형 배치 전, placedShapes와 겹치는지 체크
                            let overlap = false;
                            for (const shape of placedShapes) {
                              if (
                                Number(shape.space_id) ===
                                Number(shouldReplaceShapeId)
                              )
                                continue;

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
                            console.log("[디버깅] overlap 상태:", overlap);
                            if (!overlap) {
                              console.log("[디버깅] 배치 실행됨");
                              // 색상 할당
                              const color =
                                SHAPE_COLORS[
                                  Math.floor(
                                    Math.random() * SHAPE_COLORS.length
                                  )
                                ];

                              // ✅ 1. 수정 모드 여부 판단
                              const isEditing =
                                shouldReplaceShapeId !== null &&
                                editingShapeId !== null &&
                                editingShapeId === shouldReplaceShapeId;

                              // ✅ 2. 고유 ID 할당
                              const assignedSpaceId = isEditing
                                ? shouldReplaceShapeId // 기존 도형이면 ID 유지
                                : nextSpaceId; // 새 도형이면 새로운 ID 부여

                              // ✅ 3. 도형 객체 생성
                              const newShape = {
                                ...pendingShape,
                                space_id: assignedSpaceId,
                                space_name: pendingShape.name,
                                space_type: pendingShape.type,
                                direction: pendingShape.direction,
                                shapeSize: shapeSize,
                                start_x: hoverCell.col,
                                start_y: hoverCell.row,
                                top: hoverCell.row,
                                left: hoverCell.col,
                                color,
                                originalW: pendingShape.originalW,
                                originalH: pendingShape.originalH,
                                shapeSize: shapeSize,
                              };

                              // ✅ 4. 도형 상태 업데이트
                              if (isEditing) {
                                setPlacedShapes((prev) =>
                                  prev
                                    .filter(
                                      (shape) =>
                                        shape.space_id !== assignedSpaceId
                                    )
                                    .concat(newShape)
                                );
                                setEditingShapeId(null);
                                setShouldReplaceShapeId(null);
                              } else {
                                setPlacedShapes([...placedShapes, newShape]);
                                setNextSpaceId(nextSpaceId + 1);
                              }

                              // ✅ 5. 상태 초기화
                              setPendingShape(null);
                              setPreviewShape(null);
                              setHoverCell(null);
                              setColorIndex((prev) => prev + 1);
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingShapeId(placedShape.space_id); // 현재 수정 중인 도형
                              setSpaceName(placedShape.name);
                              setSpaceType(placedShape.space_type);
                              setShapeDirection(placedShape.direction);
                              setShapeSize(placedShape.shapeSize);

                              // [NEW] 올바른 도형을 SHAPES에서 찾아 modalShape으로 세팅
                              const baseShape = SHAPES.find(
                                (s) =>
                                  s.w === placedShape.originalW && // baseW 대신 w 사용
                                  s.h === placedShape.originalH // baseH 대신 h 사용
                              );
                              //   (s) =>
                              //     s.baseW === placedShape.originalW &&
                              //     s.baseH === placedShape.originalH
                              // );

                              // setModalShape(baseShape); // 항상 base 형태로 넘겨줌

                              if (baseShape) {
                                setModalShape(baseShape);
                              } else {
                                // SHAPES에 없는 경우 fallback
                                setModalShape({
                                  w: placedShape.originalW,
                                  h: placedShape.originalH,
                                });
                              }

                              // // 미리보기에 direction 반영
                              // const isVertical =
                              //   placedShape.direction === "vertical";
                              // setModalShape({
                              //   w: isVertical
                              //     ? placedShape.originalH
                              //     : placedShape.originalW,
                              //   h: isVertical
                              //     ? placedShape.originalW
                              //     : placedShape.originalH,
                              // });

                              // 상태 초기화
                              setPendingShape(null);
                              setPreviewShape(null);
                              setShouldReplaceShapeId(null);
                              setModalStep(1);
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
