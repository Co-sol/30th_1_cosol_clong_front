import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import homeImg from "../assets/home_img.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

function Sidebar({ onEditSpace, getSelectedData }) {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState([]);
    const [clickActive, setClickActive] = useState("");
    const [groupName, setGroupName] = useState("...");

    useEffect(() => {
        const fetchGroupInfo = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return console.warn("accessToken이 없습니다.");

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
                            owner: s.owner_email || null,
                        }))
                        .sort((a, b) => a.id - b.id);

                    setSpaces(parsedSpaces);

                    // 처음 mount시에만 localStorage에 저장 (처음에 saved undefined일 때 JSON.parse 안돼서 undefined면 null로 저장되게 함)
                    const saved = JSON.parse(
                        localStorage.getItem("lastSidebarData") || "null"
                    );

                    // 사이드바 초기 데이터:
                    // localStorage에 저장된게 있으면 그걸 반환
                    // localStorage에 저장된게 없으면 저장한 그룹공간 중 첫 데이터 반환
                    const defaultSpace =
                        saved || parsedSpaces.find((s) => s.space_type === 0);

                    if (defaultSpace) {
                        await selectSpace(defaultSpace);
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

    // 사이드바 클릭될 때마다 getSelectedData 실행돼야해서 밖에 뺌
    const selectSpace = async (space) => {
        setClickActive(space.name);
        localStorage.setItem("lastSidebarData", JSON.stringify(space));

        if (space.space_type === 1) {
            try {
                const res2 = await axiosInstance.post("/groups/check-user/", {
                    email: space.owner,
                });
                const ownerName = res2.data.data.UserInfo.name;
                getSelectedData({
                    ...space,
                    owner: ownerName,
                    isClickSidebar: true,
                });
            } catch (err) {
                console.error("❌ 사용자 이름 조회 실패:", err);
                getSelectedData({ ...space, isClickSidebar: true });
            }
        } else {
            getSelectedData({ ...space, owner: "all", isClickSidebar: true });
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-home">
                <div className="sidebar-home-inner">
                    <span className="sidebar-home-icon">
                        <img
                            src={homeImg}
                            alt="home"
                            style={{ width: 20, height: 17 }}
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
                            onClick={() => selectSpace(space)}
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
                            onClick={() => selectSpace(space)}
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
