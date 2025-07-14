import { useState, useEffect } from "react";

const CELL_SIZE = 60.65; // 전체 공간구조도 크기 (px)
const GRID_SIZE = 10; // 작은 칸 크기
const GRID_GAP = 1; // 작은 칸 간의 간격 (px)

const CreatedSpace = () => {
    const [spaces, setSpaces] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);

    return (
        <div
            className="grid-wrapper"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gap: `${GRID_GAP}px`,
                position: "relative",
                width: `${
                    GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                }px`,
                height: `${
                    GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                }px`,
                border: "1px solid #ccc",
                borderRadius: "15px",
            }}
        >
            {/* 도형 렌더링 */}
            {spaces.map((space, index) => {
                return (
                    <div
                        key={space.space_id}
                        className="placed-shape"
                        style={{
                            position: "absolute",
                            left: space.start_x * (CELL_SIZE + GRID_GAP),
                            top: space.start_y * (CELL_SIZE + GRID_GAP),
                            width:
                                space.width * CELL_SIZE +
                                (space.width - 1) * GRID_GAP,
                            height:
                                space.height * CELL_SIZE +
                                (space.height - 1) * GRID_GAP,
                            backgroundColor: "#D9D9D9",
                            // border: "2px solid #333",
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {space.space_name}
                    </div>
                );
            })}
        </div>
    );
};

export default CreatedSpace;
