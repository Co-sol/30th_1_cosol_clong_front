import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";

const NeedClean = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);
    const [top3List, setTop3List] = useState([]);

    // 장소 중복 제거
    let difPlace = [];
    placeData.forEach((item) => {
        !difPlace.includes(item.place) && difPlace.push(item.place);
    });
    console.log(difPlace);

    let top = [];
    difPlace.forEach((item_i, i) => {
        top[i] = { place: item_i, cnt: 0 };
        checkListData.forEach(
            (item_j) =>
                item_i === item_j.place &&
                ((top[i].place = item_i), top[i].cnt++)
        );
    });
    console.log(top);

    return (
        <div className="NeedClean">
            <h3>지금 가장 청소가 필요한 공간</h3>
            {top3List.map((item) => (
                <NCleanItem item={item} />
            ))}
        </div>
    );
};

export default NeedClean;
