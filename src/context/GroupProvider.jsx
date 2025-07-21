// context/GroupProvider.jsx
import { toCleanStateContext, toCleanDispatchContext } from "./GroupContext";
import { useReducer, useState, useRef } from "react";
// import axiosInstance from "../../api/axiosInstance";

// const getCheckListINfo = async () => {
//       try {
//         const response = await axiosInstance.get(`/checklists/spaces/${spaceId}/checkList/`);
//         console.log(response.data);
//       } catch (error) {
//         console.error("회원 정보 조회:", error);
//         return false;
//       }
// }

const placeMockData = [
    {
        target: "group",
        name: "A",
        parentPlace: "none",
        place: "거실",
    },
    {
        target: "group",
        name: "B",
        parentPlace: "none",
        place: "부엌",
    },
    {
        target: "group",
        name: "B",
        parentPlace: "none",
        place: "신발장",
    },
    {
        target: "group",
        name: "C",
        parentPlace: "none",
        place: "신발장",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방1",
        place: "책상",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방1",
        place: "책상",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방1",
        place: "침대",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방2",
        place: "바닥",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방2",
        place: "책장",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방2",
        place: "옷장",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방2",
        place: "거울",
    },
    {
        target: "person",
        name: "B",
        parentPlace: "B의 방",
        place: "화장실",
    },
    {
        target: "person",
        name: "B",
        parentPlace: "B의 방",
        place: "침대",
    },
    {
        target: "person",
        name: "B",
        parentPlace: "B의 방",
        place: "책상",
    },
];

const groupMockData = {
    group_name: "Clong",
    group_rule: `* 설거지는 당일에\n* 씻고서 머리카락은 바로 치우기\n* 환기는 하구에 한 번씩`,
    members: [
        "A@example.com",
        "B@example.com",
        "C@example.com",
        "D@example.com",
    ],
};

const personMockData = [
    {
        name: "A",
        badgeId: 1,
        email: "A@email.com",
        pw: "1111",
        cleanSensitivity: 50,
        cleanPersonality: ["CRSL", "✨정리 요정형"],
        rating: 2,
        done: 0,
    },
    {
        name: "B",
        badgeId: 2,
        email: "B@email.com",
        pw: "2222",
        cleanSensitivity: 80,
        cleanPersonality: ["DRQL", "⚡효율 정리꾼형"],
        rating: 1,
        done: 0,
    },
    {
        name: "C",
        badgeId: 3,
        email: "C@email.com",
        pw: "333",
        cleanSensitivity: 30,
        cleanPersonality: ["DASL", "💡계획형 게으름러"],
        rating: 0,
        done: 0,
    },
    {
        name: "D",
        badgeId: 4,
        email: "D@email.com",
        pw: "444",
        cleanSensitivity: 20,
        cleanPersonality: ["DAQI", "🫠카오스형"],
        rating: 0,
        done: 0,
    },
];

const waitMockRating = [
    {
        name: "A",
        rating: 0,
    },
    {
        name: "B",
        rating: 0,
    },
    {
        name: "C",
        rating: 0,
    },
    {
        name: "D",
        rating: 0,
    },
];

