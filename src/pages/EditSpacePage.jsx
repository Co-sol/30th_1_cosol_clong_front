import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Step1Modal from "../components/CreateSpaceModal/Step1Modal";
import Step2Modal from "../components/CreateSpaceModal/Step2Modal";
import Step3Modal from "../components/CreateSpaceModal/Step3Modal";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import DeleteModal from "../components/EditSpaceModal/DeleteModal";
import Edit1Modal from "../components/EditSpaceModal/Edit1Modal";
import Edit2Modal from "../components/EditSpaceModal/Edit2Modal";
import Edit3Modal from "../components/EditSpaceModal/Edit3Modal";
import "./CreatePages/CreateSpacePage.css";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 10;
const GRID_GAP = 0.8;

// Mock Data
const MOCK_SPACES_DATA = [
  {
    space_id: 1,
    space_name: "안방",
    space_type: 1,
    start_x: 0,
    start_y: 0,
    width: 1,
    height: 2,
    direction: "vertical",
    size: 1,
  },
  {
    space_id: 2,
    space_name: "부엌",
    space_type: 0,
    start_x: 2,
    start_y: 0,
    width: 3,
    height: 2,
    direction: "horizontal",
    size: 1,
  },
  {
    space_id: 3,
    space_name: "거실",
    space_type: 0,
    start_x: 0,
    start_y: 2,
    width: 6,
    height: 8,
    direction: "vertical",
    size: 2,
  },
];

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

// 백엔드 데이터를 프론트엔드 형식으로 변환
const transformBackendData = (backendData) => {
  return backendData.map((space, index) => ({
    // 백엔드 필드
    space_id: space.space_id,
    space_name: space.space_name,
    space_type: space.space_type,
    start_x: space.start_x,
    start_y: space.start_y,

    // 프론트엔드 UI용 필드
    w: space.width,
    h: space.height,
    top: space.start_y,
    left: space.start_x,
    name: space.space_name,
    type: space.space_type,
    color: SHAPE_COLORS[index % SHAPE_COLORS.length],

    // 기타 필드
    direction: space.direction || "horizontal",
    size: space.size || 1,

    // 원본 도형 정보 (백엔드에서 제공하는 경우)
    original_w: space.original_width || space.width / (space.size || 1),
    original_h: space.original_height || space.height / (space.size || 1),
    original_shape_id: space.original_shape_id,
  }));
};

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
    // 원본 도형 정보 추가
    original_shape_id: shape.original_shape_id,
    original_width: shape.original_w,
    original_height: shape.original_h,
    direction: shape.direction || "horizontal",
    size: shape.size || 1,
  };
};

