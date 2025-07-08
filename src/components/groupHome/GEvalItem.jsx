import { getBadgeImage } from "../../utils/get-badge-images";
import "./GEvalItem.css";
import Button from "../Button";
import TListModal from "./TListModal";
import { useState } from "react";
import StarRating from "./StarRating";

const GEvalItem = ({ person }) => {
    const [isClick, setIsClick] = useState(false);

    const onClickTList = () => {
        setIsClick(true);
    };
    const onCloseTList = () => {
        setIsClick(false);
    };

    return (
        <div className="GEvalItem">
            <section className="left">
                <img
                    className="Badge_img"
                    src={getBadgeImage(person.badgeId)}
                />
                <div className="name">{person.name}</div>
            </section>
            <section className="right">
                <div>
                    <StarRating rating={person.rating} />
                </div>
                <Button
                    onClick={onClickTList}
                    text={"청소 리스트"}
                    type={"list"}
                />
                {/*
                <바깥을 클릭해도 onClose 실행되는 이유>
                    첫 div에 onClose(모달 바깥공간 클릭해도 onClose 실행), 두번째 div에 onClose 막음 (안쪽은 클릭해도 안닫힘), X버튼 클릭하면 onClose 실행
                    안쪽에서 onClose 막히는 이유: e.stopPropagation으로 자식에서 부모로 onClost 전파되는거 막았기 때문
                    저거 안쓰면 부모까지 전파되서 onClose 실행되고 안쪽 클릭해도 Modal창 닫힘
                */}
                {isClick && (
                    <TListModal
                        person={person}
                        isOpen={isClick}
                        onClose={onCloseTList}
                    />
                )}
            </section>
        </div>
    );
};

export default GEvalItem;