// 한번에 모든 정보를 담고, map으로 찾을 생각 (첨엔, group/person으로 나눴었는데, 짜피 target=group/personal 정보도 저장하니 굳이 싶어 구분없앰)
const checkListMockData = [
    {
        target: "group",
        id: 1,
        name: "A",
        badgeId: 1,
        parentPlace: "none",
        place: "거실",
        toClean: "tv 닦기rrrrrrrrrrr",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "group",
        id: 2,
        name: "B",
        badgeId: 2,
        parentPlace: "none",
        place: "부엌",
        toClean: "설거지하기",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "group",
        id: 3,
        name: "B",
        badgeId: 2,
        parentPlace: "none",
        place: "부엌",
        toClean: "가스레인지 닦기",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "group",
        id: 4,
        name: "B",
        badgeId: 2,
        parentPlace: "none",
        place: "신발장",
        toClean: "신발 정리",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "group",
        id: 5,
        name: "C",
        badgeId: 3,
        parentPlace: "none",
        place: "신발장",
        toClean: "신발 정리",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "group",
        id: 6,
        name: "C",
        badgeId: 3,
        parentPlace: "none",
        place: "신발장",
        toClean: "신발 정리",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 7,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방1",
        place: "책상",
        toClean: "책상 정리",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 8,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방1",
        place: "침대",
        toClean: "침대 이불 게기",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 9,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방2",
        place: "바닥",
        toClean: "바닥 쓸기",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 10,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방2",
        place: "책장",
        toClean: "책 정리",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 11,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방2",
        place: "책장",
        toClean: "책 정리",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 12,
        name: "A",
        badgeId: 1,
        parentPlace: "A의 방2",
        place: "책장",
        toClean: "책 정리",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 13,
        name: "B",
        badgeId: 2,
        parentPlace: "B의 방",
        place: "책장",
        toClean: "책 정리",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 14,
        name: "B",
        badgeId: 2,
        parentPlace: "B의 방",
        place: "책장",
        toClean: "책 정리",
        deadLine: "D-2",
        due_data: "2025-07-01",
        wait: 0,
    },
    {
        target: "person",
        id: 15,
        name: "C",
        badgeId: 3,
        parentPlace: "C의 방",
        place: "침대",
        toClean: "이불 개기",
        deadLine: "D-day",
        due_data: "2025-07-01",
        wait: 0,
    },
];

function reducer(data, action) {
    switch (action.type) {
        case "CREATE":
            return [...data, action.data];
        case "UPDATE":
            return data.map((item) =>
                String(item.id) === String(action.data.id) ? action.data : item
            );
        case "WAIT":
            return data.map((item) =>
                item.id === action.id ? { ...item, wait: 1 } : item
            );
        case "DELETE":
            return data.filter((item) => String(item.id) !== String(action.id));
        default:
            return data;
    }
}

const GroupProvider = ({ children }) => {
    const [checkListData, dispatch] = useReducer(reducer, checkListMockData);
    const [personData, setPersonData] = useState(personMockData);
    const [placeData, setPlaceData] = useState(placeMockData);
    const [groupData, setGroupData] = useState(groupMockData);
    const idRef = useRef(16);

    const [currentUser, setCurrentUser] = useState({
        name: "A",
        badgeId: 1,
        email: "A@email.com",
    });

    const [waitRating, setWaitRating] = useState(waitMockRating);

    const onCreate = (
        target,
        name,
        badgeId,
        parentPlace,
        place,
        toClean,
        deadLine,
        due_data
    ) => {
        dispatch({
            type: "CREATE",
            data: {
                target,
                id: idRef.current++,
                name,
                badgeId,
                parentPlace,
                place,
                toClean,
                deadLine,
                due_data,
                wait: 0,
            },
        });
    };

    console.log(checkListData);

    // const onUpdate = (target, id, name, badgeId, place, toClean, deadLine) => {
    //     dispatch({
    //         type: "UPDATE",
    //         data: {
    //             target,
    //             id,
    //             name,
    //             badgeId,
    //             place,
    //             toClean,
    //             deadLine,
    //         },
    //     });
    // };

    const onDelete = (id) => {
        dispatch({
            type: "DELETE",
            id,
        });
    };

    const onWait = (id) => {
        dispatch({
            type: "WAIT",
            id,
        });
    };

    return (
        <toCleanDispatchContext.Provider value={{ onCreate, onDelete, onWait }}>
            <toCleanStateContext.Provider
                value={{
                    checkListData,
                    personData,
                    placeData,
                    currentUser,
                    waitRating,
                    groupData,
                }}
            >
                {children}
            </toCleanStateContext.Provider>
        </toCleanDispatchContext.Provider>
    );
};

export default GroupProvider;
