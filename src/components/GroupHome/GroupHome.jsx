import "./GroupHome.css";
import home_img from "../../assets/home_img.png";
import pencil_img from "../../assets/pencil_img.png";
import Button from "../Button";
import GInfoItem from "./GInfoItem";
import { useContext, useState, useEffect } from "react";
// import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import CreatedSpace from "../CreatedSpace";
import axiosInstance from "../../api/axiosInstance";

const GroupHome = () => {
    // const { personData, groupData } = useContext(toCleanStateContext);
    const [personData, setPersonData] = useState([]);

    const now = new Date();
    const nav = useNavigate();
    const [isClick, setIsClick] = useState(false);
    const [groupInfo, setGroupInfo] = useState({});
    const [owner, setIsOwner] = useState("임시");
    const [members, setMembers] = useState([{}]);
    const [isEval, setIsEval] = useState(false);

    useEffect(() => {
        if (!owner) return;
        const fetchIsEvalDone = async () => {
            try {
                const res1 = await axiosInstance.get(
                    "/groups/evaluation-status/"
                );
                setIsEval(res1.data.data.evaluation_status);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIsEvalDone();
    }, [owner]);

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
                setPersonData(sumPersonData.reverse());
            } catch (error) {
                console.error("person 데이터 불러오기 실패: ", error);
            }
        };

        fetchPersonData();
    }, []);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await axiosInstance.get("/mypage/info/");
                setIsOwner(res.data.data.name);
            } catch (error) {
                console.error("로그인 주체 불러옴:", error);
            }
        };
        fetchOwner();
    }, []);

    useEffect(() => {
        const me = personData.find((p) => p.name === owner);
        const others = personData.filter((p) => p.name !== owner);
        setMembers([me, ...others]);
    }, [personData]);

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const res = await axiosInstance.get("/groups/group-info/"); // 예시로 groupId 1
                setGroupInfo(res.data.data);
            } catch (error) {
                console.error("그룹 정보를 불러오는 데 실패했습니다:", error);
            }
        };
        fetchGroupInfo();
    }, []);

    return (
        <div className="GroupHome">
            <div className="groupName">
                <img className="home_img" src={home_img} />
                <h3>{groupInfo.group_name || "..."}</h3>
                <img
                    onClick={() => nav("/createGroup")}
                    className="pencil_img"
                    src={pencil_img}
                />
            </div>
            <div className="groupHomeUnder">
                <div className="groupSpace">
                    <CreatedSpace type={"GroupHome"} cellSize={620.19} />
                </div>
                <div className="groupHomeRE">
                    <div className="groupRule">
                        <h3>그룹 규칙</h3>
                        <div className="ruleContent scrollbar-custom">
                            {groupInfo.group_rule || "로딩 중..."}
                        </div>
                    </div>
                    <div className="groupEval">
                        <h3>그룹원</h3>
                        <div className="GInfoItems">
                            <div className="EvalRow1">
                                {members?.slice(0, 2).map((item) => (
                                    <GInfoItem person={item} />
                                ))}
                            </div>
                            <div className="EvalRow1">
                                {members?.slice(2).map((item) => (
                                    <GInfoItem person={item} />
                                ))}
                            </div>
                        </div>
                        {!isEval ? (
                            <Button
                                onClick={() =>
                                    now.getDay() === new Date().getDay() // 나중에 0으로 바꾸기
                                        ? nav("/groupEval")
                                        : setIsClick(true)
                                }
                                text={"그룹원 평가"}
                                type={"eval"}
                            />
                        ) : (
                            <Button text={"평가 완료"} type={"evalDone"} />
                        )}
                        {isClick && (
                            <Modal
                                isOpen={isClick}
                                onClose={() => setIsClick(false)}
                                contentStyle={{
                                    width: "clamp(414.95px ,32.29vw ,465.0px)",
                                    height: "clamp(169.55px ,13.19vw ,190.0px)",
                                    fontSize: "clamp(17.85px ,1.39vw ,20.0px)",
                                    textAlign: "center",
                                    padding:
                                        "clamp(43.73px ,3.4vw ,49.0px) clamp(43.73px ,3.4vw ,49.0px)",
                                    whiteSpace: "pre-line",
                                    lineHeight:
                                        "clamp(40.16px ,3.12vw ,45.0px)",
                                }}
                            >
                                그룹원 평가는{" "}
                                <span
                                    style={{
                                        color: "rgba(255, 0, 0, 1)",
                                        fontFamily: "bold",
                                        fontSize: "21px",
                                        lineHeight: "47px",
                                    }}
                                >
                                    매주 일요일
                                </span>
                                {`\n00:00부터 23:59 사이에만 참여가능해요!`}
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupHome;
