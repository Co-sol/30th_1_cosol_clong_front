import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./TutorialPage.css";

const SHAPES = [
    { id: "shape-1x1", w: 1, h: 1 },
    { id: "shape-2x1", w: 2, h: 1 },
    { id: "shape-3x1", w: 3, h: 1 },
    { id: "shape-4x1", w: 4, h: 1 },
    { id: "shape-3x2", w: 3, h: 2 },
    { id: "shape-4x3", w: 4, h: 3 },
];

function ShapeButton({ shape, onClick, direction = "vertical" }) {
    const w = direction === "horizontal" ? shape.h : shape.w;
    const h = direction === "horizontal" ? shape.w : shape.h;
    return (
        <button
            className="tutorial-shape-btn"
            style={{
                width: `${w * 20}%`,
                aspectRatio: `${w} / ${h}`,
            }}
            onClick={() => onClick?.(shape)}
        >
            +
        </button>
    );
}

const TutorialPage = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleClick = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            navigate("/createSpace");
        }
    };

    return (
        <div
            className="create-space-bg"
            style={{ position: "relative", minHeight: "100vh" }}
            onClick={handleClick}
        >
            {/* 검정 반투명 오버레이 */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
            />

            {/* 튜토리얼 문장 */}
            <div
                style={{
                    position: "fixed",
                    top: "9.3%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1100,
                    pointerEvents: "none",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        color: "white",
                        fontSize: "1.5rem",
                        margin: 0,
                        fontFamily: "NotoSansKR-Regular, sans-serif",
                        fontWeight: "500",
                    }}
                >
                    다음 단계로 넘어가고 싶다면, 화면을 클릭해 주세요!
                </p>
            </div>

            {/* 이미지 컨테이너 */}
            <div
                style={{
                    position: "fixed",
                    top: "30%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "90%",
                    height: "330px",
                    zIndex: 1100,
                    pointerEvents: "none",
                }}
            >
                {/* step1 이미지 */}
                <div
                    style={{
                        flex: "1",
                        textAlign: "center",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {step >= 1 && (
                        <img
                            src="/assets/step1.png"
                            alt="Step 1"
                            style={{
                                width: "100%",

                                maxWidth: "250px",
                                height: "auto",
                                objectFit: "contain",
                                backgroundColor: "transparent",
                            }}
                        />
                    )}
                </div>

                {/* step2 이미지 */}
                <div
                    style={{
                        flex: "1",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {step >= 2 && (
                        <img
                            src="/assets/step2.png"
                            alt="Step 2"
                            style={{
                                width: "90%",

                                maxWidth: "220px",
                                height: "auto",
                                objectFit: "contain",
                                backgroundColor: "transparent",
                            }}
                        />
                    )}
                </div>

                {/* step3 이미지 */}
                <div
                    style={{
                        flex: "1",
                        textAlign: "center",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {step >= 3 && (
                        <img
                            src="/assets/step3.png"
                            alt="Step 3"
                            style={{
                                width: "100%",

                                maxWidth: "215px",
                                height: "auto",
                                objectFit: "contain",
                                backgroundColor: "transparent",
                            }}
                        />
                    )}
                </div>
            </div>

            <Header hideMenu />
            <div className="create-space-content">
                <div className="grid-panel">
                    <div className="grid-container">
                        <div
                            className="grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(10, 1fr)",
                                gridTemplateRows: "repeat(10, 1fr)",
                                gap: "0.8px",
                            }}
                        >
                            {[...Array(100)].map((_, idx) => (
                                <div key={idx} className="grid-cell" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="shape-panel">
                    <div className="shape-panel-inner">
                        <div className="shape-panel-title">공간 도형</div>
                        <div className="shape-row">
                            <ShapeButton shape={SHAPES[0]} />
                            <ShapeButton shape={SHAPES[1]} />
                        </div>
                        <div className="shape-row">
                            <ShapeButton shape={SHAPES[2]} />
                        </div>
                        <div className="shape-row">
                            <ShapeButton shape={SHAPES[3]} />
                        </div>
                        <div className="shape-row">
                            <ShapeButton shape={SHAPES[4]} />
                        </div>
                        <div className="shape-row">
                            <ShapeButton shape={SHAPES[5]} />
                        </div>
                        <button className="tutorial-save-btn">저장하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialPage;
