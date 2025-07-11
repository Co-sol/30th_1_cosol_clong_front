import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";

// list 안에 obj 있는가? ('값' 비교 하려는것, '참조'가 아니라)
const findObj = (list, obj) => {
    return list.some((item) => JSON.stringify(item) === JSON.stringify(obj));
};

const NeedClean = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);

    // 장소 중복 제거 (group별 장소, person별 '이름의 방'만 중복 없이 걸러내는 것)
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

    // '모든' 장소별 할 일 개수 세는 것
    let top = [];
    difPlace.forEach((item_i, i) => {
        // 장소별로
        top[i] = { lateId: 0, place: item_i.place, cnt: 0 }; //
        let max = 0; // id 중 최대 찾으려는 것
        checkListData.forEach((item_j) => {
            // todo 리스트에 얼마나 있는지 세는 것
            if (item_j.target === "group") {
                // 그룹 todo 중에
                item_i.place === item_j.place && // 장소 n에 해당하는게
                    ((top[i].lateId = item_j.id > max ? item_j.id : max),
                    (top[i].place = item_i.place),
                    top[i].cnt++); // 몇 개 있는지
            } else if (item_j.target === "person") {
                item_i.place === item_j.name &&
                    ((top[i].lateId = item_j.id > max ? item_j.id : max),
                    (top[i].place = `${item_i.place}의 방`),
                    top[i].cnt++);
            }
        });
    });

    // sort함수 (top 정렬하는 것)
    // return: 양수 -> 자리 바꿈, 음수 -> 자리 유지
    top.sort((a, b) => {
        if (a.cnt !== b.cnt) {
            // 할 일 많은 순으로 내림차순 (양수면 자리 바꿈)
            return b.cnt - a.cnt;
        } else {
            // 동점자는 id 큰 순으로 내림차순 (양수면 자리 바꿈)
            return b.lateId - a.lateId;
        }
    });

    // '상위 3개' 추출 (동점은 id 기준, 이미 sort해둬서 idx 3미만에서 끊으면 저절로 구해짐)
    const top3List = top.filter((item, idx) => idx < 3);

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
