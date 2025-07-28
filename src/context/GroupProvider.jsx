// context/GroupProvider.jsx
import { toCleanStateContext, toCleanDispatchContext } from "./GroupContext";
import { useReducer, useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

// const placeMockData = [
//     {
//         target: "group",
//         name: "A",
//         parentPlace: "none",
//         place: "거실",
//     },
//     {
//         target: "group",
//         name: "B",
//         parentPlace: "none",
//         place: "부엌",
//     },
//     {
//         target: "group",
//         name: "B",
//         parentPlace: "none",
//         place: "신발장",
//     },
//     {
//         target: "group",
//         name: "C",
//         parentPlace: "none",
//         place: "신발장",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방1",
//         place: "책상",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방1",
//         place: "다용도실",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방1",
//         place: "화장실",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방2",
//         place: "바닥",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방2",
//         place: "책장",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방2",
//         place: "옷장",
//     },
//     {
//         target: "person",
//         name: "A",
//         parentPlace: "A의 방2",
//         place: "거울",
//     },
//     {
//         target: "person",
//         name: "B",
//         parentPlace: "B의 방",
//         place: "화장실",
//     },
//     {
//         target: "person",
//         name: "B",
//         parentPlace: "B의 방",
//         place: "침대",
//     },
//     {
//         target: "person",
//         name: "B",
//         parentPlace: "B의 방",
//         place: "책상",
//     },
// ];

// 제외
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

// const personMockData = [
//     {
//         name: "A",
//         badgeId: 1,
//         email: "A@email.com",
//         pw: "1111",
//         cleanSensitivity: 50,
//         clean_type: 0,
//         rating: 2,
//         done: 0,
//     },
//     {
//         name: "B",
//         badgeId: 2,
//         email: "B@email.com",
//         pw: "2222",
//         cleanSensitivity: 80,
//         clean_type: 1,
//         rating: 1,
//         done: 0,
//     },
//     {
//         name: "C",
//         badgeId: 3,
//         email: "C@email.com",
//         pw: "333",
//         cleanSensitivity: 30,
//         clean_type: 3,
//         rating: 0,
//         done: 0,
//     },
//     {
//         name: "D",
//         badgeId: 4,
//         email: "D@email.com",
//         pw: "444",
//         cleanSensitivity: 20,
//         clean_type: 4,
//         rating: 0,
//         done: 0,
//     },
// ];

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

// // 한번에 모든 정보를 담고, map으로 찾을 생각 (첨엔, group/person으로 나눴었는데, 짜피 target=group/personal 정보도 저장하니 굳이 싶어 구분없앰)
// const checkListMockData = [
//     {
//         target: "group",
//         id: 1,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "none",
//         place: "거실",
//         toClean: "tv 닦기rrrrrrrrrrr",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "group",
//         id: 2,
//         name: "B",
//         badgeId: 2,
//         parentPlace: "none",
//         place: "부엌",
//         toClean: "설거지하기",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "group",
//         id: 3,
//         name: "B",
//         badgeId: 2,
//         parentPlace: "none",
//         place: "부엌",
//         toClean: "가스레인지 닦기",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "group",
//         id: 4,
//         name: "B",
//         badgeId: 2,
//         parentPlace: "none",
//         place: "신발장",
//         toClean: "신발 정리",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "group",
//         id: 5,
//         name: "C",
//         badgeId: 3,
//         parentPlace: "none",
//         place: "신발장",
//         toClean: "신발 정리",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "group",
//         id: 6,
//         name: "C",
//         badgeId: 3,
//         parentPlace: "none",
//         place: "신발장",
//         toClean: "신발 정리",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 7,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방1",
//         place: "책상",
//         toClean: "책상 정리",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 8,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방1",
//         place: "침대",
//         toClean: "침대 이불 게기",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 9,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방2",
//         place: "바닥",
//         toClean: "바닥 쓸기",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 10,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방2",
//         place: "책장",
//         toClean: "책 정리",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 11,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방2",
//         place: "책장",
//         toClean: "책 정리",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 12,
//         name: "A",
//         badgeId: 1,
//         parentPlace: "A의 방2",
//         place: "책장",
//         toClean: "책 정리",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 13,
//         name: "B",
//         badgeId: 2,
//         parentPlace: "B의 방",
//         place: "책장",
//         toClean: "책 정리",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 14,
//         name: "B",
//         badgeId: 2,
//         parentPlace: "B의 방",
//         place: "책장",
//         toClean: "책 정리",
//         deadLine: "D-2",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
//     {
//         target: "person",
//         id: 15,
//         name: "C",
//         badgeId: 3,
//         parentPlace: "C의 방",
//         place: "침대",
//         toClean: "이불 개기",
//         deadLine: "D-day",
//         due_data: "2025-07-01",
//         wait: 0,
//     },
// ];

// function reducer(data, action) {
//     switch (action.type) {
//         case "CREATE":
//             return [...data, action.data];
//         case "DELETE":
//             return data.filter((item) => String(item.id) !== String(action.id));
//         case "WAIT":
//             return data.map((item) =>
//                 item.id === action.id ? { ...item, wait: 1 } : item
//             );
//         default:
//             return data;
//     }
// }

/*
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
*/

const GroupProvider = ({ children }) => {
    // const [checkListData, dispatch] = useReducer(reducer, checkListMockData);
    const [checkListData, setCheckListData] = useState([]);
    const [personData, setPersonData] = useState([]);
    const [placeData, setPlaceData] = useState([]);
    const [groupData, setGroupData] = useState(groupMockData);
    const idRef = useRef(16);
    const [waitRating, setWaitRating] = useState(waitMockRating);
    const [currentUser, setCurrentUser] = useState({
        name: "A",
        badgeId: 1,
        email: "A@email.com",
    });
    const [trigger, setTrigger] = useState(0);
    // console.log(checkListData);

    useEffect(() => {
        // mount 시에만 체크리스트 데이터 불러옴 (mockdata 지우고 실데이터 불러오는 것)
        const fetchCheckListData = async () => {
            try {
                const { data } = await axiosInstance.get("/spaces/info/");
                const checklistRequests = data.data.map((space) =>
                    axiosInstance.get(
                        `/checklists/spaces/${space.space_id}/checklist/`
                    )
                );
                const checklistResponses = await Promise.all(checklistRequests);

                const sumCheckListData = checklistResponses.flatMap(
                    (res, index) => {
                        const space = data.data[index];
                        const items = res.data.data[0]?.checklist_items || [];

                        return items.map((item) => {
                            const due = new Date(item.due_date);
                            const d_day = Math.ceil(
                                (due.getTime() - Date.now()) /
                                    (1000 * 60 * 60 * 24)
                            );

                            return {
                                target: item.unit_item ? "person" : "group",
                                id: item.checklist_item_id,
                                name: item.user_info.name,
                                badgeId: item.user_info.profile,
                                parentPlace: item.unit_item
                                    ? space.space_name
                                    : "none",
                                place: item.unit_item || space.space_name,
                                toClean: item.title,
                                deadLine: d_day > 0 ? `D-${d_day}` : "D-day",
                                due_data: item.due_date,
                                wait: item.status !== 0 ? 1 : 0,
                            };
                        });
                    }
                );

                setCheckListData(sumCheckListData);
            } catch (e) {
                console.error("checkListItem 데이터 불러오기 실패:", e);
            }
        };
        fetchCheckListData();
    }, [trigger]);
    /**
    target: "person",
    name: "B",
    parentPlace: "B의 방",
    place: "책상",
 */
    useEffect(() => {
        // 장소 모음
        const fetchPlaceData = async () => {
            try {
                // 공간 정보 가져옴
                const res1 = await axiosInstance.get("/spaces/info/");
                const placeData = res1.data.data;
                let sumPlaceData = [];
                for (let place of placeData) {
                    if (place.space_type === 0) {
                        // 그룹일 때 장소별 data
                        sumPlaceData.push({
                            target: "group",
                            name: "all",
                            parentPlace: "none",
                            place: place.space_name,
                        });
                    } else {
                        // 개인일 때 장소별 data
                        const res2 = await axiosInstance.post(
                            "/groups/check-user/",
                            { email: place.owner_email }
                        );
                        const name = res2.data.data.UserInfo.name;
                        if (place.items.length === 0) break;

                        for (let item of place.items) {
                            sumPlaceData.push({
                                target: "person",
                                name: name,
                                parentPlace: place.space_name,
                                place: item.item_name,
                            });
                        }
                    }
                }
                setPlaceData(sumPlaceData);
            } catch (error) {
                console.error("place 데이터 불러오기 실패: ", error);
            }
        };
        fetchPlaceData();
    }, []);

    //         name: "A",
    //         badgeId: 1,
    //         email: "A@email.com",
    //         pw: "1111",
    //         cleanSensitivity: 50,
    //         clean_type: 0,
    //         rating: 2,
    //         done: 0,
    useEffect(() => {
        // 개인별 정보 모음
        const fetchPersonData = async () => {
            try {
                let sumPersonData = [];

                // 개인 data 모음 가져옴
                const res1 = await axiosInstance.get("/groups/member-info/");
                const persons = res1.data.data;

                // 그룹 평가 data 모음 가져옴 (평균 평점, average_rating)
                const res2 = await axiosInstance.get(
                    "/groups/evaluation-view/"
                );
                const evalls = res2.data.data; // eval 변수 사용이 안돼서 evall, evalls로 씀

                // 청소 평가 data 모음 가져옴 (처리한 일 개수, done)
                const sumDoneCount = async (person) => {
                    let sumCount = 0;
                    for (let i = 0; i < 7; i++) {
                        // 일요일 -> 7일전 날짜 구함
                        const d = new Date();
                        const date = new Date(d.setDate(d.getDate() - i)); // setTime은 getTime 형식으로 돌려줘서 new Date로 날짜 형식 변환 필요
                        const isoDate = date.toISOString().split("T")[0];

                        // 해당 날짜의 완료개수 찾음
                        const res3 = await axiosInstance.post("/groups/logs/", {
                            date: isoDate,
                        });
                        const dones = res3.data.data.logs.find(
                            (item) => item.user.name === person.name
                        );
                        // console.log(dones);
                        sumCount += dones.weekly_completed_count;
                    }
                    return sumCount;
                };

                for (const person of persons) {
                    // 해당 그룹원의 완료개수 찾음
                    const done = sumDoneCount(person);

                    // 평점든 객체 찾음
                    const ratingData = evalls.find(
                        (evall) => evall.target_email === person.email
                    );
                    sumPersonData.push({
                        name: person.name,
                        badgeId: person.profile,
                        email: person.email,
                        cleanSensitivity: person.clean_sense,
                        clean_type: person.clean_type,
                        rating: ratingData ? ratingData.average_rating : 0,
                        done: !isNaN(done) ? done : 0,
                    });
                }
                setPersonData(sumPersonData);
            } catch (error) {
                console.error("person 데이터 불러오기 실패: ", error);
            }
        };

        fetchPersonData();
    }, [trigger]);

    // 연동 완료 후 이거로 갈아끼우기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 1. access token 가져오기 & 디코딩 (이메일)
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) throw new Error("No access token found");
                const decoded = jwtDecode(accessToken);
                const email = decoded.email;

                // 2. user 정보 가져오기 (이름, 뱃지 번호)
                const res2 = await axiosInstance.get("/groups/member-info/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const user = res2.data.data.find(
                    (user) => user.email === email
                );
                if (!user) throw new Error("User not found in response");

                // 4. 사용자 정보 상태에 저장
                setCurrentUser({
                    name: user.name,
                    badgeId: user.profile,
                    email: email,
                });
            } catch (error) {
                console.error("회원 정보 조회 에러:", error);
            }
        };

        fetchUserInfo();
    }, []);

    //     target: "person",
    //     id: 13,
    //     name: "B",
    //     badgeId: 2,
    //     parentPlace: "B의 방",
    //     place: "책장",
    //     toClean: "책 정리",
    //     deadLine: "D-2",
    //     due_data: "2025-07-01",
    //     wait: 0,

    const onCreate = async (
        target,
        name,
        badgeId,
        parentPlace,
        place,
        toClean,
        due_data
    ) => {
        let res3 = null;
        try {
            const res1 = await axiosInstance.get("/spaces/info/");

            const checklistIdData = res1.data.data.find((space) => {
                console.log(space.space_name, parentPlace, place);
                return (
                    space.space_name === place ||
                    space.space_name === parentPlace
                );
            });

            if (!checklistIdData) throw new Error("Checklist ID not found");

            const res2 = await axiosInstance.get("/groups/member-info/");
            const groupMembers = res2.data.data;
            const memberData = groupMembers.find(
                (member) => member.name === name
            );

            const requestBody = {
                checklist_id: checklistIdData.space_id,
                email: memberData.email,
                title: toClean,
                due_date: due_data,
                unit_item: target === "person" ? place : null,
            };

            console.log("보낼 데이터:", requestBody);

            res3 = await axiosInstance.post("/checklists/create/", requestBody);

            if (res3.data.success) {
                console.log("체크리스트 추가 성공:", res3.data.message);
                setTrigger((prev) => prev + 1);
            }
        } catch (error) {
            console.error(
                "체크리스트 추가 실패:",
                error.response?.data || error.message
            );
            return; // 실패 시 중단
        }

        if (!res3) {
            console.error("res3 is null - 백엔드 응답 없음");
            return;
        }

        // dispatch({
        //     type: "CREATE",
        //     data: {
        //         target,
        //         id: res2.data.checklist_item.id, // 오류나면 catch로 바로 넘어가서 res2==null임 (try문에 들어가야 이 코드 실행)
        //         name,
        //         badgeId,
        //         parentPlace,
        //         place,
        //         toClean,
        //         deadLine,
        //         due_data,
        //         wait: 0,
        //     },
        // });
    };

    const onDelete = async (id) => {
        // dispatch({
        //     type: "DELETE",
        //     id,
        // });
        const checklist_item_id = id;
        try {
            const res = await axiosInstance.delete(
                `/checklists/checklist-items/${checklist_item_id}/delete/`
            );

            if (res.data.success) {
                console.log("체크리스트 삭제 성공:", res.data.message);
                setTrigger((prev) => prev + 1);
            }
        } catch (error) {
            console.error("체크리스트 삭제 실패:", error);
        }
    };

    // 본인만 완료 누를 수 O (타인이 누르려고 하면 403 권한없다고 뜸)
    const onWait = async (id) => {
        // dispatch({
        //     type: "WAIT",
        //     id,
        // });
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");
        try {
            const checklist_item_id = id;
            console.log(id);
            const res = await axiosInstance.patch(
                `/checklists/checklist-items/${checklist_item_id}/complete/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Common for Bearer tokens
                    },
                }
            );
            console.log(res);

            if (res.data.success) {
                console.log("체크리스트 완료 성공:", res.data.message);
                setTrigger((prev) => prev + 1);
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
