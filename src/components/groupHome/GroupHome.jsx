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
    const { personData } = useContext(toCleanStateContext);
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
                        <div className="ruleContent">* 그룹 규칙 내용</div>
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
                                    width: "530px",
                                    height: "210px",
                                    fontSize: "20px",
                                    textAlign: "center",
                                    padding: "60px 49px",
                                    whiteSpace: "pre-line",
                                    lineHeight: "45px",
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
