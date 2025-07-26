import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { resultTextMockData } from "../../data/cleanType";

function CleanPersonality_3() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(location.state?.nickname || "사용자");
  const [isInGroup, setIsInGroup] = useState(null);

  const resultCode = location.state?.resultCode || "CRSL";

  // ② cleanType 데이터에서 key로 매칭
  const matched = resultTextMockData.find(item => item.key === resultCode);
  // fallback 처리
  const title       = matched ? matched.title       : "알 수 없음";
  const description = matched ? matched.description : "결과 데이터를 불러올 수 없습니다.";

  // 유저 정보(이름, 그룹 여부) 한번만 fetch
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get("/mypage/info/");
        const { name, IsInGroup } = res.data.data;
        setUserName(name);
        setIsInGroup(IsInGroup);
      } catch {
        setIsInGroup(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleHomeClick = () => {
    if (isInGroup) navigate("/groupHome");
    else          navigate("/noGroup");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <h2 style={styles.subtitle}>{userName} 님의 청소 성격 유형은?</h2>

        <div style={styles.resultBox}>
          <div style={styles.resultCode}>{resultCode}</div>
          <div style={styles.resultTitle}>{title}</div>
        </div>

        <p
          style={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>

        <button
          style={styles.button}
          onClick={handleHomeClick}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#74D3A4";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#8BE2B6";
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    backgroundImage: 'url("/assets/bg-bubble3.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "NotoSansKR-Regular, sans-serif",
  },
  content: {
    textAlign: "center",
    transform: "scale(0.7)",
    transformOrigin: "center",
    fontFamily: "NotoSansKR-Regular, sans-serif",
  },
  subtitle: {
    fontSize: "45px",
    fontWeight: 700,
    marginBottom: "80px",
    color: "#202020",
    fontFamily: "NotoSansKR-Bold, sans-serif",
  },
  resultBox: {
    width: "400px",
    height: "400px",
    margin: "0 auto 70px",
    borderRadius: "50%",
    background:
      "linear-gradient(180deg, rgba(105, 230, 162, 0.3), rgba(227, 244, 249, 0.3))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "NotoSansKR-Regular, sans-serif",
  },
  resultCode: {
    fontSize: "60px",
    fontWeight: 700,
    color: "#1AC27F",
    fontFamily: "NotoSansKR-Bold, sans-serif",
    marginBottom: "50px",
  },
  resultTitle: {
    fontSize: "30px",
    fontWeight: 400,
    color: "#202020",
    fontFamily: "NotoSansKR-Regular, sans-serif",
    marginBottom: "10px",
  },
  description: {
    fontSize: "27px",
    color: "#545454",
    fontFamily: "NotoSansKR-Regular, sans-serif",
    marginBottom: "80px",
    lineHeight: 1.6,
  },
  button: {
    width: "400px",
    height: "80px",
    fontSize: "32px",
    fontWeight: 700,
    fontFamily: "NotoSansKR-Bold, sans-serif",
    cursor: "pointer",
    transition: "background 0.2s",
    backgroundColor: "#8BE2B6",
    color: "white",
    border: "none",
    borderRadius: "12px",
  },
};

// 반응형 스케일 유지
if (window.innerWidth <= 1024) {
  styles.content.transform = "scale(0.55)";
}

export default CleanPersonality_3;
