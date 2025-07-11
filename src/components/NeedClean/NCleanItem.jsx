import "./NCleanItem.css";

const NCleanItem = ({ item, idx }) => {
    return (
        <div className="NCleanItem">
            <div>{idx + 1}</div>
            <div>{item.place}</div>
            <div>{item.cnt}</div>
        </div>
    );
};

export default NCleanItem;
