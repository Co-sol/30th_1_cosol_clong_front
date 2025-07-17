import { useContext } from "react";
import { toCleanDispatchContext } from "../../context/GroupContext";
import Button from "../Button";
import "./TListItem.css";

const TListItem = ({ item }) => {
    const { onWait } = useContext(toCleanDispatchContext);

    const onClickWait = () => {
        onWait(item.id);
    };

    return (
        <div className="TListItem">
            <div className="target">
                {item.target === "group" ? "그룹" : "개인"}
            </div>
            <div className="place">{item.place}</div>
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            <Button onClick={onClickWait} type={"done"} text={"완료"} />
        </div>
    );
};

export default TListItem;
