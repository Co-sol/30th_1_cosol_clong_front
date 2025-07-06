import { getBadgeImage } from "../../utils/get-badge-images";
import "./GEvalItem.css";
import Button from "../Button";
import TListModal from "./TListModal";
import { useState } from "react";

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
                <div>stars</div>
                <Button
                    onClick={onClickTList}
                    text={"청소 리스트"}
                    type={"list"}
                />
                {isClick && (
                    <TListModal isOpen={isClick} onClose={onCloseTList} />
                )}
            </section>
        </div>
    );
};

export default GEvalItem;
