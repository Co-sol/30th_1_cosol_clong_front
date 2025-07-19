import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";

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

const CreatedSpace = ({
    type,
    space_type,
    selectedData,
    getClickedDiagram,
}) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData } = useContext(toCleanStateContext);
    const [hoverDiagram, setHoverDiagram] = useState(false);

    // color 함수
    const color = (space) => {
        //그룹 공간이면
        if (type === "GroupSpace") {
            // 사이드바에서 선택되거나 (그룹공간 도형꺼)
            // 도형이 클릭되면 (개인공간 도형꺼)
            if (
                space.space_name === selectedData.name ||
                hoverDiagram === space.space_name
            ) {
                return "#83EBB7"; //색깔 표시
            }
            return "#D9D9D9"; // 선택 안된 공간은 회색
        }
        // 그룹 홈이면 색생 랜덤
        return SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)];
    };

    // 반응형 크기 설정
    const size =
        type === "GroupSpace"
            ? "clamp(601.28px ,44.38vw ,763.25px)"
            : "clamp(620.19px ,48.26vw ,695.0px)";

    useEffect(() => {
        const saved = localStorage.getItem(
            space_type === 0
                ? "parent_spaces" // '그룹'공간이면 'parent_spaces'(루트 공간)가 키인 값 반환
                : `spaces_${selectedData.id}` // '개인'공간이면 'spaces_선택된 개인공간 id'(하위 공간)가 키인 값 반환
        );

        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);

    // 전체 그리드 개수를 그냥 100개로 잡고 구현해서 안에 공간들 들어가면 그 넓이만큼 전체 그리드 개수에서 빼서 렌더링 해줘야 함
    // 안그러면 공간구조도 아래에 안쓰이는 그리드 깔려서 UI 어그러짐
    let sum = 0;
    spaces.map((space) => (sum += space.width * space.height));

    return (
        <div className="CreatedSpace">
            <div
                className="grid_panel"
                style={{
                    width: size,
                    height: size,
                    boxSizing: "border-box",
                    background: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px #d9d9d9",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    className="grid_container"
                    style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1/1",
                        display: "grid",
                        position: "relative",
                        gridTemplateColumns: "repeat(10, 1fr)",
                        gridTemplateRows: "repeat(10, 1fr)",
                        gap: "1px",
                        background: "#e9e9e9",
                        borderRadius: "15px",
                    }}
                >
                    {/* 셀 */}
                    {[...Array(100 - sum)].map((_, idx) => (
                        <div
                            key={idx}
                            className="grid_cell"
                            style={{
                                border: "1px solid #d9d9d9",
                                borderRadius: "5px",
                                background: "#ffffff",
                                width: "100%",
                                height: "100%",
                                boxSizing: "border-box",
                            }}
                        />
                    ))}

                    {/* 도형 렌더링 (Grid 위치 기반) */}
                    {spaces.map((space, idx) => (
                        <>
                            {selectedData.space_type === 0 ? (
                                // 그룹용 도형 (클릭 안됨)
                                <div
                                    key={idx}
                                    className="groupDiagram"
                                    style={{
                                        gridColumn: `${
                                            space.start_x + 1
                                        } / span ${space.width}`, // space.start_x + 1 위치부터 space.width칸 차지
                                        gridRow: `${space.start_y + 1} / span ${
                                            space.height
                                        }`, // space.start_y + 1 위치부터 space.height칸 차지
                                        backgroundColor: color(space),

                                        height: "100%",
                                        width: "100%",

                                        borderRadius: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize:
                                            "clamp(13.39px ,1.04vw ,17.92px)",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                        padding: "2px",
                                        zIndex: 2,

                                        position: "relative",
                                    }}
                                >
                                    {space.space_name}
                                </div>
                            ) : (
                                // 개인용 도형 (클릭 되고, 해당 체크리스트 볼 수O)
                                <div
                                    key={idx}
                                    className="personDiagram"
                                    // hover 효과 css로 구현하려면 color함수에 부딪혀서 js로 구현함
                                    onMouseOver={() =>
                                        setHoverDiagram(space.space_name)
                                    }
                                    onMouseOut={() => setHoverDiagram(false)}
                                    onClick={() => getClickedDiagram(space)}
                                    style={{
                                        gridColumn: `${
                                            space.start_x + 1
                                        } / span ${space.width}`, // space.start_x + 1 위치부터 space.width칸 차지
                                        gridRow: `${space.start_y + 1} / span ${
                                            space.height
                                        }`, // space.start_y + 1 위치부터 space.height칸 차지
                                        backgroundColor: color(space),

                                        height: "100%",
                                        width: "100%",

                                        borderRadius: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize:
                                            "clamp(13.39px ,1.04vw ,17.92px)",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                        padding: "2px",
                                        zIndex: 2,

                                        position: "relative",
                                    }}
                                >
                                    {space.space_name}
                                </div>
                            )}

                            {/* 
                            위에 공간 자식이 아니라 밖으로 뺀 이유: 
                            zIndex는 자식이면 아무리 커도 부모 못 넘음, 따라서 '부모-자식'관계가 아니라 '형제' 관계로 빼서 zIndex 더 크게 잡아서 덮어버린 것
                             */}
                            {type === "GroupSpace" && (
                                <div
                                    className="error_img"
                                    style={{
                                        zIndex: "10000",
                                    }}
                                >
                                    {checkListData.map((item) => {
                                        return (
                                            (item.place === space.space_name ||
                                                item.parentPlace ===
                                                    space.space_name) && (
                                                <img
                                                    src={error_img}
                                                    style={{
                                                        gridColumn: `${
                                                            space.start_x + 1
                                                        } / span ${
                                                            space.width
                                                        }`, // space.start_x + 1 위치부터 space.width칸 차지
                                                        gridRow: `${
                                                            space.start_y + 1
                                                        } / span ${
                                                            space.height
                                                        }`, // space.start_y + 1 위치부터 space.height칸 차지

                                                        width: "45px",
                                                        height: "45px",
                                                        position: "absolute",
                                                        top: "-25px",
                                                        right: "-13px",
                                                    }}
                                                />
                                            )
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreatedSpace;
