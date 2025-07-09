import "./GEvalItem.css";
import { getBadgeImage } from "../../utils/get-badge-images";
import FullStar_img from "../../assets/FullStar_img.PNG";

const GEvalItem = ({ person }) => {
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
                <button className="star">
                    <img src={FullStar_img} />
                </button>
                <button className="star">
                    <img src={FullStar_img} />
                </button>
                <button className="star">
                    <img src={FullStar_img} />
                </button>
                <button className="star">
                    <img src={FullStar_img} />
                </button>
                <button className="star">
                    <img src={FullStar_img} />
                </button>
            </div>
        </div>
    );
};

export default GEvalItem;
