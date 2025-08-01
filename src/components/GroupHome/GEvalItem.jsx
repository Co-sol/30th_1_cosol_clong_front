import "./GEvalItem.css";
import { getBadgeImage } from "../../utils/get-badge-images";
import EmptyStar_img from "../../assets/EmptyStar_img.png";
import FullStar_img from "../../assets/FullStar_img.png";
import { useState, useEffect } from "react";
import { resultTextMockData } from "../../data/cleanType";

const GEvalItem = ({ person = {}, getRating, currentUser = {} }) => {
    const [isClick, setIsClick] = useState(0);

    // clean_type 안전하게 가져오기, 없으면 기본값
    const cleanTypeData = (person.clean_type != null &&
        resultTextMockData[person.clean_type]) || {
        key: "...",
        title: "...",
    };

    // 로컬스토리지에서 이전 평가 불러오기
    useEffect(() => {
        if (!currentUser.name || !person.email) return;
        let lastRatingInfo;
        try {
            lastRatingInfo = JSON.parse(
                localStorage.getItem(`lastRatingInfo_${currentUser.name}`) ||
                    "[]"
            );
        } catch (e) {
            console.warn("로컬스토리지 파싱 실패", e);
            lastRatingInfo = [];
        }
        const matched =
            Array.isArray(lastRatingInfo) &&
            lastRatingInfo.find((item) => item.user_email === person.email);
        if (matched) setIsClick(matched.rating);
    }, [person.email, currentUser.name]);

    const onClickStar = (n) => {
        if (!person.email) return;
        setIsClick(n);
        getRating({ user_email: person.email, rating: n });
    };

    return (
        <div className="GEvalItem">
            <img src={getBadgeImage(person.badgeId || 0)} alt="badge" />
            <div className="name_text">{person.name || "..."}</div>
            <section className="done_section">
                <div className="done_text">청소 완료</div>
                <div className="done_count">
                    {person.done != null ? person.done : 0}
                </div>
            </section>
            <section className="cleanPersonality_section">
                <div className="cleanPersonality_type">{cleanTypeData.key}</div>
                <div className="cleanPersonality_dis">
                    {cleanTypeData.title}
                </div>
            </section>
            <div className="rating">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        className="star"
                        key={n}
                        onClick={() => onClickStar(n)}
                        aria-label={`${n} stars`}
                    >
                        {isClick >= n ? (
                            <img src={FullStar_img} alt="full star" />
                        ) : (
                            <img src={EmptyStar_img} alt="empty star" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GEvalItem;
