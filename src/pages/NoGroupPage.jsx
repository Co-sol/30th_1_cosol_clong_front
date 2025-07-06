import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function NoGroupPage() {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    navigate("/createGroup");
  };

  return (
    <>
      <Header hideMenu />
      <main
        style={{
          backgroundColor: "#EEEEEE",
          minHeight: "100vh",
          margin: 0,
          padding: "0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontWeight: 700,
                marginBottom: 16,
                fontFamily: "NotoSansKR, sans-serif",
                fontStyle: "normal",
                fontSize: 24,
              }}
            >
              그룹이 존재하지 않아요
            </h2>
            <p
              style={{
                marginBottom: 36,
                fontWeight: 400,
                fontFamily: "NotoSansKR, sans-serif",
                fontStyle: "normal",
                fontSize: 16,
              }}
            >
              생성하거나 하우스 메이트에게 초대를 요청하세요!
            </p>
            <button
              onClick={handleCreateGroup}
              style={{
                background: "#8BE2B6",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 15,
                padding: "12px 64px",
                fontSize: 20,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "NotoSansKR, sans-serif",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#74D3A4";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#8BE2B6";
              }}
            >
              그룹 만들러가기
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default NoGroupPage;
