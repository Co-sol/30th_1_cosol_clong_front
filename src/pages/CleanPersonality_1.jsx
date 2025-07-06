import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CleanPersonalityIntro() {
    const navigate = useNavigate();
    const [scale, setScale] = useState(0.7); // 기본 스케일

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width <= 1024) {
                setScale(0.6); // 태블릿 이하일 때 축소
            } else {
                setScale(0.7);
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div style={styles.wrapper}>
            <div style={{ ...styles.content, transform: `scale(${scale})` }}>
                <p style={styles.question}>나는 청소할 때 어떤 타입일까?</p>
                <h1 style={styles.title}>청소 성격 유형 테스트</h1>
                <button
                    style={styles.button}
                    onClick={() => navigate("/personality/2")}
                >
                    테스트 시작하기
                </button>
                <p style={styles.later}>나중에 하기</p>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        width: "100%",
        height: "100vh",
        backgroundImage: 'url("/assets/bg-bubble1.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        textAlign: "center",
        padding: "40px",
        borderRadius: "20px",
        transformOrigin: "center",
    },
    question: {
        fontSize: "32px",
        color: "#000000",
        marginBottom: "30px",
        fontWeight: 500,
        fontFamily: "NotoSansKR-Regular, sans-serif",
    },
    title: {
        fontSize: "64px",
        fontWeight: 600,
        marginBottom: "100px",
        color: "#000",
        fontFamily: "NotoSansKR-Bold, sans-serif",
    },
    button: {
        fontSize: "32px",
        fontWeight: 800,
        width: "400px",
        height: "80px",
        backgroundColor: "#8BE2B6",
        border: "none",
        borderRadius: "12px",
        color: "white",
        cursor: "pointer",
        marginBottom: "30px",
        fontFamily: "NotoSansKR-Bold, sans-serif",
    },
    later: {
        fontSize: "20px",
        color: "#4381EB",
        textDecoration: "none",
        cursor: "pointer",
        fontFamily: "NotoSansKR-Bold, sans-serif",
    },
};

export default CleanPersonalityIntro;
