import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";
import axiosInstance from "../api/axiosInstance";

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

const spaceInfo = (response, selectedData) => {
    if (selectedData.space_type === 0) {
        return response;
    } else {
        // 선택한 루트공간의 하위공간들 뽑아냄
        const items = response.find(
            (item) => item.space_name === selectedData.name
        );

        // 기존 루트공간과 API 명세서의 변수형식 같게 해줌 (아래 도형 렌더링 그룹일때 것 재사용하려고)
        const sumItems = [];
        for (const item of items) {
            const { item_id, item_name, ...rest } = item; // 공간 하위공간 요소를 루트공간 요소와 동일하게 만들기 위해 구조분해 (내가 설정한 변수 맞추게)
            sumItems.push({
                space_id: item.item_id,
                space_name: item.item_name,
                space_type: 1,
                ...rest,
            });
        }

        return sumItems;
    }
};

const CreatedSpace = ({
    type,
    space_type,
    selectedData,
    getClickedDiagram,
}) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData } = useContext(toCleanStateContext);
    const [hoverDiagram, setHoverDiagram] = useState(false);
    const [isActive, setIsActive] = useState("");
    console.log(selectedData);

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
    console.log(spaces);

    // 반응형 크기 설정
    const size =
        type === "GroupSpace"
            ? "clamp(601.28px ,44.38vw ,763.25px)"
            : "clamp(620.19px ,48.26vw ,695.0px)";
    // 공간구조도 루트공간 중복 오류 때매 잠시 stop
    useEffect(() => {
        const getSpacesINfo = async () => {
            try {
                const response = await axiosInstance.get("/spaces/info/");
                // 그룹일 때, 개인일 때 나눠서 넣기 (수정 필요)
                setSpaces(spaceInfo(response.data.data, selectedData));
            } catch (error) {
                console.error("루트 공간 get 실패:", error);
                return false;
            }
        };

        getSpacesINfo();
        // const saved = localStorage.getItem(
        //     space_type === 0 || type === "GroupHome"
        //         ? "parent_spaces" // '그룹'공간이면 'parent_spaces'(루트 공간)가 키인 값 반환
        //         : `spaces_${selectedData.id}` // '개인'공간이면 'spaces_선택된 개인공간 id'(하위 공간)가 키인 값 반환
        // );

        // if (saved) {
        //     setSpaces(JSON.parse(saved));
        // }
    }, [selectedData]); // 아래에 에러 문제 & 원인 적어둠
    // (P): 개인 -> 그룹 사이드바 클릭 시 공간구조도 안바뀌는 문제
    // (S):
    // 위에 useEffect를 []로 mounting될 때로 쓰니까,
    // 그룹 & 개인 공간구조도 같이 쓰면서 그룹 1번(O) -> 개인 공간 만듦(O) -> 그룹1번(X)된 것
    // 따라서 사이드바에서 선택되는 data(selectedData)가 달라질 때마다 공간구조도 정보를 불러와야 처음에 그룹 1번 useEffect 실행되고,
    // 개인 공간 만든 후(이건 CreateItemPage에서 개인 공간구조도 정보 만드는거라 CreatedSpace mounting이랑 상관없음)
    // 그룹공간을 사이드바에서 선택했을 때 useEffect 리렌더링되면서 localStorage의 '그룹공간구조도' 정보 불러올 수 O

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
                            {type === "GroupHome" ||
                            selectedData.space_type === 0 ? (
                                // 그룹홈 도형/ 사이드바 그룹공간 클릭 시 뜰 그룹용 도형 (클릭 안됨)
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
                                    onClick={() => {
                                        getClickedDiagram(space);
                                        setIsActive(space.space_name);
                                    }}
                                    onMouseOver={() =>
                                        setHoverDiagram(space.space_name)
                                    }
                                    onMouseOut={() => setHoverDiagram(false)}
                                    style={{
                                        gridColumn: `${
                                            space.start_x + 1
                                        } / span ${space.width}`, // space.start_x + 1 위치부터 space.width칸 차지
                                        gridRow: `${space.start_y + 1} / span ${
                                            space.height
                                        }`, // space.start_y + 1 위치부터 space.height칸 차지
                                        backgroundColor:
                                            isActive === space.space_name
                                                ? "#83EBB7" // 클릭 시 색깔 유지
                                                : color(space), // hover, 사이드바 클릭 -> 해당 도형 색깔 지정

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
                                        zIndex: "10",
                                    }}
                                >
                                    {checkListData.map((item) => {
                                        return (
                                            (item.place === space.space_name ||
                                                item.parentPlace ===
                                                    space.space_name) &&
                                            !item.wait && (
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

                                                        width: "32px",
                                                        height: "32px",
                                                        position: "absolute",
                                                        top: "-12px",
                                                        right: "-12px",
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
