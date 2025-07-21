import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resultTextMockData } from "../../data/cleanType";
import axiosInstance from "../../api/axiosInstance";

function CleanPersonality_2() {
  const [selected, setSelected] = useState([null, null, null, null]);
  const [scale, setScale] = useState(0.65); // 기본 크기
  const navigate = useNavigate();

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width <= 1024) {
        setScale(0.55); // 태블릿 이하 화면에서는 더 작게
      } else {
        setScale(0.65); // 기본 (PC)
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleClick = (qIndex, choiceIndex) => {
    const updated = [...selected];
    updated[qIndex] = choiceIndex;
    setSelected(updated);
  };

  const questions = [
    {
      text: "내 방 책상 상태는 보통 어떤가요?",
      choices: [
        "항상 깔끔하게 정돈해둔다",
        "자주 어질러져 있고 귀찮아서 놔둔다",
      ],
    },
    {
      text: "청소는 얼마나 자주 하나요?",
      choices: ["주기적으로 루틴처럼 한다", "더러워졌다고 느낄 때만 한다"],
    },
    {
      text: "청소할 때 나는?",
      choices: ["물건을 카테고리별로 정리한다", "일단 안 보이게 넣어두고 본다"],
    },
    {
      text: "룸메이트가 자꾸 청소를 미룬다면 나는?",
      choices: [
        "내가 먼저 정리하거나 설득한다",
        "그냥 참고 넘기거나 모른 척한다",
      ],
    },
  ];

  const resultCodes = [
    ["C", "D"],
    ["R", "A"],
    ["S", "Q"],
    ["L", "I"],
  ];

  const handleSubmit = async () => {
    const resultCode = selected
      .map((choice, i) => resultCodes[i][choice])
      .join("");
    console.log("최종 성격 코드:", resultCode);

    const matched = resultTextMockData.find(item => item.key === resultCode);
    const label = matched ? matched.label : null;
    try {
      const response = await axiosInstance.patch("/mypage/info/", {
        clean_type : label
      });
      console.log(response.data);
    } catch (error) {
      console.error("회원 정보 조회:", error);
      return false;
    }

    navigate("/result", { state: { resultCode } });
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.container, transform: `scale(${scale})` }}>
        <h1 style={styles.title}>청소 성격 유형 테스트</h1>
        {questions.map((q, qIndex) => (
          <div style={styles.questionBlock} key={qIndex}>
            <p style={styles.question}>{q.text}</p>
            <div style={styles.choices}>
              {q.choices.map((choice, cIndex) => (
                <button
                  key={cIndex}
                  onClick={() => handleClick(qIndex, cIndex)}
                  style={{
                    ...styles.button,
                    ...(selected[qIndex] === cIndex
                      ? styles.selectedButton
                      : {}),
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          style={{
            ...styles.submitButton,
            opacity: selected.every((choice) => choice !== null) ? 1 : 0.4,
            cursor: selected.every((choice) => choice !== null)
              ? "pointer"
              : "not-allowed",
          }}
          disabled={!selected.every((choice) => choice !== null)}
          onClick={handleSubmit}
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    backgroundImage: 'url("/assets/bg-bubble2.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    transformOrigin: "center",
    textAlign: "center",
  },
  title: {
    fontSize: "48px",
    fontWeight: 700,
    marginBottom: "70px",
    fontFamily: "NotoSansKR-Bold, sans-serif",
  },
  questionBlock: {
    marginBottom: "50px",
  },
  question: {
    fontSize: "30px",
    fontWeight: 500,
    marginBottom: "30px",
    color: "#202020",
    fontFamily: "NotoSansKR-Regular, sans-serif",
  },
  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  button: {
    width: "500px",
    height: "75px",
    fontSize: "24px",
    fontWeight: 500,
    borderRadius: "12px",
    color: "#545454",
    border: "2px solid #D9D9D9",
    cursor: "pointer",
    backgroundColor: "white",
    fontFamily: "NotoSansKR-Regular, sans-serif",
  },
  selectedButton: {
    backgroundColor: "#EBFEF4",
    border: "2px solid #8BE2B6",
  },
  submitButton: {
    marginTop: "40px",
    width: "400px",
    height: "80px",
    fontSize: "32px",
    fontWeight: 700,
    color: "white",
    backgroundColor: "#8BE2B6",
    border: "none",
    borderRadius: "15px",
    transition: "0.3s",
    fontFamily: "NotoSansKR-Bold, sans-serif",
  },
};

export default CleanPersonality_2;
