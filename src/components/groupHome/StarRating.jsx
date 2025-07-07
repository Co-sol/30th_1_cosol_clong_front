import FullStar_img from "../../assets/FullStar_img.PNG";
import EmptyStar_img from "../../assets/EmptyStar_img.PNG";

const StarRating = ({ rating }) => {
    return (
        <>
            {Array.from({ length: 5 }).map((__, idx) => (
                <img src={idx < rating ? FullStar_img : EmptyStar_img} />
            ))}
        </>
    );
};

export default StarRating;
