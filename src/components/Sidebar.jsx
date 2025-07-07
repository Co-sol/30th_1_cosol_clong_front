import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";
import { useNavigate } from "react-router-dom";

const defaultSpaces = [
  { id: 1, name: "거실", space_type: 0 },
  { id: 2, name: "부엌", space_type: 0 },
  { id: 3, name: "다용도실", space_type: 0 },
  { id: 4, name: "신발장", space_type: 0 },
  { id: 5, name: "베란다", space_type: 0 },
  { id: 9, name: "안방", space_type: 0 },
  { id: 6, name: "A의 방", space_type: 1 },
  { id: 7, name: "B의 방", space_type: 1 },
  { id: 8, name: "C의 방", space_type: 1 },
];

function Sidebar({ onEditSpace, groupName }) {
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState(defaultSpaces); // 하드코딩

  // api 연동 필요
  // useEffect(() => {
  //   fetch("/api/spaces")
  //     .then((res) => res.json())
  //     .then((data) => setSpaces(data))
  //     .catch((error) => {
  //       console.error("공간 목록 불러오기 실패:", error);
  //     });
  // }, []);

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
              style={{ width: "20px", height: "17px", verticalAlign: "middle" }}
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
        onClick={() => navigate("/spaceEdit")}
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
