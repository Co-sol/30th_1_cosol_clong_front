import Button from "../../Button";

const NoPersonSpace = () => {
    return (
        <div
            className="NoPersonSpace"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h3
                style={{
                    fontSize: "clamp(24px, 1.88vw, 27px)",
                    fontFamily: "bold",
                    marginBottom: "clamp(21px, 1.67vw, 24px)",
                }}
            >
                내 공간이 존재하지 않아요
            </h3>
            <div
                style={{
                    fontSize: "clamp(20px, 1.53vw, 22px)",
                    marginBottom: "clamp(45px, 3.47vw, 50px)",
                }}
            >
                공간을 생성해볼까요?
            </div>
            <button
                style={{
                    color: "white",
                    fontSize: "clamp(24px, 1.88vw, 27px)",
                    fontFamily: "bold",

                    border: "none",
                    borderRadius: "clamp(12px, 1.04vw, 15px)",
                    backgroundColor: "#8BE2B6",
                    width: "clamp(267px, 20.83vw, 300px)",
                    height: "clamp(54px, 4.17vw, 60px)",
                }}
            >
                생성하기
            </button>
        </div>
    );
};

export default NoPersonSpace;
