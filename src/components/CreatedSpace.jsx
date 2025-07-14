import { useState, useEffect } from "react";
import error_img from "../assets/error_img.PNG";
import { useContext } from "react";
import { toCleanStateContext } from "../context/GroupContext";

const CreatedSpace = ({ cellSize, callfrom }) => {
    const [spaces, setSpaces] = useState([]);
    const [isGroupSpace, setIsGroupSpace] = useState(false);
    const { checkListData } = useContext(toCleanStateContext);

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
        if (callfrom === "GroupSpace") {
            setIsGroupSpace(true);
        }
    }, []);

    const CELL_SIZE = cellSize; // 전체 공간구조도 크기 (px)
    const GRID_SIZE = 10; // 작은 칸 크기
    const GRID_GAP = 1; // 작은 칸 간의 간격 (px)

    return (
        <div
            className="grid-wrapper"
            style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gap: `${GRID_GAP}px`,
                width: `${
                    GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                }px`,
                height: `${
                    GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GRID_GAP
                }px`,
            }}
        >
            {/* 도형 렌더링 */}
            {spaces.map((space) => {
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
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1, // 도형은 중간 레벨
                        }}
                    >
                        {space.space_name}
                    </div>
                );
            })}

            {/* 최상단 경고 이미지 레이어 */}
            {isGroupSpace &&
                checkListData.map((item, idx) => {
                    const targetSpace = spaces.find(
                        (space) => space.space_name === item.place && !item.wait
                    );

                    if (!targetSpace) return null;

                    // img가 각 도형 안에 있으면, 부모인 해당 도형의 자식이 되면서 절대 위로 못옴. 그래서 밖으로 뺀 것
                    return (
                        <img
                            key={`error-${idx}`}
                            src={error_img}
                            alt="경고"
                            style={{
                                position: "absolute",
                                left:
                                    targetSpace.start_x *
                                        (CELL_SIZE + GRID_GAP) +
                                    targetSpace.width * CELL_SIZE +
                                    (targetSpace.width - 1) * GRID_GAP -
                                    34,
                                top:
                                    targetSpace.start_y *
                                        (CELL_SIZE + GRID_GAP) -
                                    21,
                                width: "42px",
                                height: "40px",
                                zIndex: 999, // 가장 위로!
                                pointerEvents: "none", // 클릭 방해 방지
                            }}
                        />
                    );
                })}
        </div>
    );
};

export default CreatedSpace;
