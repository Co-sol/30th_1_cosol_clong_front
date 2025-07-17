import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";

const CreatedSpace = ({ cellSize, selectedData }) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData, placeData } = useContext(toCleanStateContext);

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);

    const CELL_SIZE = cellSize;
    const GRID_SIZE = 10;
    const GRID_GAP = 1;

    return (
        <div className="SpaceStructure">
            <div
                className="grid-wrapper"
                style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: `${GRID_GAP}px`,
                    width: `${
                        GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                    }px`,
                    height: `${
                        GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                    }px`,
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                }}
            >
                {/* 배경 격자 */}
                {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
                    <div
                        className="background_grid"
                        key={i}
                        style={{
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                ))}

                {/* 도형 렌더링 */}
                {spaces.map((space) => {
                    return (
                        <button
                            key={space.space_id}
                            className={
                                selectedData?.name === space.space_name
                                    ? "place_block_active"
                                    : "place_block"
                            }
                            style={{
                                position: "absolute",
                                left: `${
                                    space.start_x * (CELL_SIZE + GRID_GAP)
                                }px`,
                                top: `${
                                    space.start_y * (CELL_SIZE + GRID_GAP)
                                }px`,
                                width: `${
                                    space.width * CELL_SIZE +
                                    (space.width - 1) * GRID_GAP
                                }px`,
                                height: `${
                                    space.height * CELL_SIZE +
                                    (space.height - 1) * GRID_GAP
                                }px`,
                                border: "none",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1,
                            }}
                        >
                            {space.space_name}
                        </button>
                    );
                })}

                {/* 경고 이미지 */}
                {checkListData.map((item, idx) => {
                    const targetSpace = spaces.find(
                        (space) =>
                            (space.space_name === item.place ||
                                space.space_name === item.parentPlace) &&
                            !item.wait
                    );

                    if (!targetSpace) return null;

                    return (
                        <img
                            key={`error-${idx}`}
                            src={error_img}
                            alt="경고"
                            style={{
                                position: "absolute",
                                left: `${
                                    targetSpace.start_x *
                                        (CELL_SIZE + GRID_GAP) +
                                    targetSpace.width * CELL_SIZE +
                                    (targetSpace.width - 1) * GRID_GAP -
                                    25
                                }px`,
                                top: `${
                                    targetSpace.start_y *
                                        (CELL_SIZE + GRID_GAP) -
                                    18
                                }px`,
                                width: "30px",
                                height: "30px",
                                zIndex: 999,
                                pointerEvents: "none",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CreatedSpace;
