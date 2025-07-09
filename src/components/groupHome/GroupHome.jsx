import "./GroupHome.css";

import home_img from "../../assets/home_img.PNG";
import pencil_img from "../../assets/pencil_img.PNG";
import Button from "../Button";
import GInfoItem from "./GInfoItem";
import { useContext, useState } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

const GroupHome = () => {
    const { personData, groupData } = useContext(toCleanStateContext);
    const now = new Date();
    const nav = useNavigate();
    const [isClick, setIsClick] = useState(false);

    return (
        <div className="GroupHome">
            <div className="groupName">
                <img className="home_img" src={home_img} />
                <h3>Clong's home</h3>
                <img className="pencil_img" src={pencil_img} />
            </div>
            <div className="groupHomeUnder">
                <div className="groupSpace">공간 구조도</div>
                <div className="groupHomeRE">
                    <div className="groupRule">
                        <h3>그룹 규칙</h3>
                        <div className="ruleContent">
                            {groupData.group_rule}
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
                                    width: "clamp(368px, 36.8vw, 530px)",
                                    height: "clamp(146px, 20.3vw, 210px)",
                                    fontSize: "clamp(14px, 1.39vw, 20px)",
                                    textAlign: "center",
                                    padding:
                                        "clamp(42px, 4.17vw, 60px) clamp(34px, 4.1vw, 49px)",
                                    whiteSpace: "pre-line",
                                    lineHeight: "clamp(30px, 3.13vw, 45px)",
                                }}
                            >
                                {`그룹원 평가는 매주 일요일\n00:00부터 23:59 사이에만 참여가능해요!`}
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupHome;
