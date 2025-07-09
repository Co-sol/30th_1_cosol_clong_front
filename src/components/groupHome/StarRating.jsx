import FullStar_img from "../../assets/FullStar_img.PNG";
import EmptyStar_img from "../../assets/EmptyStar_img.PNG";

const StarRating = ({ rating }) => {
    return (
        <div>
            {Array.from({ length: 5 }).map((__, idx) => (
                <img
                    src={idx < rating ? FullStar_img : EmptyStar_img}
                    style={{
                        marginRight: "clamp(2.49px,0.243vw,3.5px)",
                        width: "clamp(15.64px,1.53vw,22px)",
                        height: "clamp(15.64px,1.53vw,22px)",
                    }}
                />
            ))}
        </div>
    );
};

export default StarRating;
