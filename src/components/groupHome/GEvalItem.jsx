import "./GEvalItem.css";
import { getBadgeImage } from "../../utils/get-badge-images";
import EmptyStar_img from "../../assets/EmptyStar_img.PNG";
import FullStar_img from "../../assets/FullStar_img.PNG";
import StarRating from "./StarRating";
import { useState } from "react";

const GEvalItem = ({ person }) => {
    const [isClick, setIsClick] = useState(0);
    const onClickStar = (n) => {
        setIsClick(n);
    };

    return (
        <div className="GEvalItem">
            <img src={getBadgeImage(person.badgeId)} />
            <div className="name_text">{person.name}</div>
            <section className="done_section">
                <div className="done_text">청소 완료</div>
                <div className="done_count">{person.done}</div>
            </section>
            <section className="cleanPersonality_section">
                <div className="cleanPersonality_type">
                    {person.cleanPersonality[0]}
                </div>
                <div className="cleanPersonality_dis">
                    {person.cleanPersonality[1]}
                </div>
            </section>
            <div className="rating">
                <button className="star" onClick={() => onClickStar(1)}>
                    {isClick >= 1 ? (
                        <img src={FullStar_img} />
                    ) : (
                        <img src={EmptyStar_img} />
                    )}
                </button>
                <button className="star" onClick={() => onClickStar(2)}>
                    {isClick >= 2 ? (
                        <img src={FullStar_img} />
                    ) : (
                        <img src={EmptyStar_img} />
                    )}
                </button>
                <button className="star" onClick={() => onClickStar(3)}>
                    {isClick >= 3 ? (
                        <img src={FullStar_img} />
                    ) : (
                        <img src={EmptyStar_img} />
                    )}
                </button>
                <button className="star" onClick={() => onClickStar(4)}>
                    {isClick >= 4 ? (
                        <img src={FullStar_img} />
                    ) : (
                        <img src={EmptyStar_img} />
                    )}
                </button>
                <button className="star" onClick={() => onClickStar(5)}>
                    {isClick >= 5 ? (
                        <img src={FullStar_img} />
                    ) : (
                        <img src={EmptyStar_img} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default GEvalItem;
