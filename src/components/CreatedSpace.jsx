import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";

const CreatedSpace = ({ type, cellSize, selectedData }) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData, placeData } = useContext(toCleanStateContext);

    const minPx = (cellSize / 14.4) * 12.85;
    const vw = cellSize / 14.4;
    const maxPx = (cellSize / 14.4) * 17.2;
    // const clampValue = `clamp(${minPx}px, ${vw}vw, ${maxPx}px)`;

    // cellSize 밖에서 받아서 바로 계산하려 했는데, 왠진 몰라도 `clamp(${minPx}px,${vw}vw,${maxPx}px)` 안됨
    // 그래서 그냥 CreatedSpace 안에 직접 값 넣음 ㅎ.. (style 안에는 변수는 들어가도 js 수식은 작동 안되는 듯?)
    const s =
        type === "GroupSpace"
            ? "clamp(570.22px ,44.38vw ,763.25px)"
            : "clamp(620.19px ,48.26vw ,695.0px)";

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);
    return (
        <div className="CreatedSpace">
            <div
                className="grid-panel"
                style={{
                    width: s,
                    height: s,

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
                    className="grid-container"
                    style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1/1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        className="grid"
                        style={{
                            display: "grid",
                            border: "none",
                            width: "100%",
                            height: "100%",
                            background: " #e9e9e9",
                            borderRadius: " 15px",
                            position: "relative",
                            zIndex: "1",
                            gridTemplateColumns: "repeat(10, 1fr)",
                            gridTemplateRows: "repeat(10, 1fr)",
                            gap: "0.8px",
                        }}
                    >
                        {[...Array(100)].map((_, idx) => (
                            <div
                                key={idx}
                                className="grid-cell"
                                style={{
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "5px",
                                    background: " #ffffff",
                                    width: "100%",
                                    height: " 100%",
                                    boxSizing: "border-box",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedSpace;
