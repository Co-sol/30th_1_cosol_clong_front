import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";

// // 공간의 주인 이름(ex. A) 찾아주는 함수
// const findPlace = (space, placeData) => {
//     for (let i = 0; i < placeData.length; i++) {
//         if (placeData[i].parentPlace === space.space_name) {
//             return placeData[i].name;
//         }
//     }
// };

const CreatedSpace = ({ cellSize, selectedData }) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData, placeData } = useContext(toCleanStateContext);
    // const [activePlace, setActivePlace] = useState(""); // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);

    const CELL_SIZE = cellSize; // 전체 공간구조도 크기 (px)
    const GRID_SIZE = 10; // 작은 칸 크기
    const GRID_GAP = 0.7; // 작은 칸 간의 간격 (px)

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
                border: "1px solid #ddd",
                borderRadius: "5px",
            }}
        >
            {/* 배경 격자 */}
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
                <div
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
                            selectedData.name === space.space_name
                                ? "place_block_active"
                                : "place_block"
                        }
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

                            border: "none",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1, // 도형은 중간 레벨
                        }}
                        // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
                        // onClick={() => {
                        //     // 공간구조도 클릭 시 해당 공간의 체크리스트 뜨게 함
                        //     setActivePlace(space.space_name);

                        //     // GroupSpacePage에 보낼 정보를 사이드바에서 보내는 객체와 같게 변형시킴
                        //     // GroupSpacePage에서 바꾸려했는데, return밖은 Context(Proveder)밖이라서 placeData 못 불러옴, 그래서 여기서(CreatedSpace) 미리 변형시킨 modified_data를 getSelectedData로 넘겨줌
                        //     const modified_data = {
                        //         space_type: space.space_type,
                        //         name: space.space_name,
                        //         owner:
                        //             space.space_type === 0
                        //                 ? "all"
                        //                 : findPlace(space, placeData), // 공간의 주인 이름(ex. A) 찾아주는 함수
                        //     }; // 사이드바에서 오는 형식과 통일시킴
                        //     getSelectedData(modified_data);
                        // }}
                    >
                        {space.space_name}
                    </button>
                );
            })}

            {/* 최상단 경고 이미지 레이어 */}
            {checkListData.map((item, idx) => {
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
                                targetSpace.start_x * (CELL_SIZE + GRID_GAP) +
                                targetSpace.width * CELL_SIZE +
                                (targetSpace.width - 1) * GRID_GAP -
                                33,
                            top:
                                targetSpace.start_y * (CELL_SIZE + GRID_GAP) -
                                24,
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
