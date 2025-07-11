import "./NCleanItem.css";

const NCleanItem = ({ item, idx }) => {
    return (
        <div className="NCleanItem">
            <div className="rank">{idx + 1}</div>
            <div className="place">{item.place}</div>
            <div className="cnt">
                {item.cnt}
                <div className="unit">{"개"}</div>
            </div>
        </div>
    );
};

export default NCleanItem;
