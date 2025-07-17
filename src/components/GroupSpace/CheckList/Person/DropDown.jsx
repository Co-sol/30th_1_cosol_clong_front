import "./PListAddModal.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

const DropDown = ({ title, targetPlaceData, setCreateData, createData }) => {
    const [isWideScreen, setIsWideScreen] = useState(null);

    useEffect(() => {
        // 브라우저 너비에 따라 상태 설정
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 1440);
        };

        handleResize(); // 초기 1회 실행
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <Dropdown
            style={{
                marginBottom: "min(2.1vw, 30.24px)",
                width: "min(9.03vw, 130px)", // 130 ÷ 14.4 = 9.03vw
                height: "min(2.99vw, 43px)", // 43 ÷ 14.4
                fontFamily: "sans-serif, Noto Sans KR",
            }}
        >
            <Dropdown.Toggle
                id="dropdown-basic"
                className="w-100"
                style={{
                    backgroundColor: "#F5F5F5",
                    color: "rgb(117,117,117)",
                    border: "none",
                    borderRadius: "min(15px,1.04vw)",

                    height: "min(3.125vw, 45px)", // 45 ÷ 14.4
                    width: "min(1.39vw, 20px)", // 20 ÷ 14.4

                    fontSize: "min(1.22vw, 1.1rem)",
                }}
            >
                {createData.place || title}
            </Dropdown.Toggle>

            <Dropdown.Menu
                className="text-center w-100"
                drop="down-centered"
                style={{
                    backgroundColor: "transparent",
                    border: "none",
                }}
            >
                {targetPlaceData.map((item) => (
                    <Dropdown.Item
                        key={item.place}
                        onClick={() =>
                            setCreateData({
                                ...createData,
                                place: item.place,
                            })
                        }
                        style={{
                            backgroundColor: "#ffffff",
                            color: "black",
                            transform: isWideScreen
                                ? "translate(-124.9px, -7px)"
                                : "translate(-8.67vw, -0.486vw)",

                            width: "min(8.33vw, 120px)", // 120 ÷ 14.4
                            height: "min(2.78vw, 40px)",

                            border: "1px solid rgb(210,210,210)",

                            paddingTop: "min(0.49vw, 7px)",
                            fontSize: "min(1.11vw,16px)",
                        }}
                    >
                        {item.place}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropDown;
