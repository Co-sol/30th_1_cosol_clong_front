// context/GroupProvider.jsx
import { toCleanStateContext, toCleanDispatchContext } from "./GroupContext";
import { useReducer, useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

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
        place: "다용도실",
    },
    {
        target: "person",
        name: "A",
        parentPlace: "A의 방1",
        place: "화장실",
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
    group_rule: `* 설거지는 당일에\n* 씻고서 머리카락은 바로 치우기\n* 환기는  하구에 한 번씩`,
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
        case "DELETE":
            return data.filter((item) => String(item.id) !== String(action.id));
        case "WAIT":
            return data.map((item) =>
                item.id === action.id ? { ...item, wait: 1 } : item
            );
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
    const [waitRating, setWaitRating] = useState(waitMockRating);
    const [currentUser, setCurrentUser] = useState({
        name: "A",
        badgeId: 1,
        email: "A@email.com",
    });

    // 연동 성공
    // const [currentUser, setCurrentUser] = useState({});
    // // 연동 완료 후 이거로 갈아끼우기
    // useEffect(() => {
    //     const fetchUserInfo = async () => {
    //         try {
    //             // 1. access token 가져오기 & 디코딩 (이메일)
    //             const accessToken = localStorage.getItem("accessToken");
    //             if (!accessToken) throw new Error("No access token found");
    //             const decoded = jwtDecode(accessToken);
    //             const email = decoded.email;

    //             // 2. user 정보 가져오기 (이름, 뱃지 번호)
    //             const res2 = await axiosInstance.get("/groups/member-info/", {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 },
    //             });

    //             const user = res2.data.data.find(
    //                 (user) => user.email === email
    //             );
    //             if (!user) throw new Error("User not found in response");

    //             // 4. 사용자 정보 상태에 저장
    //             setCurrentUser({
    //                 name: user.name,
    //                 badgeId: user.profile,
    //                 email: email,
    //             });
    //         } catch (error) {
    //             console.error("회원 정보 조회 에러:", error);
    //         }
    //     };

    //     fetchUserInfo();
    // }, []);

    const onCreate = async (
        target,
        name,
        badgeId,
        parentPlace,
        place,
        toClean,
        deadLine,
        due_data
    ) => {
        let res2 = null;

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) throw new Error("No access token found");

            const decoded = jwtDecode(accessToken);
            const email = decoded.email;

            const res1 = await axiosInstance.get("/spaces/info/");
            const checklistIdData = res1.data.data.find(
                (space) =>
                    space.space_name === place ||
                    space.space_name === parentPlace
            );

            if (!checklistIdData) throw new Error("Checklist ID not found");

            const requestBody = {
                checklist_id: checklistIdData.space_id,
                email: email,
                title: toClean,
                due_date: due_data,
                unit_item: target === "person" ? place : null,
            };

            console.log("보낼 데이터:", requestBody);

            res2 = await axiosInstance.post("/checklists/create/", requestBody);
        } catch (error) {
            console.error(
                "체크리스트 추가 실패:",
                error.response?.data || error.message
            );
            return; // 실패 시 중단
        }

        if (!res2) {
            console.error("res2 is null - 백엔드 응답 없음");
            return;
        }

        dispatch({
            type: "CREATE",
            data: {
                target,
                id: res2.data.checklist_item.id, // 오류나면 catch로 바로 넘어가서 res2==null임 (try문에 들어가야 이 코드 실행)
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

    const onDelete = async (id) => {
        dispatch({
            type: "DELETE",
            id,
        });
        const checklist_item_id = id;
        try {
            const res = await axiosInstance.delete(
                `/checklists/checklist-items/${checklist_item_id}/delete/`
            );
            if (res.success) {
                console.log("체크리스트 삭제 성공:", res.success);
            } else {
                console.log("체크리스트 삭제 실패:", res.success);
            }
        } catch (error) {
            console.error("체크리스트 삭제 실패:", error);
        }
    };

    const onWait = async (id) => {
        dispatch({
            type: "WAIT",
            id,
        });
        try {
            const checklist_item_id = id;
            const res = axiosInstance.patch(
                `/checklists/checklist-items/${checklist_item_id}/complete/`
            );
            if (res.success) {
                console.log("체크리스트 완료 성공:", res.success);
            } else {
                console.log("체크리스트 완료 실패:", res.success);
            }
        } catch (error) {
            console.error("체크리스트 완료 실패:", error);
        }
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
