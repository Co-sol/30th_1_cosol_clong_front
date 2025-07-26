import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Step1Modal from "../../components/CreateSpaceModal/Step1Modal";
import Step2Modal from "../../components/CreateSpaceModal/Step2Modal";
import Step3Modal from "../../components/CreateSpaceModal/Step3Modal";
import DeleteModal from "../../components/CreateSpaceModal/DeleteModal";
import OwnerSelectionModal from "../../components/CreateSpaceModal/OwnerSelectionModal";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import "./CreateSpacePage.css";
import { useNavigate } from "react-router-dom";
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
  return {
    space_name: shape.space_name,
    space_type: shape.space_type,
    start_x: shape.start_x,
    start_y: shape.start_y,
    width: shape.w,
    height: shape.h,
    direction: shape.direction,
    size: shape.shapeSize,
    owner_email: shape.ownerEmail || null,
  };
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
    space_id: data.space_id,
    space_name: data.space_name,
    name: data.space_name,
    space_type: data.space_type,
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
    owner_email: data.owner_email || null,
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

  // 저장 시점 기준, 백엔드에서 받은 도형 목록
  const [originalShapes, setOriginalShapes] = useState([]);

  const [isSaved, setIsSaved] = useState(false);
  const editMode = placedShapes.length > 0 && isSaved;
  const [isSaving, setIsSaving] = useState(false); // 공간 데이터 저장하는 중
  const [isLoading, setIsLoading] = useState(true); // 공간 데이터 불러오는 중
  const [minLoadingDone, setMinLoadingDone] = useState(false); // 최소 2초

  // owner 선택 추가
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false); // 모달 열기 여부
  const [ownerEmail, setOwnerEmail] = useState(""); // 선택된 owner
  const [groupMembers, setGroupMembers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // 1.5초 타이머 시작
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 1500);

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
          const parsedShapes = res.data.data.map(parseFromBackend);
          // GET 성공 후에
          setOriginalShapes(parsedShapes);

          setPlacedShapes(parsedShapes);

          if (parsedShapes.length > 0) {
            setIsSaved(true);
          }

          setNextSpaceId(
            parsedShapes.length > 0
              ? Math.max(...parsedShapes.map((s) => s.space_id)) + 1
              : 0
          );
        } else {
          setPlacedShapes([]);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialShapes();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get("/api/groups/member-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const simplified = res.data.data.map((member) => ({
            email: member.email,
            nickname: member.name,
          }));
          setGroupMembers(simplified);
        }
      })
      .catch((err) => {
        console.error("❌ 그룹 멤버 불러오기 실패:", err);
      });
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
    setOwnerEmail("");
  };

  // 중복 공간명 제한
  const isDuplicateSpaceName = (name) => {
    // 편집 모드일 때는 현재 편집 중인 도형은 제외
    const shapesToCheck = placedShapes.filter(
      (shape) => shape.space_id !== editingShapeId
    );
    return shapesToCheck.some((shape) => shape.name === name);
  };

  // step1: 공간 종류 선택 / 공간 이름 입력
  const handleStep1 = () => {
    if (!spaceName) return;

    if (spaceType === 1) {
      setModalStep(0);
      setIsOwnerModalOpen(true);
    } else {
      setModalStep(2);
    }
  };

  // owner 선택
  const handleOwnerSelected = () => {
    if (!ownerEmail) return;
    setIsOwnerModalOpen(false);
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
      name: spaceName,
      type: spaceType,
      direction: shapeDirection,
      originalW: modalShape.w,
      originalH: modalShape.h,
      ownerEmail,
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
      setModalStep(2);
    } else if (modalStep === 2) {
      if (spaceType === 1) {
        // 개인 공간이면 step1이 아니라 owner로
        setModalStep(0);
        setIsOwnerModalOpen(true);
      } else {
        setModalStep(1);
      }
    } else {
      setModalStep((prev) => Math.max(1, prev - 1));
    }
  };

  // const handleBack = () => {
  //   if (modalStep === 3) {
  //     setPreviewShape(null);
  //     setPendingShape(null);
  //     setHoverCell(null);
  //   }
  //   setModalStep((prev) => Math.max(1, prev - 1));
  // };

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
          isDuplicate={isDuplicateSpaceName(spaceName)}
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
          ownerEmail={ownerEmail}
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
      onConfirm={async () => {
        const token = localStorage.getItem("accessToken");
        const space_id = deleteShapeId;

        if (!token) {
          alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
          return;
        }

        // ⚠️ 프론트에서 먼저 제거
        setPlacedShapes((prev) =>
          prev.filter((shape) => shape.space_id !== space_id)
        );
        setShowDeleteModal(false);
        setDeleteShapeId(null);

        try {
          await axios.delete(`/api/spaces/${space_id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {}
      }}
      spaceName={
        placedShapes.find((s) => s.space_id === deleteShapeId)?.name || ""
      }
    />
  );

  return (
    <>
      <div className="create-space-bg">
        <Header hideMenu={!editMode} />

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
                            : nextSpaceId;

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

                              const match = groupMembers.find(
                                (m) =>
                                  m.email.trim().toLowerCase() ===
                                  (placedShape.owner_email || "")
                                    .trim()
                                    .toLowerCase()
                              );

                              if (match) {
                                setOwnerEmail(match.email);
                              } else {
                                setOwnerEmail("");
                              }

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
                  const token = localStorage.getItem("accessToken");
                  if (!token) {
                    alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                    return;
                  }

                  setIsSaving(true);

                  // 저장할 때
                  const existingShapes = placedShapes.filter((s) =>
                    originalShapes.some((o) => o.space_id === s.space_id)
                  );
                  const newShapes = placedShapes.filter(
                    (s) =>
                      !originalShapes.some((o) => o.space_id === s.space_id)
                  );

                  try {
                    // ✅ 1. 새 도형 POST
                    if (newShapes.length > 0) {
                      const postData = newShapes.map((shape) =>
                        formatForBackend(shape)
                      );

                      const res = await axios.post(
                        "/api/spaces/create/",
                        postData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      if (
                        res.data?.success &&
                        Array.isArray(res.data.data?.root)
                      ) {
                        const returned = res.data.data.root;
                        const updated = placedShapes.map((shape) => {
                          const match = returned.find(
                            (s) => s.space_name === shape.space_name
                          );
                          return match
                            ? { ...shape, space_id: match.space_id }
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
                        `/api/spaces/${shape.space_id}/`,
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
        {isOwnerModalOpen && (
          <OwnerSelectionModal
            isOpen={isOwnerModalOpen}
            onClose={() => setIsOwnerModalOpen(false)}
            members={groupMembers}
            selectedOwner={ownerEmail}
            setSelectedOwner={setOwnerEmail}
            onNext={handleOwnerSelected}
            onBack={() => {
              setIsOwnerModalOpen(false);
              setModalStep(1); // Step1Modal 다시 띄우기
            }}
          />
        )}

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
