import "./GroupEval.css";
import Button from "../Button";
import GEvalItem from "./GEvalItem";
import { useContext, useEffect, useRef } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

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

const GroupEval = () => {
    const nav = useNavigate();
    // new Date : 각각 Year, Month, Date 받아오면 2022/01/01 -> 2021/12/31 각 기준점 넘는거 구현해줘야 함
    // getTime -> new Date : 경계선 넘어가는거 알아서 계산됨 (get~ 매서드로 Year, Month, Date 받아오기만 하면 됨)
    const today = new Date().getTime();
    const { personData, currentUser, waitRating } =
        useContext(toCleanStateContext);
    console.log(personData);

    // // 백에 보낼 그룹평가 정보
    // let sumRating = personData.map((p) => ({ email: p.email, rating: 0 }));
    // const getRating = (obj) => {
    //     // 바꿀 사람 리스트 인덱스 찾음
    //     const idx = sumRating.indexof((item) => item.email === obj.email);
    //     sumRating[idx].rating = obj.rating; // 해당 인덱스의 rating 바꿈
    // };

    const sumRatingRef = useRef([]); // 렌더 사이에서도 값 유지됨

    useEffect(() => {
        sumRatingRef.current = personData.map((p) => ({
            user_email: p.email,
            rating: 0,
        }));
    }, [personData]);

    const getRating = (obj) => {
        const idx = sumRatingRef.current.findIndex(
            (item) => item.user_email === obj.user_email
        );
        if (idx !== -1) {
            sumRatingRef.current[idx].rating = obj.rating;
        } else {
            sumRatingRef.current.push(obj);
        }
    };

    const onClickSave = async () => {
        try {
            const res = await axiosInstance.post(
                "/groups/evaluation/",
                sumRatingRef.current
            );
            console.log(res.data.data);
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
