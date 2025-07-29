import "./GroupEval.css";
import Button from "../Button";
import GEvalItem from "./GEvalItem";
import { useContext, useEffect, useRef, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

function calTime(time) {
    time = new Date(time); // getTime은 ms이기에 get~매서드 쓰려면 다시 new Date로 date로 변환해줘야 함
    const year = time.getFullYear() % 100;
    // 한자리 숫자는 앞에 0 붙이게 함, month는 인덱스 형식으로 반환돼서 +1 해줌
    const month =
        time.getMonth() < 9 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
    // 한자리 숫자는 앞에 0 붙이게 함
    const date = time.getDate() < 9 ? `0${time.getDate()}` : time.getDate();

    return year + "/" + month + "/" + date;
}

// // created_date 정보 맞추기 (save시 백에 보내는 형식)
// function toLocalISOString(date) {
//     const offsetMs = date.getTimezoneOffset() * 60000; // 분 → ms
//     const localTime = new Date(date.getTime() - offsetMs);
//     return localTime.toISOString().slice(0, -5); // 끝의 'Z' 제거
// }

const GroupEval = () => {
    const nav = useNavigate();

    // new Date : 각각 Year, Month, Date 받아오면 2022/01/01 -> 2021/12/31 각 기준점 넘는거 구현해줘야 함
    // getTime -> new Date : 경계선 넘어가는거 알아서 계산됨 (get~ 매서드로 Year, Month, Date 받아오기만 하면 됨)
    const today = new Date().getTime();
    // const { personData, currentUser, waitRating } =
    //     useContext(toCleanStateContext);
    const sumRatingRef = useRef([]); // 렌더 사이에서도 값 유지됨
    const [personData, setPersonData] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        name: "A",
        badgeId: 1,
        email: "A@email.com",
    });

    // personData
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
    }, []);

    // currentUser
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

    // 평점 누적시킬 리스트 만듦
    useEffect(() => {
        const lastRatingInfo = JSON.parse(
            localStorage.getItem("lastRatingInfo")
        );
        sumRatingRef.current = !lastRatingInfo
            ? personData.map((p) => ({
                  user_email: p.email,
                  rating: 0,
              }))
            : lastRatingInfo;
    }, [personData]);

    // 평가하기 (별 클릭한 사람 rating점수만 변함)
    const getRating = (obj) => {
        console.log(sumRatingRef.current);
        const idx = sumRatingRef.current.findIndex(
            (item) => item.user_email === obj.user_email
        );
        if (idx !== -1) {
            sumRatingRef.current[idx].rating = obj.rating;
        } else {
            sumRatingRef.current.push(obj);
        }
    };

    // 저장하기
    const onClickSave = async () => {
        try {
            const now = new Date().toISOString();
            console.log({
                created_at: now,
                evaluations: sumRatingRef.current,
            });
            const res = await axiosInstance.post("/groups/evaluation/", {
                created_at: now, // "2025-07-27T10:00:00" 테스트용 데이터 (일요일일때만 post 가능하대, 안그러면 400 에러뜨게 로직짜뒀대)
                evaluations: sumRatingRef.current,
            });
            if (res.status.success) {
                console.log("정보 저장 성공: ", res.data.data);
            }

            // 평가하던 이전 정보 기억용
            localStorage.setItem(
                `lastRatingInfo_${currentUser.name}`,
                JSON.stringify(sumRatingRef.current)
            );

            nav(-1);
        } catch (error) {
            console.error("저장 오류:", error);
        }
    };

    // // 일욜날 각자 평가한거 '일욜 지나고' '1번만'(일욜 지나면 이미 rating은 정해졌으니까) GroupHome의 그룹 평가 별점에 반영
    // useEffect(() => {
    //     if (new Date().getDay() !== 0) {
    //         personData.map((item) =>
    //             waitRating.map(
    //                 (tmpR) =>
    //                     item.name === tmpR.name && (item.rating = tmpR.rating)
    //             )
    //         );
    //     }
    // }, []);

    // 짜피 일욜만 열릴거니까, '현재 시각 - 7일'으로만 논리짬 (일욜(고정)-7일 이니까~)
    const startDate = calTime(today - 7 * 1000 * 60 * 60 * 24);
    const endDate = calTime(today);
    return (
        <div className="GroupEval">
            <h3>5월 셋째주 그룹 평가</h3>
            <div className="date">{`${startDate} - ${endDate}`}</div>
            <section className="eval_section">
                <div className="me">
                    <h3>자기 평가</h3>
                    <div className="meItem">
                        {personData.map(
                            (item) =>
                                item.name === currentUser.name && (
                                    <GEvalItem
                                        person={item}
                                        getRating={getRating}
                                        currentUser={currentUser}
                                    />
                                )
                        )}
                    </div>
                </div>
                <div className="other">
                    <h3>그룹원 평가</h3>
                    <div className="otherItem">
                        {personData.map(
                            (item) =>
                                item.name !== currentUser.name && (
                                    <GEvalItem
                                        person={item}
                                        getRating={getRating}
                                        currentUser={currentUser}
                                    />
                                )
                        )}
                    </div>
                </div>
            </section>
            <Button onClick={onClickSave} text={"저장"} type={"save"} />
        </div>
    );
};

export default GroupEval;
