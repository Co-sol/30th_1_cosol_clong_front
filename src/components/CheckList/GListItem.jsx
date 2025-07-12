import "./GListItem.css";
import { getBadgeImage } from "../../utils/get-badge-images";
import Button from "../Button";
import { useContext } from "react";
import { toCleanDispatchContext } from "../../pages/GroupSpacePage";

const GListItem = ({ isEditMode, item }) => {
    const { onDelete } = useContext(toCleanDispatchContext);
    const onClickDelete = () => {
        onDelete(item.target, item.id);
    };

    return (
        <div className="GListItem">
            <img
                className={`Badge Badge_${item.badgeId}`}
                src={getBadgeImage(item.badgeId)}
            />
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            {isEditMode ? (
                <Button onClick={onClickDelete} type={"delete"} text={"✕"} />
            ) : (
                <Button type={"done"} text={"완료"} />
            )}
        </div>
    );
};

export default GListItem;
