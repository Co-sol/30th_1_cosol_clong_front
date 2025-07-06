import "./PList.css";
import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";

import PListItem from "./PListItem";
import Button from "../Button";
import PListAddModal from "./PListAddModal";
import { getBadgeImage } from "../../utils/get-badge-images";

const PList = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);
    const [isEditMode, setIsEditMode] = useState(false);
    const [text, setText] = useState("편집");
    const [isAddMode, setIsAddMode] = useState(false);

    // 나중에 사이드바 선택된 애들로 바꿀것
    const selectedName = "A";
    const selectedBadgeId = 1;
    const targetPersonData = checkListData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName)
    );
    const targetPlaceData = placeData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName)
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

    // 어짜피 targetPersonData는 1명에 대한 data기에 badgeId가 동일할거라 targetPersonData[0]으로 통일시킴
    // img에 getBadgeImage(targetPersonData[0].badgeId)로 데이터 불러오니까 item 삭제했을 때, 불러올 객체가 삭제되서 오류난거
    // selectedBadgeId = 1; 따로 정해줘서 해결 (나중에 사이드바에서 클릭한거로 바꾸면 되니까)
    return (
        <div className="PList">
            <h3>To-clean</h3>
            <Button onClick={onClickEditMode} text={text} type={"edit"} />
            <div className="profile">
                <img src={getBadgeImage(selectedBadgeId)} />
            </div>
            <section className="title">
                <div className="place_text">공간</div>
                <div className="toclean_text">to-clean</div>
                <div className="deadLine_text">마감기한</div>
            </section>
            <div className="scrollBar">
                {targetPersonData.map((item) => (
                    <PListItem isEditMode={isEditMode} item={item} />
                ))}
                {isEditMode && (
                    <Button onClick={onClickAdd} text={"+"} type={"add2"} />
                )}
                {isAddMode && (
                    <PListAddModal
                        isAddMode={isAddMode}
                        setIsAddMode={setIsAddMode}
                        targetPersonData={targetPersonData}
                        targetPlaceData={targetPlaceData}
                    />
                )}
            </div>
        </div>
    );
};

export default PList;
