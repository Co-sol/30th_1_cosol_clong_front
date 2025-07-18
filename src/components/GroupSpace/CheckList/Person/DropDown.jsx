import "./PListAddModal.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

const DropDown = ({ title, targetPlaceData, setCreateData, createData }) => {
    const [isWideScreen, setIsWideScreen] = useState(null);

    useEffect(() => {
        // 브라우저 너비에 따라 상태 설정
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 1720);
        };

        handleResize(); // 초기 1회 실행
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <Dropdown
            style={{
                marginBottom: "clamp(23.82px ,1.76vw ,30.24px)",
                width: "clamp(102.41px ,7.56vw ,130.0px)", // 130 ÷ 14.4 = 9.03vw
                height: "clamp(33.88px ,2.5vw ,43.0px)", // 43 ÷ 14.4
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
                    borderRadius: "clamp(11.82px ,0.87vw ,15.0px)",

                    height: "clamp(35.45px ,2.62vw ,45.0px)", // 45 ÷ 14.4
                    width: "clamp(15.76px ,1.16vw ,20.0px)", // 20 ÷ 14.4

                    fontSize: "clamp(13.87px ,1.02vw ,17.6px)",
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

                            transform: isWideScreen // 화면 너비가 1440보다 크다
                                ? "translate(-124.9px, -7px)" // 참: 위치 유지 (최댓값 넘겼으니)
                                : "translate(min(-93.31px ,-7.26vw), min(-5.23px ,-0.41vw))", // 거짓: 위치 변경 (최솟값만 설정해주면 됨, 최댓값은 윗줄에서 이미 설정했으니)(값이 음수라 최솟값 설정은 max가 아니라 min임 주의)

                            width: "clamp(94.53px ,6.98vw ,120.0px)", // 120 ÷ 14.4
                            height: "clamp(31.51px ,2.33vw ,40.0px)",

                            border: "1px solid rgb(210,210,210)",

                            paddingTop: "clamp(5.51px ,0.41vw ,7.0px)",
                            fontSize: "clamp(12.6px ,0.93vw ,16.0px)",
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
