function calTime(time) {
    time = new Date(time); // getTime은 ms이기에 get~매서드 쓰려면 다시 new Date로 date로 변환해줘야 함
    const year = time.getFullYear() % 100;
    // 한자리 숫자는 앞에 0 붙이게 함, month는 인덱스 형식으로 반환돼서 +1 해줌
    const month =
        time.getMonth() < 9 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
    // 한자리 숫자는 앞에 0 붙이게 함
    const date = time.getDate() < 9 ? `0${time.getDate() + 1}` : time.getDate();

    return year + "/" + month + "/" + date;
}

const GroupEval = () => {
    // new Date : 각각 Year, Month, Date 받아오면 2022/01/01 -> 2021/12/31 각 기준점 넘는거 구현해줘야 함
    // getTime -> new Date : 경계선 넘어가는거 알아서 계산됨 (get~ 매서드로 Year, Month, Date 받아오기만 하면 됨)
    const today = new Date().getTime();
    const startDate = calTime(today - 7 * 1000 * 60 * 60 * 24);
    const endDate = calTime(today);
    return (
        <div>
            <h3>5월 셋째주 그룹 평가</h3>
            <div>{`${startDate} ~ ${endDate}`}</div>
        </div>
    );
};

export default GroupEval;
