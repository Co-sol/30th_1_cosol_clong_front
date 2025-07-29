import "./PListItem.css";
import Button from "../../../Button";
import axiosInstance from "../../../../api/axiosInstance";
import { useContext } from "react";
import { TriggerSetStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const PListItem = ({
    isEditMode,
    item,
    selectedName,
    owner,
    setCheckListData,
}) => {
    const setTrigger = useContext(TriggerSetStateContext);

    const onDelete = async () => {
        try {
            const res = await axiosInstance.delete(
                `/checklists/checklist-items/${item.id}/delete/`
            );
            if (res.data.success) {
                console.log(res.data.message);
                setCheckListData((prev) =>
                    prev.filter((i) => i.id !== item.id)
                );
                setTrigger((prev) => (prev += 1));
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const onWait = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("AccessToken 없음");
            const res = await axiosInstance.patch(
                `/checklists/checklist-items/${item.id}/complete/`
            );
            if (res.data.success) {
                console.log(res.data.message);
                setCheckListData(
                    (prev) => prev.filter((i) => i.id !== item.id) // prev.map((i) => (i.id === id ? { ...i, wait: 1 } : i))
                );
                setTrigger((prev) => (prev += 1));
            }
        } catch (error) {
            console.error("완료 처리 실패:", error);
        }
    };

    return (
        <div className="PListItem">
            <div className="place">{item.place}</div>
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            {isEditMode ? (
                <Button onClick={onDelete} type={"delete2"} text={"✕"} />
            ) : (
                // 로그인한 사용자만 '완료' 뜸
                owner === selectedName && (
                    <Button onClick={onWait} type={"done"} text={"완료"} />
                )
            )}
        </div>
    );
};

export default PListItem;
