import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";
import { useNavigate } from "react-router-dom";
import { toCleanStateContext } from "../context/GroupContext";

function Sidebar({ onEditSpace, groupName }) {
    const navigate = useNavigate();
    const { spaces } = useContext(toCleanStateContext);

    // api 연동 필요
    // useEffect(() => {
    //   fetch("/api/spaces")
    //     .then((res) => res.json())
    //     .then((data) => setSpaces(data))
    //     .catch((error) => {
    //       console.error("공간 목록 불러오기 실패:", error);
    //     });
    // }, []);

    useEffect(getSidebarData(spaces[0]), []);

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
            <button
                className="sidebar-edit-btn"
                onMouseEnter={(e) => {
                    e.target.style.background = "#74D3A4";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "#8BE2B6";
                }}
                onClick={() => navigate("/editSpace")}
            >
                공간 편집하기
            </button>

            <div className="sidebar-section">
                <div className="sidebar-section-title">공용 공간</div>
                <ul className="sidebar-list">
                    {publicSpaces.map((space) => (
                        <li key={space.id} className="sidebar-list-item">
                            {space.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-title">개인 공간</div>
                <ul className="sidebar-list">
                    {privateSpaces.map((space) => (
                        <li key={space.id} className="sidebar-list-item">
                            {space.name}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
