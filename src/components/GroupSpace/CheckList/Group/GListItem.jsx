import "./GListItem.css";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import Button from "../../../Button";
import axiosInstance from "../../../../api/axiosInstance";
import { useContext } from "react";
import { TriggerSetStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const GListItem = ({ isEditMode, item, setCheckListData, owner }) => {
    const setTrigger = useContext(TriggerSetStateContext);
    console.log(owner);
    const onDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(
                `/checklists/checklist-items/${id}/delete/`
            );
            if (res.data.success) {
                setCheckListData((prev) => prev.filter((i) => i.id !== id));
                setTrigger((prev) => prev + 1);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const onWait = async (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const res = await axiosInstance.patch(
                `/checklists/checklist-items/${id}/complete/`,
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            if (res.data.success) {
                setCheckListData((prev) =>
                    prev.map((i) => (i.id === id ? { ...i, wait: 1 } : i))
                );
                setTrigger((prev) => prev + 1);
            }
        } catch (error) {
            console.error("완료 실패:", error);
        }
    };

    return (
        <div className="GListItem">
            <img
                className={`Badge Badge_${item.badgeId}`}
                src={getBadgeImage(item.badgeId)}
                alt="badge"
            />
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            {isEditMode ? (
                <Button
                    onClick={() => onDelete(item.id)}
                    type="delete"
                    text="✕"
                />
            ) : (
                // 로그인한 사용자만 '완료' 뜸
                owner === item.name && (
                    <Button
                        onClick={() => onWait(item.id)}
                        type="done"
                        text="완료"
                    />
                )
            )}
        </div>
    );
};

export default GListItem;
