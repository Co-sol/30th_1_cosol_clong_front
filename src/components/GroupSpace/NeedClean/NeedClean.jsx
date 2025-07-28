import { useContext, useState } from "react";
import { toCleanStateContext } from "../../../context/GroupContext";
import NCleanItem from "./NCleanItem";
import "./NeedClean.css";

// list 안에 obj 있는가? ('값' 비교 하려는것, '참조'가 아니라)
const findObj = (list, obj) => {
    return list.some((item) => JSON.stringify(item) === JSON.stringify(obj));
};

const NeedClean = () => {
    const { checkListData, placeData } = useContext(toCleanStateContext);

    // 장소 중복 제거 (group별 장소, person별 '이름의 방'만 중복 없이 걸러내는 것)
    let difPlace = [];
    placeData.forEach((item) => {
        // console.log(item);
        // 그룹 todo면서
        if (item.target === "group") {
            !findObj(difPlace, { target: item.target, place: item.place }) && // difPlace 배열에 없는 장소면
                difPlace.push({ target: item.target, place: item.place }); // difPlace에 push (중복 없는 배열됨)
        } else if (item.target === "person") {
            !findObj(difPlace, {
                target: item.target,
                place: item.parentPlace, // 개인은 사이드바의 'A의 방1'안에 '책상, 침대 ...' 등 place 있는거라 상위공간인 parentPlace('A의 방1')를 place로 저장한 것
            }) &&
                difPlace.push({
                    target: item.target,
                    place: item.parentPlace,
                });
        }
    });
    // console.log(difPlace);

    // '모든' 장소별 할 일 개수 세는 것
    let top = [];
    difPlace.forEach((item_i, i) => {
        // 장소별로
        top[i] = { lateId: 0, place: item_i.place, cnt: 0 }; //
        let max = 0; // id 중 최대 찾으려는 것
        checkListData.forEach((item_j) => {
            // todo 리스트에 얼마나 있는지 세는 것
            // '그룹' todo 중에
            if (item_j.target === "group") {
                item_j.wait !== 1 && // 완료되지 않은 todo 아이템 중
                    item_i.place === item_j.place && // 해당 장소가
                    // top에 추가할 장소 객체 (id, place, cnt)
                    ((top[i].lateId = item_j.id > max ? item_j.id : max), // 동점자 기준으로 제일 큰 id 선택 (나중에 추가된게 제일 최신일 테니까)
                    (top[i].place = item_i.place), // 중복X 장소(difPlace)와 체크리스트 속 해당 장소가 몇갠지 비교
                    top[i].cnt++); // 몇 개 있는지 개수 추가
                // '개인' todo 중에
            } else if (item_j.target === "person") {
                item_j.wait !== 1 && // 완료되지 않은 todo 아이템 중
                    item_i.place === item_j.parentPlace && // 해당 장소가 (checkListData는 'A의 방1' 안에 책상, 침대... 있는거니, perentPalce인 'A의 방1'로 비교한 것)
                    ((top[i].lateId = item_j.id > max ? item_j.id : max), // 동점자 기준으로 제일 큰 id 선택 (나중에 추가된게 제일 최신일 테니까)
                    (top[i].place = item_i.place), // 중복X 장소(difPlace)와 체크리스트 속 해당 장소가 몇갠지 비교
                    top[i].cnt++); // 몇 개 있는지 개수 추가
            }
        });
    });
    // console.log(top);

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
            <div className="NCleanItem_wrapper">
                {top3List.map((item, idx) => (
                    <NCleanItem item={item} idx={idx} />
                ))}
            </div>
        </div>
    );
};

export default NeedClean;
