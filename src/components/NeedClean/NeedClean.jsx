import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";

// list 안에 obj 있는가? ('값' 비교 하려는것, '참조'가 아니라)
const findObj = (list, obj) => {
    return list.some((item) => JSON.stringify(item) === JSON.stringify(obj));
};

const NeedClean = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);
    const [top3List, setTop3List] = useState([]);

    // 장소 중복 제거
    let difPlace = [];
    placeData.forEach((item) => {
        if (item.target === "group") {
            !findObj(difPlace, { target: item.target, place: item.place }) &&
                difPlace.push({ target: item.target, place: item.place });
        } else if (item.target === "person") {
            !findObj(difPlace, { target: item.target, place: item.name }) &&
                difPlace.push({ target: item.target, place: item.name });
        }
    });
    console.log(difPlace);

    // 장소별 할 일 개수 세는 것
    let top = [];
    difPlace.forEach((item_i, i) => {
        top[i] = { place: item_i.place, cnt: 0 };
        checkListData.forEach((item_j) => {
            if (item_j.target === "group") {
                item_i.place === item_j.place &&
                    ((top[i].place = item_i.place), top[i].cnt++);
            } else if (item_j.target === "person") {
                item_i.place === item_j.name &&
                    ((top[i].place = `${item_i.place}의 방`), top[i].cnt++);
            }
        });
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
