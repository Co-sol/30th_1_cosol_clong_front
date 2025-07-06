import React from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";

const publicSpaces = ["거실", "부엌", "다용도실", "신발장", "베란다"];

const privateSpaces = ["A의 방", "B의 방", "C의 방"];

function Sidebar({ onEditSpace, groupName }) {
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
      <div className="sidebar-section">
        <div className="sidebar-section-title">공용 공간</div>
        <ul className="sidebar-list">
          {publicSpaces.map((space) => (
            <li key={space} className="sidebar-list-item">
              {space}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-title">개인 공간</div>
        <ul className="sidebar-list">
          {privateSpaces.map((space) => (
            <li key={space} className="sidebar-list-item">
              {space}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="sidebar-edit-btn"
        onMouseEnter={(e) => {
          e.target.style.background = "#74D3A4";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#8BE2B6";
        }}
        // onClick={onEditSpace}
      >
        공간 편집하기
      </button>
    </aside>
  );
}

export default Sidebar;