function EditSpacePage() {
  const [loading, setLoading] = useState(true);
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
  const [pendingShape, setPendingShape] = useState(null); // 실제 배치할 shape
  const [hoverCell, setHoverCell] = useState(null); // 그리드 패널 - 미리보기
  const [previewShape, setPreviewShape] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEdit2Modal, setShowEdit2Modal] = useState(false);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);

  // 편집 폼 데이터 관리
  const [editFormData, setEditFormData] = useState({
    space_name: "",
    space_type: 0,
    shape_direction: "horizontal",
    shape_size: 1,
  });

  const navigate = useNavigate();

  // 백엔드에서 공간 데이터 불러오기
  const loadSpacesData = async () => {
    try {
      // TODO: 실제 백엔드 API 연동 시 주석 해제
      // const response = await fetch('/api/spaces', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // 필요한 경우 인증 헤더 추가
      //     // 'Authorization': `Bearer ${token}`
      //   }
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to fetch spaces data');
      // }
      //
      // const data = await response.json();
      // const transformedData = transformBackendData(data);
      // setPlacedShapes(transformedData);
      // setNextSpaceId(Math.max(...transformedData.map(s => s.space_id), 0) + 1);
      // setColorIndex(transformedData.length);

      // Mock data 사용 (백엔드 연동 전까지)
      const transformedData = transformBackendData(MOCK_SPACES_DATA);
      setPlacedShapes(transformedData);
      setNextSpaceId(
        Math.max(...transformedData.map((s) => s.space_id), 0) + 1
      );
      setColorIndex(transformedData.length);
    } catch (error) {
      console.error("Error loading spaces data:", error);
      // 에러 처리 (사용자에게 알림 등)
    }
  };

  useEffect(() => {
    setLoading(true);
    loadSpacesData().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 2300);
    });
  }, []);

  useEffect(() => {
    if (!pendingShape) {
      setHoverCell(null);
    }
  }, [pendingShape]);

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
    setModalStep(3);

    let w = modalShape.w,
      h = modalShape.h;

    if (shapeDirection === "vertical") {
      w = modalShape.h;
      h = modalShape.w;
    }

    setPendingShape({
      ...modalShape,
      w: w * shapeSize,
      h: h * shapeSize,
      name: spaceName,
      type: spaceType,
      direction: shapeDirection,
    });
  };

  // step3: 위치 선택 안내
  const handleStep3 = () => {
    // 방향에 따라 w, h 결정
    let w = modalShape.w;
    let h = modalShape.h;
    if (shapeDirection === "vertical") {
      w = modalShape.h;
      h = modalShape.w;
    }
    const newPendingShape = {
      ...modalShape,
      w: w * shapeSize,
      h: h * shapeSize,
      name: spaceName,
      type: spaceType,
      direction: shapeDirection,
    };
    setPendingShape(newPendingShape);

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

  // 저장 함수 수정
  const handleSave = async () => {
    try {
      const backendData = placedShapes.map((shape) => ({
        space_id: shape.space_id,
        space_name: shape.space_name,
        space_type: shape.space_type,
        start_x: shape.start_x,
        start_y: shape.start_y,
        width: shape.w,
        height: shape.h,
        direction: shape.direction || "horizontal",
        size: shape.size || 1,
      }));

      // TODO: 실제 백엔드 API 연동 시 주석 해제
      // const response = await fetch('/api/spaces', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(backendData)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to save spaces data');
      // }

      console.log("Saving data:", backendData);
      navigate("/groupSpace");
    } catch (error) {
      console.error("Error saving spaces data:", error);
      alert("저장에 실패했습니다.");
    }
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
          modalShape={modalShape}
          shapeDirection={shapeDirection}
          spaceName={spaceName}
          shapeSize={shapeSize}
          setPreviewShape={setPreviewShape}
          onNext={handleStep3}
          onBack={handleBack}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div className="create-space-bg">
        <Header />
        <div className="create-space-content">
          <div className="grid-panel" style={{ position: "relative" }}>
            {loading && (
              <div
                className="grid-loading-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "#ffffff",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <div className="spinner" />
                <div style={{ marginTop: 16, fontSize: "1.1rem" }}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditTarget(placedShape);
                              // 편집 시작 시 현재 데이터로 폼 초기화 (원본 정보 사용)
                              setEditFormData({
                                space_name: placedShape.space_name || "",
                                space_type: placedShape.space_type ?? 0,
                                shape_direction:
                                  placedShape.direction || "horizontal",
                                shape_size: placedShape.size || 1,
                              });
                              setShowEditModal(true);
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
                              setDeleteTarget(placedShape);
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
              <button className="save-btn" onClick={handleSave}>
                저장하기
              </button>
            </div>
          </div>
        </div>
        {renderModal()}
        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            spaceName={deleteTarget?.space_name}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              setPlacedShapes((prev) =>
                prev.filter((s) => s.space_id !== deleteTarget.space_id)
              );
              setShowDeleteModal(false);
            }}
          />
        )}
        {showEditModal && (
          <Edit1Modal
            isOpen={showEditModal}
            spaceName={editFormData.space_name || editTarget?.space_name}
            spaceType={editFormData.space_type ?? editTarget?.space_type}
            onClose={() => {
              setShowEditModal(false);
              // 모달이 닫힐 때 폼 데이터 초기화
              setEditFormData({
                space_name: "",
                space_type: 0,
                shape_direction: "horizontal",
                shape_size: 1,
              });
            }}
            onNext={(updated) => {
              setEditFormData((prev) => ({
                ...prev,
                space_name: updated.space_name,
                space_type: updated.space_type,
              }));
              setShowEditModal(false);
              setShowEdit2Modal(true);
            }}
          />
        )}
        {showEdit2Modal && (
          <Edit2Modal
            isOpen={showEdit2Modal}
            modalShape={editTarget}
            shapeDirection={
              editFormData.shape_direction || editTarget?.direction
            }
            shapeSize={editFormData.shape_size || editTarget?.size}
            onBack={() => {
              setShowEdit2Modal(false);
              setShowEditModal(true);
            }}
            onClose={() => {
              setShowEdit2Modal(false);
              // 모달이 닫힐 때 폼 데이터 초기화
              setEditFormData({
                space_name: "",
                space_type: 0,
                shape_direction: "horizontal",
                shape_size: 1,
              });
            }}
            onNext={(updated) => {
              setEditFormData((prev) => ({
                ...prev,
                shape_direction: updated.shape_direction,
                shape_size: updated.shape_size,
                original_w: updated.original_w,
                original_h: updated.original_h,
                direction: updated.direction,
              }));
              setShowEdit2Modal(false);
              setShowEdit3Modal(true);
            }}
          />
        )}
        {showEdit3Modal && (
          <Edit3Modal
            isOpen={showEdit3Modal}
            modalShape={editTarget}
            shapeDirection={
              editFormData.shape_direction || editTarget?.direction
            }
            shapeSize={editFormData.shape_size || editTarget?.size}
            spaceName={editFormData.space_name || editTarget?.space_name}
            original_w={editFormData.original_w || editTarget?.original_w}
            original_h={editFormData.original_h || editTarget?.original_h}
            direction={editFormData.direction || editTarget?.direction}
            onBack={() => {
              setShowEdit3Modal(false);
              setShowEdit2Modal(true);
            }}
            onClose={() => {
              setShowEdit3Modal(false);
              // 모달이 닫힐 때 폼 데이터 초기화
              setEditFormData({
                space_name: "",
                space_type: 0,
                shape_direction: "horizontal",
                shape_size: 1,
              });
            }}
            onNext={() => {
              // 최종 저장 시 모든 수정된 데이터를 적용 (원본 정보 사용)
              const originalW =
                editTarget.original_w || editTarget.w / (editTarget.size || 1);
              const originalH =
                editTarget.original_h || editTarget.h / (editTarget.size || 1);

              // 방향에 따른 최종 크기 계산
              let finalW = originalW;
              let finalH = originalH;

              if (editFormData.shape_direction === "vertical") {
                finalW = originalH;
                finalH = originalW;
              }

              finalW *= editFormData.shape_size;
              finalH *= editFormData.shape_size;

              setPlacedShapes((prev) =>
                prev.map((shape) =>
                  shape.space_id === editTarget.space_id
                    ? {
                        ...shape,
                        space_name: editFormData.space_name,
                        name: editFormData.space_name,
                        space_type: editFormData.space_type,
                        type: editFormData.space_type,
                        shape_direction: editFormData.shape_direction,
                        direction: editFormData.shape_direction,
                        shape_size: editFormData.shape_size,
                        size: editFormData.shape_size,
                        w: finalW,
                        h: finalH,
                        // 원본 정보 유지
                        original_w: originalW,
                        original_h: originalH,
                      }
                    : shape
                )
              );
              setShowEdit3Modal(false);
              // 편집 완료 후 폼 데이터 초기화
              setEditFormData({
                space_name: "",
                space_type: 0,
                shape_direction: "horizontal",
                shape_size: 1,
              });
            }}
          />
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

export default EditSpacePage;
