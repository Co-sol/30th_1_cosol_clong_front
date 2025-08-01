import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../Button";
import "./TListItem.css";

const TListItem = ({ item, owner, onCompleted }) => {
  const [isSaving, setIsSaving] = useState(false);

  const onClickWait = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      setIsSaving(false);
      return;
    }
    try {
      const res = await axiosInstance.patch(
        `/checklists/checklist-items/${item.id}/complete/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.data?.success) {
        onCompleted?.(item.id);
      }
    } catch (error) {
      console.error("완료 처리 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="TListItem">
      <div className="target">{item.target === "group" ? "그룹" : "개인"}</div>
      <div className="place">{item.place}</div>
      <div className="toClean">{item.toClean}</div>
      <div className="deadLine">{item.deadLine}</div>
      {owner === item.name && (
        <Button onClick={onClickWait} type={"done"} text={"완료"} disabled={isSaving} />
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
