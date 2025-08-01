import "./GListItem.css";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import Button from "../../../Button";
import axiosInstance from "../../../../api/axiosInstance";
import { useContext, useState, useRef, useEffect } from "react";
import { TriggerSetStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const GListItem = ({ isEditMode, item = {}, setCheckListData, owner }) => {
  const setTrigger = useContext(TriggerSetStateContext);
  const [isSaving, setIsSaving] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const imgRef = useRef(null);

  const onDelete = async (id) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await axiosInstance.delete(`/checklists/checklist-items/${id}/delete/`);
      if (res?.data?.success) {
        setCheckListData((prev) => prev.filter((i) => i.id !== id));
        setTrigger((prev) => prev + 1);
      }
    } catch (e) {
      console.error("삭제 실패:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const onWait = async (id) => {
    if (isSaving) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    setIsSaving(true);
    try {
      const res = await axiosInstance.patch(
        `/checklists/checklist-items/${id}/complete/`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res?.data?.success) {
        setCheckListData((prev) => prev.filter((i) => i.id !== id));
        setTrigger((prev) => prev + 1);
      }
    } catch (e) {
      console.error("완료 실패:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const isOwner = owner?.trim() === item?.name?.trim();

  const tooltipText = (() => {
    const parts = [];
    if (item.name) parts.push(`${item.name}`);
    return parts.join(" | ") || "항목 정보";
  })();

  return (
    <div className="GListItem" style={{ position: "relative" }}>
      <div
        style={{ display: "inline-block", position: "relative" }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <img
          ref={imgRef}
          className={`Badge Badge_${item.badgeId}`}
          src={getBadgeImage(item.badgeId)}
          alt={`${item.name || "사용자"}의 배지`}
          style={{ display: "block" }}
        />
        {showTip && (
          <div
            style={{
              position: "absolute",
              top: "100%", // 아래로
              left: "50%",
              transform: "translate(-50%, 3px)", // 약간 떨어뜨림
              background: "#E2FDEF",
              color: "#000",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            {tooltipText}
          </div>
        )}
      </div>
      <div className="toClean">{item.toClean}</div>
      <div className="deadLine">{item.deadLine}</div>
      {isEditMode ? (
        <Button onClick={() => onDelete(item.id)} type="delete" text="✕" />
      ) : (
        isOwner && <Button onClick={() => onWait(item.id)} type="done" text="완료" />
      )}
      {isSaving && (
        <div className="save-overlay-item">
          <div className="save-spinner-item" />
          <div className="save-message-item" />
        </div>
      )}
    </div>
  );
};

export default GListItem;
