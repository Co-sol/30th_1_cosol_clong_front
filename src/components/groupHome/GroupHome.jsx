import "./GroupHome.css";

import home_img from "../../assets/home_img.PNG";
import pencil_img from "../../assets/pencil_img.PNG";
import Button from "../Button";
import GEvalItem from "./GEvalItem";
import { useContext } from "react";
import { toCleanStateContext } from "../../context/GroupContext";
import { useNavigate } from "react-router-dom";

const GroupHome = () => {
    const { personData } = useContext(toCleanStateContext);
    const now = new Date();
    const nav = useNavigate();

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
                        <div className="GEvalItems">
                            <div className="EvalRow1">
                                {personData.slice(0, 2).map((item) => {
                                    return <GEvalItem person={item} />;
                                })}
                            </div>
                            <div className="EvalRow1">
                                {personData.slice(2).map((item) => {
                                    return <GEvalItem person={item} />;
                                })}
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                now.getDay() === 0 ? (
                                    <EvalModal />
                                ) : (
                                    nav("/groupEval")
                                )
                            }
                            text={"그룹원 평가"}
                            type={"eval"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupHome;
