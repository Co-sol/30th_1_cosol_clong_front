import "./GEvalItem.css";
import { getBadgeImage } from "../../utils/get-badge-images";
import EmptyStar_img from "../../assets/EmptyStar_img.PNG";
import FullStar_img from "../../assets/FullStar_img.PNG";
import StarRating from "./StarRating";
import { useContext, useState, useEffect } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { resultTextMockData } from "../../data/cleanType";
import axiosInstance from "../../api/axiosInstance";

const GEvalItem = ({ person, getRating, currentUser }) => {
    const [isClick, setIsClick] = useState(0);
    // const { waitRating } = useContext(toCleanStateContext);

    // 로컬스토리지에서 이전 평가 불러오기 (짜피 웹 껐다키면 저장정보 날아가니까 )
    useEffect(() => {
        const lastRatingInfo = JSON.parse(
            localStorage.getItem(`lastRatingInfo_${currentUser.name}`)
        );
        if (lastRatingInfo) {
            const matched = lastRatingInfo.find(
                (item) => item.user_email === person.email
            );
            if (matched) setIsClick(matched.rating);
        }
    }, [person.email]);

    const onClickStar = async (n) => {
        setIsClick(n);
        getRating({ user_email: person.email, rating: n });
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
                    {resultTextMockData[person.clean_type].key}
                </div>
                <div className="cleanPersonality_dis">
                    {resultTextMockData[person.clean_type].title}
                </div>
            </section>
            {/* isClick(클릭한 n번째 별)값보다 이전 별들은 저절로 색칠되도록 논리짬(my) */}
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
