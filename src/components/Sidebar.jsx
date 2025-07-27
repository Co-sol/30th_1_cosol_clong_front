import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar({ onEditSpace, getSelectedData }) {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [clickActive, setClickActive] = useState("");
  const [groupName, setGroupName] = useState("...");

  useEffect(() => {
    const fetchGroupInfo = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("accessToken이 없습니다.");
        return;
      }

      try {
        const res = await axios.get("/api/groups/group-info/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data?.success && res.data.data) {
          const { group_name, spaces: fetchedSpaces } = res.data.data;
          setGroupName(group_name || "...");

          const parsedSpaces = fetchedSpaces
            .map((s) => ({
              id: s.space_id,
              name: s.space_name,
              space_type: s.space_type,
              owner: s.owner_email ?? null,
            }))
            .sort((a, b) => a.id - b.id);

          setSpaces(parsedSpaces);

          let saved = localStorage.getItem("lastSidebarData");
          saved = saved ? JSON.parse(saved) : null;

          const defaultData =
            saved || parsedSpaces.find((s) => s.space_type === 0);
          if (defaultData) {
            getSelectedData(defaultData);
            setClickActive(defaultData.name);
          }
        }
      } catch (err) {
        console.error("❌ 그룹 정보 불러오기 실패:", err);
      }
    };

    fetchGroupInfo();
  }, []);

  const publicSpaces = spaces.filter((s) => s.space_type === 0);
  const privateSpaces = spaces.filter((s) => s.space_type === 1);

  const handleClick = (space) => {
    getSelectedData(space);
    setClickActive(space.name);
    localStorage.setItem("lastSidebarData", JSON.stringify(space));
  };

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
              key={space.id}
              onClick={() => handleClick(space)}
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
              key={space.id}
              onClick={() => handleClick(space)}
              className={`sidebar-list-item sidebar-list-item${
                clickActive === space.name ? "_active" : ""
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
