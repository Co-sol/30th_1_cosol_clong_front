import "./PListItem.css";
import Button from "../Button";
import { useContext } from "react";
import { toCleanDispatchContext } from "../../context/GroupContext";

const PListItem = ({ isEditMode, item }) => {
    const { onDelete } = useContext(toCleanDispatchContext);
    const onClickDelete = () => {
        onDelete(item.id);
    };

    return (
        <div className="PListItem">
            <div className="place">{item.place}</div>
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

export default PListItem;
