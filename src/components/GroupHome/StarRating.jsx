import FullStar_img from "../../assets/FullStar_img.PNG";
import EmptyStar_img from "../../assets/EmptyStar_img.PNG";

const StarRating = ({ rating }) => {
    return (
        <div>
            {Array.from({ length: 5 }).map((__, idx) => (
                <img
                    src={idx < rating ? FullStar_img : EmptyStar_img}
                    style={{
                        marginRight: "clamp(3.12px ,0.24vw ,3.5px)",
                        width: "clamp(19.63px ,1.53vw ,22.0px)",
                        height: "clamp(19.63px ,1.53vw ,22.0px)",
                    }}
                />
            ))}
        </div>
    );
};

export default StarRating;
