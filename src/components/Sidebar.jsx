import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";
import { useNavigate } from "react-router-dom";

const defaultSpaces = [
    { id: 1, name: "거실", owner: "all", space_type: 0 },
    { id: 2, name: "부엌", owner: "all", space_type: 0 },
    { id: 3, name: "다용도실", owner: "all", space_type: 0 },
    { id: 4, name: "신발장", owner: "all", space_type: 0 },
    { id: 5, name: "베란다", owner: "all", space_type: 0 },
    { id: 9, name: "안방", owner: "all", space_type: 0 },
    { id: 6, name: "A의 방1", owner: "A", space_type: 1 },
    { id: 7, name: "A의 방2", owner: "A", space_type: 1 },
    { id: 8, name: "B의 방", owner: "B", space_type: 1 },
    { id: 9, name: "C의 방", owner: "C", space_type: 1 },
];

function Sidebar({ onEditSpace, getSelectedData, clickHeader }) {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState(defaultSpaces); // 하드코딩
    const [clickActive, setClickActive] = useState("");
    const groupName = "Clong's home"; // 연동 시 삭제 - 파라미터에 groupName 추가
    // api 연동 필요
    // useEffect(() => {
    //   fetch("/api/spaces")
    //     .then((res) => res.json())
    //     .then((data) => setSpaces(data))
    //     .catch((error) => {
    //       console.error("공간 목록 불러오기 실패:", error);
    //     });
    // }, []);

    // 첨에 초기 Data 그룹/개인 체크리스트에 전달하는 것 (useEffect(~,[])로 처음 mount 시에만 적용되게 함)

    useEffect(() => {
        // 처음 mount시에만 localStorage에 저장
        const savedData = JSON.parse(localStorage.getItem("lastSidebarData"));

        // 사이드바 초기 데이터
        const initSidebarData = () => {
            if (savedData) return savedData; // localStorage에 저장된게 있으면 그걸 반환
            return spaces.find((s) => s.space_type === 0); // localStorage에 저장된게 없으면 저장한 그룹공간 중 첫 데이터 반환
        };

        const dataToUse = initSidebarData();
        getSelectedData(dataToUse);
        setClickActive(dataToUse.name);
    }, []);

    const publicSpaces = spaces.filter((space) => space.space_type === 0);
    const privateSpaces = spaces.filter((space) => space.space_type === 1);

    return (
        <aside className="sidebar">
            <div className="sidebar-home">
                <div className="sidebar-home-inner">
                    <span className="sidebar-home-icon">
                        <img
                            src={homeImg}
                            alt="home"
                            style={{
                                width: "20px",
                                height: "17px",
                                verticalAlign: "middle",
                            }}
                        />
                    </span>
                    <span className="sidebar-home-title">{groupName}</span>
                </div>
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">공용 공간</div>
                <ul className="sidebar-list">
                    {publicSpaces.map((space) => (
                        <li
                            onClick={() => {
                                getSelectedData(space);
                                setClickActive(space.name);
                                localStorage.setItem(
                                    "lastSidebarData",
                                    clickActive === "" || clickHeader
                                        ? null
                                        : JSON.stringify(space)
                                );
                            }}
                            key={space.id}
                            className={`sidebar-list-item sidebar-list-item${
                                clickActive === space.name ? "_active" : ""
                            }`}
                        >
                            {space.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-title">개인 공간</div>
                <ul className="sidebar-list">
                    {privateSpaces.map((space) => (
                        <li
                            onClick={() => {
                                getSelectedData({ ...space });
                                setClickActive(space.name);

                                // 클릭 시에만 마지막 사이드바 클릭 정보 저장
                                // (mount시, clickActive 클릭 시에 setItem하면, mount 시 clickActive가 초기화되면서 "" 되서 그룹공간 첫 data가 localStorage에 저장됨,
                                // 그러면 localStorage 사용한 이유가 없음)
                                localStorage.setItem(
                                    "lastSidebarData",
                                    clickActive === "" || clickHeader
                                        ? null
                                        : JSON.stringify(space)
                                );
                            }}
                            key={space.id}
                            className={`sidebar-list-item sidebar-list-item${
                                // 위와 동일
                                clickActive === space.name
                                    ? "_active"
                                    : "negative"
                            }`}
                        >
                            {space.name}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
