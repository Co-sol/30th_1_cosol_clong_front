import Button from "../../Button";
import "./NoPersonSpace.css";

const NoPersonSpace = ({ selectedData }) => {
    console.log(selectedData);
    return (
        <div
            className="NoPersonSpace"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "clamp(601.28px, 44.38vw, 763.25px)",
                aspectRatio: "1/1",
                backgroundColor: "white",
                borderRadius: "7px",
                boxShadow: "0 2px 8px #d9d9d9",
            }}
        >
            <h3
                style={{
                    fontSize: "clamp(24px, 1.88vw, 27px)",
                    fontFamily: "bold",
                    marginBottom: "clamp(21px, 1.67vw, 24px)",
                }}
            >
                아직{" "}
                <span style={{ color: "#8BE2B6" }}>
                    <strong>{selectedData.name}</strong>
                </span>{" "}
                공간의 구조도가 존재하지 않아요
            </h3>
            {/* <div
                style={{
                    fontSize: "clamp(20px, 1.53vw, 22px)",
                    marginBottom: "clamp(45px, 3.47vw, 50px)",
                }}
            >
                공간을 생성해볼까요?
            </div>
            <button className="createSpaceButton">생성하기</button> */}
        </div>
    );
};

export default NoPersonSpace;
