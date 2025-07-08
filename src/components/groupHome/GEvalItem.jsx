import { getBadgeImage } from "../../utils/get-badge-images";

const GEvalItem = ({ person }) => {
    return (
        <div>
            <img src={getBadgeImage(person.badgeId)} />
            <div>{person.name}</div>
            <div>
                <div>청소완료</div>
                <div>{person.done}</div>
            </div>
            <div></div>
        </div>
    );
};

export default GEvalItem;
