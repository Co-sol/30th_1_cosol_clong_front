import "./PList.css";
import { useContext, useState } from "react";
import { toCleanStateContext } from "../../../../context/GroupContext";

import PListItem from "./PListItem";
import Button from "../../../Button";
import PListAddModal from "./PListAddModal";
import { getBadgeImage } from "../../../../utils/get-badge-images";

const PList = ({ selectedName, selectedParentPlace }) => {
    const { personData, checkListData, placeData } =
        useContext(toCleanStateContext);
    const [isEditMode, setIsEditMode] = useState(false);
    const [text, setText] = useState("편집");
    const [isAddMode, setIsAddMode] = useState(false);

    const findBadgeId = (personData) => {
        for (let i = 0; i < personData.length; i++) {
            if (personData[i].name === selectedName) {
                return personData[i].badgeId;
            }
        }
    };

    // 나중에 사이드바 선택된 애들로 바꿀것
    const selectedBadgeId = findBadgeId(personData);

    // 개인별 todo 뽑아내는 것
    const targetPersonData = checkListData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName) &&
            String(item.parentPlace) === String(selectedParentPlace) && // checkListDate에 parentPlace도 추가 (place를 'A의 방' 내부 공간들로 잡아서, 'A의 방'을 부를 명칭 정하는 것, 공용공간의 '거실'은 그 안에 세부 공간이 있지는 않으니까)
            item.wait !== 1
    );

    // Edit창에서 장소 선택지 띄워줄 때 쓰려고 PListItem 밖에서 거르는 것
    const targetPlaceData = placeData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName) &&
            String(item.parentPlace) === String(selectedParentPlace) // checkListDate에 parentPlace도 추가 (place를 'A의 방' 내부 공간들로 잡아서, 'A의 방'을 부를 명칭 정하는 것, 공용공간의 '거실'은 그 안에 세부 공간이 있지는 않으니까)
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
                        selectedName={selectedName}
                        selectedBadgeId={selectedBadgeId}
                        selectedParentPlace={selectedParentPlace}
                    />
                )}
            </div>
        </div>
    );
};

export default PList;
