import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import ItemStep1Modal from "../../components/CreateSpaceModal/ItemStep1Modal";
import ItemStep2Modal from "../../components/CreateSpaceModal/ItemStep2Modal";
import Step3Modal from "../../components/CreateSpaceModal/Step3Modal";
import ItemDeleteModal from "../../components/CreateSpaceModal/ItemDeleteModal";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import "./CreateSpacePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
];

const formatForBackend = (shape) => {
  const base = {
    item_name: shape.item_name,
    start_x: shape.start_x,
    start_y: shape.start_y,
    width: shape.w,
    height: shape.h,
    direction: shape.direction,
    size: shape.shapeSize,
  };

  if (shape.parent_space_id) {
    base.parent_space_id = shape.parent_space_id;
  }

  return base;
};

const parseFromBackend = (data) => {
  // direction에 따라 기본 크기 계산
  let baseW, baseH;
  if (data.direction === "vertical") {
    baseW = data.height / data.size;
    baseH = data.width / data.size;
  } else {
    baseW = data.width / data.size;
    baseH = data.height / data.size;
  }

  return {
    item_id: data.item_id,
    item_name: data.item_name,
    name: data.item_name,
    parent_space_id: data.parent_space_id,
    start_x: data.start_x,
    start_y: data.start_y,
    top: data.start_y,
    left: data.start_x,
    w: data.width,
    h: data.height,
    direction: data.direction,
    shapeSize: data.size,
    color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
    originalW: baseW,
    originalH: baseH,
  };
};

