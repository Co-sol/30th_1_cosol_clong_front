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
                    fontSize: "27px",
                    fontFamily: "bold",
                    marginBottom: "24px",
                }}
            >
                내 공간이 존재하지 않아요
            </h3>
            <div
                style={{
                    fontSize: "22px",
                    marginBottom: "50px",
                }}
            >
                공간을 생성해볼까요?
            </div>
            <button
                style={{
                    color: "white",
                    fontSize: "27px",
                    fontFamily: "bold",

                    border: "none",
                    borderRadius: "15px",
                    backgroundColor: "#8BE2B6",
                    width: "300px",
                    height: "60px",
                }}
            >
                생성하기
            </button>
        </div>
    );
};

export default NoPersonSpace;
