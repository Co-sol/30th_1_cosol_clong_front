import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CleanPersonality_3() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultCode = location.state?.resultCode || "CRSL";
  const nickname = location.state?.nickname || "사용자";

  const resultTextMap = {
    CRSL: {
      title: "✨정리 요정형",
      description:
        "청소를 완벽하게 해내는 정돈 마스터인 당신!</br>체계적인 루틴과 함께 팀워크까지 겸비한 리더형이에요. ✨",
    },
    CRSI: {
      title: "🧽말없는 실천가형",
      description:
        "항상 깔끔하고 계획적으로 움직이는 당신!</br>리더 역할보다는 혼자서 조용히 청소하는 걸 선호해요. 🧽",
    },
    CRQL: {
      title: "🧠빠른 해결사형",
      description:
        "빠르고 효율적인 정리를 좋아하는 당신!</br>상황에 딱 맞는 최적의 청소 방식을 찾아내요. 🧠",
    },
    CRQI: {
      title: "🧺센스 정리러형",
      description:
        "눈치가 빠르고, 상황 판단에 능한 당신!</br>자신만의 실용적인 방식으로 청소를 해나가요. 🧺",
    },
    CASL: {
      title: "🧹게으른 정리러형",
      description:
        "평소 청소를 잘 하지 않는 당신!</br>하지만, 한 번 시작하면 체계적으로 청소를 해내는 반전 매력의 소유자에요. 🧹",
    },
    CASI: {
      title: "🪣방치적 질서러형",
      description:
        "스스로 먼저 청소하지 않는 당신!</br>하지만, 누군가가 요청한다면 누구보다 열심히 청소해요. 🪣",
    },
    CAQL: {
      title: "🪠순간 정리 마스터형",
      description:
        "급할 땐 누구보다 청소 속도가 빨라지는 당신!</br>빠른 수습에 능숙해요. 🪠",
    },
    CAQI: {
      title: "😶위장 깔끔러형",
      description:
        "겉보기엔 완벽하게 깔끔한 당신!</br>하지만, 청소 완료의 기준은 남과 다를 수 있어요. 😶",
    },
    DRSL: {
      title: "🌀폭주형 청소 리더",
      description:
        "청소를 몰아서 한 번에 해치우는 당신!<br>작정하면 폭풍처럼 공간을 리셋해요. 🌀",
    },
    DRSI: {
      title: "🔄비정기적 실천가형",
      description:
        "정해진 루틴 없이 필요할 때만 나서는 당신!<br>평소엔 안 해도 할 때는 확실하게 하는 스타일이에요. 🔄",
    },
    DRQL: {
      title: "⚡효율 정리꾼형",
      description:
        "미루다가도 한 번 시작하면 똑 부러지는 당신!<br>빠르고 효율적으로 마무리하는 정리꾼이에요. ⚡",
    },
    DRQI: {
      title: "🤔대응형 정리꾼",
      description:
        "눈치 빠르게 상황을 파악하는 당신!<br>팀의 분위기에 맞춰 유연하게 청소해요. 🤔",
    },
    DASL: {
      title: "💡계획형 게으름러",
      description:
        "완벽한 청소 계획을 세우는 당신!<br>하지만, 실행은 조금 미루는 스타일이에요. 💡",
    },
    DASI: {
      title: "😮방치형 관망러",
      description:
        "정리의 필요성을 알고 있는 당신!<br>하지만, 누군가 먼저 시작해주길 바라는 마음이 커요. 😮",
    },
    DAQL: {
      title: "🧊냉정한 미룸러",
      description:
        "“나중에 할게요” 가 자연스러운 당신!<br>그래도 속으로는 청소 계획이 잡혀 있는 타입이에요. 🧊",
    },
    DAQI: {
      title: "🫠카오스형",
      description:
        "미래의 나에게 모든 걸 맡기는 당신!</br>그래도 혼돈 속에서 자신만의 질서는 유지하고 있어요. 🫠",
    },
  };

  const result = resultTextMap[resultCode] || {
    title: "알 수 없음",
    description: "결과 데이터를 불러올 수 없습니다.",
  };

  // ✅ 결과 저장: mount 시 POST 요청
  useEffect(() => {
    const saveResult = async () => {
      try {
        await fetch("/api/personality/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: nickname,
            resultCode: resultCode,
            resultTitle: result.title,
            resultDescription: result.description,
          }),
        });
      } catch (error) {
        console.error("결과 저장 실패:", error);
      }
    };

    saveResult();
  }, [nickname, resultCode, result.title, result.description]);

  const handleHomeClick = () => {
    navigate("/noGroup");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <h2 style={styles.subtitle}>{nickname} 님의 청소 성격 유형은?</h2>

        <div style={styles.resultBox}>
          <div style={styles.resultCode}>{resultCode}</div>
          <div style={styles.resultTitle}>{result.title}</div>
        </div>

        <p
          style={styles.description}
          dangerouslySetInnerHTML={{ __html: result.description }}
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

// ⚠️ 절대 수정하지 말라는 기존 CSS 유지
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
