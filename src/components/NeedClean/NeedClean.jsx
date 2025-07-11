import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";

// list 안에 obj 있는가? ('값' 비교 하려는것, '참조'가 아니라)
const findObj = (list, obj) => {
    return list.some((item) => JSON.stringify(item) === JSON.stringify(obj));
};

const NeedClean = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);
    const [top3List, setTop3List] = useState([]);

    // // 장소 중복 제거
    // let difPlace = { group: [], person: [] };
    // placeData.forEach((item) => {
    //     if (item.target === "group") {
    //         !difPlace[item.target].includes(item.place) &&
    //             difPlace[item.target].push(item.place);
    //     } else if (item.target === "person") {
    //         !difPlace[item.target].includes(item.name) &&
    //             difPlace[item.target].push(item.name);
    //     }
    // });
    // console.log(difPlace);

    // // 장소별 체크리스트 출현개수 세는 것
    // let top = [];
    // difPlace.forEach((item_i, i) => {
    //     top[i] = { place: item_i, cnt: 0 };
    //     checkListData.forEach(
    //         (item_j) =>
    //             item_i === item_j.place &&
    //             ((top[i].place = item_i), top[i].cnt++)
    //     );
    // });
    // console.log(top);

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

    // 장소별 체크리스트 출현개수 세는 것
    let top = [];
    difPlace.forEach((item_i, i) => {
        top[i] = { place: item_i, cnt: 0 };
        checkListData.forEach(
            (item_j) =>
                item_i === item_j.place &&
                ((top[i].place = item_i), top[i].cnt++)
        );
    });
    // console.log(top);

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
