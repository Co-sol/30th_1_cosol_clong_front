import { useContext, useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toCleanDispatchContext } from "../../context/GroupContext";
import Button from "../Button";
import "./TListItem.css";

const TListItem = ({ item, owner }) => {
    // const { onWait } = useContext(toCleanDispatchContext);
    const [isSaving, setIsSaving] = useState(false);

    const onClickWait = async () => {
        setIsSaving(true);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return alert("로그인이 필요합니다.");
        try {
            await axiosInstance.patch(
                `/checklists/checklist-items/${item.id}/complete/`,
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            window.location.reload(); // 빠른 갱신 위해 전체 리렌더
        } catch (error) {
            console.error("완료 처리 실패:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="TListItem">
            <div className="target">
                {item.target === "group" ? "그룹" : "개인"}
            </div>
            <div className="place">{item.place}</div>
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            {owner === item.name && (
                <Button onClick={onClickWait} type={"done"} text={"완료"} />
            )}
            {isSaving && (
                <div className="save-overlay">
                    <div className="save-spinner"></div>
                    <div className="save-message"></div>
                </div>
            )}
        </div>
    );
};

export default TListItem;
