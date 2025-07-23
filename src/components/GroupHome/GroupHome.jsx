import "./GroupHome.css";
import home_img from "../../assets/home_img.PNG";
import pencil_img from "../../assets/pencil_img.PNG";
import Button from "../Button";
import GInfoItem from "./GInfoItem";
import { useContext, useState, useEffect } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import CreatedSpace from "../CreatedSpace";
import axiosInstance from "../../api/axiosInstance";

const GroupHome = () => {
    const { personData, groupData } = useContext(toCleanStateContext);
    const now = new Date();
    const nav = useNavigate();
    const [isClick, setIsClick] = useState(false);
    const [groupInfo, setGroupInfo] = useState(null);

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const res = await axiosInstance.get("/groups/group-info/"); // 예시로 groupId 1
                setGroupInfo(res.data);
            } catch (error) {
                console.error("그룹 정보를 불러오는 데 실패했습니다:", error);
            }
        };
        fetchGroupInfo();
    }, []);
    console.log(groupInfo);

    return (
        <div className="GroupHome">
            <div className="groupName">
                <img className="home_img" src={home_img} />
                <h3>
                    {groupInfo
                        ? groupInfo.data.group_name
                        : "그룹 이름 로딩 중..."}
                </h3>
                <img
                    onClick={() => nav("/createGroup")}
                    className="pencil_img"
                    src={pencil_img}
                />
            </div>
            <div className="groupHomeUnder">
                <div className="groupSpace">
                    <CreatedSpace
                        type={"GroupHome"}
                        space_type={1}
                        cellSize={620.19}
                    />
                </div>
                <div className="groupHomeRE">
                    <div className="groupRule">
                        <h3>그룹 규칙</h3>
                        <div className="ruleContent">
                            {groupInfo
                                ? groupInfo.data.group_rule
                                : "로딩 중..."}
                        </div>
                    </div>
                    <div className="groupEval">
                        <h3>그룹원</h3>
                        <div className="GInfoItems">
                            <div className="EvalRow1">
                                {personData.slice(0, 2).map((item) => {
                                    return <GInfoItem person={item} />;
                                })}
                            </div>
                            <div className="EvalRow1">
                                {personData.slice(2).map((item) => {
                                    return <GInfoItem person={item} />;
                                })}
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                now.getDay() === 0
                                    ? nav("/groupEval")
                                    : setIsClick(true)
                            }
                            text={"그룹원 평가"}
                            type={"eval"}
                        />
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
