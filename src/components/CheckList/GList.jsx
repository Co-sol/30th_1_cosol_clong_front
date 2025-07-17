import "./GList.css";
import { useContext, useState } from "react";
import { toCleanStateContext } from "../../pages/GroupSpacePage";

import GListItem from "./GListItem";
import Button from "../Button";
import GListAddModal from "./GListAddModal";

const GList = () => {
    const { checkListData } = useContext(toCleanStateContext);
    const [isEditMode, setIsEditMode] = useState(false);
    const [text, setText] = useState("편집");
    const [isAddMode, setIsAddMode] = useState(false);

    const selectedPlace = "화장실";

    const groupData = checkListData.filter(
        (item) =>
            item.target === "group" &&
            String(item.place) === String(selectedPlace)
    );

    const onClickAdd = () => {
        setIsAddMode(!isAddMode);
    };

    const onClickEditMode = () => {
        setIsEditMode((prev) => {
            const next = !prev;
            setText(next ? "저장" : "편집");
            return next;
        });
    };

    return (
        <div className="GList">
            <h3>To-clean</h3>
            <Button onClick={onClickEditMode} text={text} type={"edit"} />
            <div className="place">{selectedPlace}</div>
            <section className="title">
                <div className="profile_text">프로필</div>
                <div className="to-clean_text">to-clean</div>
                <div className="deadLine_text">마감기한</div>
            </section>
            <div className="scrollBar">
                {groupData.map((item) => (
                    <GListItem isEditMode={isEditMode} item={item} />
                ))}
                {isEditMode && (
                    <Button onClick={onClickAdd} text={"+"} type={"add1"} />
                )}
                {isAddMode && (
                    <GListAddModal
                        type={"group"}
                        isAddMode={isAddMode}
                        setIsAddMode={setIsAddMode}
                        selectedPlace={selectedPlace}
                    />
                )}
            </div>
        </div>
    );
};

export default GList;