function CreateSpacePage() {
  // 그리드에 배치된 도형 배열 정보
  const [placedShapes, setPlacedShapes] = useState([]);
  const [nextItemId, setNextItemId] = useState(0); // 다음 item_id를 위한 카운터
  const [colorIndex, setColorIndex] = useState(0); // 색상 인덱스를 별도로 관리

  const [modalStep, setModalStep] = useState(0);
  const [modalShape, setModalShape] = useState(null); // 선택된 도형 정보

  const [itemName, setItemName] = useState("");
  const [shapeDirection, setShapeDirection] = useState("horizontal");
  const [shapeSize, setShapeSize] = useState(1); // 도형 크기
  const [pendingShape, setPendingShape] = useState(null); // 실제 배치할 shape (modal3 종료 후)
  const [hoverCell, setHoverCell] = useState(null); // 그리드 패널 - 미리보기
  const [previewShape, setPreviewShape] = useState(null); // modal3에서 사용

  const [deleteShapeId, setDeleteShapeId] = useState(null); // 삭제할 item_id
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingShapeId, setEditingShapeId] = useState(null); // 수정 중인 도형 ID
  const [shouldReplaceShapeId, setShouldReplaceShapeId] = useState(null); // 실제 교체할 ID

  // 저장 시점 기준, 백엔드에서 받은 도형 목록
  const [originalShapes, setOriginalShapes] = useState([]);

  const [isSaved, setIsSaved] = useState(false);
  // const editMode = placedShapes.length > 0 && isSaved;
  const [isSaving, setIsSaving] = useState(false); // 공간 데이터 저장하는 중
  const [isLoading, setIsLoading] = useState(true); // 공간 데이터 불러오는 중
  const [minLoadingDone, setMinLoadingDone] = useState(false); // 최소 2초

  const navigate = useNavigate();
  const location = useLocation();
  const space_id = location.state?.spaceId;

  useEffect(() => {
    // 1초 타이머 시작
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 1000);

    async function fetchInitialShapes() {
      setIsLoading(true);
      setMinLoadingDone(false);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn("accessToken이 없습니다. 로그인 상태를 확인하세요.");
        return;
      }

      try {
        const res = await axios.get("/api/spaces/info/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
          const allSpaces = res.data.data;

          // 🔍 전달받은 parent_SpaceId와 일치하는 공간 찾기
          const targetSpace = allSpaces.find(
            (space) => space.space_id === Number(space_id)
          );

          if (targetSpace && Array.isArray(targetSpace.items)) {
            // ✅ 해당 공간 안의 items만 변환해서 placedShapes에 세팅
            const parsed = targetSpace.items.map(parseFromBackend);
            setOriginalShapes(parsed);
            setPlacedShapes(parsed);

            setNextItemId(
              parsed.length > 0
                ? Math.max(...parsed.map((s) => s.item_id)) + 1
                : 0
            );
            setIsSaved(true);
          } else {
            setOriginalShapes([]);
            setPlacedShapes([]);
          }
        } else {
          setOriginalShapes([]);
          setPlacedShapes([]);
        }
      } catch (error) {
        console.error("❌ 공간 정보 조회 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialShapes();

    return () => clearTimeout(timer);
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
    setItemName("");
    setShapeDirection("horizontal");
    setShapeSize(1);
    setPendingShape(null);
    setPreviewShape(null);
    setEditingShapeId(null);
    setShouldReplaceShapeId(null);
  };

  // 중복 공간명 제한
  const isDuplicateItemName = (name) => {
    // 편집 모드일 때는 현재 편집 중인 도형은 제외
    const shapesToCheck = placedShapes.filter(
      (shape) => shape.item_id !== editingShapeId
    );
    return shapesToCheck.some((shape) => shape.name === name);
  };

  // step1: 공간 종류 선택 / 공간 이름 입력
  const handleStep1 = () => {
    if (!itemName) return;
    setModalStep(2);
  };

  // step2: 도형 방향 / 크기 선택
  const handleStep2 = () => {
    if (!modalShape) {
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
      name: itemName,
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
      setShouldReplaceShapeId(editingShapeId);
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
        <ItemStep1Modal
          isOpen={!!modalStep}
          onClose={handleClose}
          itemName={itemName}
          setItemName={setItemName}
          onNext={handleStep1}
          isDuplicate={isDuplicateItemName(itemName)}
        />
      );
    }

    if (modalStep === 2) {
      return (
        <ItemStep2Modal
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
    <ItemDeleteModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={async () => {
        const token = localStorage.getItem("accessToken");
        const item_id = deleteShapeId;

        if (!token) {
          alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
          return;
        }

        // ⚠️ 프론트에서 먼저 제거
        setPlacedShapes((prev) =>
          prev.filter((shape) => shape.item_id !== deleteShapeId)
        );
        setShowDeleteModal(false);
        setDeleteShapeId(null);

        try {
          await axios.delete(`/api/spaces/items/${item_id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {}
      }}
      itemName={
        placedShapes.find((s) => s.item_id === deleteShapeId)?.name || ""
      }
    />
  );

  return (
    <>
      <div className="create-space-bg">
        <Header />

        <div className="create-space-content">
          <div className="grid-panel">
            {(isLoading || !minLoadingDone) && (
              <div className="grid-loading-overlay">
                <div className="grid-loading-spinner"></div>
                <div className="grid-loading-message">
                  공간 정보를 불러오고 있습니다 ...
                </div>
              </div>
            )}

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
                      if (shape.item_id === shouldReplaceShapeId) continue;

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
                    if (shape.item_id === shouldReplaceShapeId) continue;

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
                          setHoverCell({
                            row,
                            col,
                          });
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
                            : nextItemId;

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
                                Number(shape.item_id) ===
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

                            if (!overlap) {
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
                              const assignedItemId = isEditing
                                ? shouldReplaceShapeId // 기존 도형이면 ID 유지
                                : nextItemId; // 새 도형이면 새로운 ID 부여

                              // ✅ 3. 도형 객체 생성
                              const newShape = {
                                ...pendingShape,
                                item_id: assignedItemId,
                                item_name: pendingShape.name,
                                parent_space_id: space_id,
                                direction: pendingShape.direction,
                                shapeSize: shapeSize,
                                start_x: hoverCell.col,
                                start_y: hoverCell.row,
                                top: hoverCell.row,
                                left: hoverCell.col,
                                color,
                                originalW: pendingShape.originalW,
                                originalH: pendingShape.originalH,
                              };

                              // ✅ 4. 도형 상태 업데이트
                              if (isEditing) {
                                setPlacedShapes((prev) =>
                                  prev
                                    .filter(
                                      (shape) =>
                                        shape.item_id !== assignedItemId
                                    )
                                    .concat(newShape)
                                );
                                setEditingShapeId(null);
                                setShouldReplaceShapeId(null);
                              } else {
                                setPlacedShapes([...placedShapes, newShape]);
                                setNextItemId(nextItemId + 1);
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

                              setEditingShapeId(placedShape.item_id); // 현재 수정 중인 도형
                              setItemName(placedShape.name);
                              setShapeDirection(placedShape.direction);
                              setShapeSize(placedShape.shapeSize);

                              // 올바른 도형을 SHAPES에서 찾아 modalShape으로 세팅
                              const baseShape = SHAPES.find(
                                (s) =>
                                  s.w === placedShape.originalW &&
                                  s.h === placedShape.originalH
                              );

                              if (baseShape) {
                                setModalShape(baseShape);
                              } else {
                                // SHAPES에 없는 경우 fallback
                                setModalShape({
                                  w: placedShape.originalW,
                                  h: placedShape.originalH,
                                });
                              }

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
                            onClick={async (e) => {
                              e.stopPropagation();
                              setDeleteShapeId(placedShape.item_id);
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
                  const token = localStorage.getItem("accessToken");
                  if (!token) {
                    alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                    return;
                  }

                  setIsSaving(true);

                  // 저장할 때
                  const existingShapes = placedShapes.filter((s) =>
                    originalShapes.some((o) => o.item_id === s.item_id)
                  );
                  const newShapes = placedShapes.filter(
                    (s) => !originalShapes.some((o) => o.item_id === s.item_id)
                  );

                  try {
                    // ✅ 1. 새 도형 POST
                    if (newShapes.length > 0) {
                      const postData = newShapes.map((shape) =>
                        formatForBackend(shape)
                      );

                      const res = await axios.post(
                        `/api/spaces/items/${space_id}/create/`,
                        postData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      // if (
                      //   res.data?.success &&
                      //   Array.isArray(res.data.data?.items)
                      // ) {
                      //   const returned = res.data.data.items;
                      //   const updated = placedShapes.map((shape) => {
                      //     const match = returned.find(
                      //       (s) =>
                      //         s.item_name === shape.item_name &&
                      //         s.start_x === shape.start_x &&
                      //         s.start_y === shape.start_y
                      //     );
                      //     return match
                      //       ? { ...shape, item_id: match.item_id }
                      //       : shape;
                      //   });
                      //   setPlacedShapes(updated);
                      // } else {

                      // 수정된 코드
                      if (
                        res.data?.success &&
                        Array.isArray(res.data.data?.items)
                      ) {
                        const returned = res.data.data.items;

                        // CreateSpacePage와 동일한 패턴으로 수정
                        const updated = placedShapes.map((shape) => {
                          const match = returned.find(
                            (s) => s.item_name === shape.item_name
                          );
                          return match
                            ? { ...shape, item_id: match.item_id }
                            : shape;
                        });
                        setPlacedShapes(updated);
                      } else {
                        throw new Error("새 공간 저장 실패");
                      }
                    }

                    // ✅ 2. 기존 도형 PATCH
                    for (const shape of existingShapes) {
                      const patchData = formatForBackend(shape);

                      await axios.patch(
                        `/api/spaces/items/${shape.item_id}/`,
                        patchData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    }

                    setIsSaved(true);
                    navigate("/groupSpace");
                  } catch (error) {
                    console.error("❌ 공간 저장 중 오류 발생:", error);
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
        {renderModal()}

        {renderDeleteModal()}

        {isSaving && (
          <div className="save-overlay">
            <div className="save-spinner"></div>
            <div className="save-message">
              잠시만 기다려주세요 <br />
              공간 정보를 저장 중입니다 ...
            </div>
          </div>
        )}
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
