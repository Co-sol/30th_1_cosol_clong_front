import { useState, useContext } from "react";
import { getBadgeImage } from "../../utils/get-badge-images";
import { toCleanStateContext } from "../../context/GroupContext";
import TListItem from "./TListItem";

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    content: {
        backgroundColor: "white",
        padding:
            "clamp(31.23px ,2.43vw ,35.0px) clamp(35.69px ,2.78vw ,40.0px)",
        height: "clamp(696.04px ,54.17vw ,780.0px)",
        width: "clamp(544.34px, 42.36vw, 610px)",
        boxShadow:
            "0 clamp(3.57px ,0.28vw ,4.0px) clamp(21.42px ,1.67vw ,24.0px) rgba(0, 0, 0, 0.15)",
        borderRadius: "clamp(17.85px, 1.39vw, 20px)",
        marginTop: "clamp(64.25px ,5.0vw ,72.0px)",
        marginBottom: "clamp(70.5px ,5.49vw ,79.0px)",
        position: "relative",
    },
    close: {
        position: "absolute",
        top: "clamp(10.71px ,0.83vw ,12.0px)",
        right: "clamp(10.71px ,0.83vw ,12.0px)",
        background: "none",
        border: "none",
        fontSize: "clamp(21.42px ,1.67vw ,24.0px)",
        cursor: "pointer",
        color: "#888",
        fontFamily: "NotoSansKR-Regular, sans-serif",
        fontWeight: 400,
    },
};

const TListModal = ({ isOpen, onClose, person }) => {
    const { checkListData } = useContext(toCleanStateContext);

    // 나중에 사이드바 선택된 애들로 바꿀것
    const selectedName = person.name;
    const targetPersonData = checkListData.filter(
        (item) => String(item.name) === String(selectedName) && item.wait !== 1
    );
    console.log(targetPersonData);

    if (!isOpen) return null;
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.content} onClick={(e) => e.stopPropagation()}>
                <button style={styles.close} onClick={onClose}>
                    ×
                </button>
                <div className="TList">
                    <h3
                        style={{
                            fontSize: "clamp(21.42px ,1.67vw ,24.0px)",
                            textAlign: "center",
                            paddingTop: "clamp(16.95px, 1.32vw, 19px)",
                            paddingBottom: "clamp(20.08px, 1.56vw, 22.5px)",
                            marginBottom: "0",
                            fontWeight: "bold",
                        }}
                    >
                        To-clean
                    </h3>
                    <div
                        className="profile"
                        style={{
                            textAlign: "center",
                            marginBottom: "clamp(24.09px, 2.08vw, 27px)",
                        }}
                    >
                        <img
                            style={{
                                width: "clamp(62.82px ,4.89vw ,70.4px)",
                                height: "clamp(62.82px ,4.89vw ,70.4px)",
                                borderRadius: "50%",
                                border: "clamp(4.28px ,0.33vw ,4.8px) solid rgb(164, 235, 217)",
                            }}
                            src={getBadgeImage(person.badgeId)}
                        />
                    </div>
                    <section
                        className="title"
                        style={{
                            display: "flex",
                            marginLeft: "clamp(3.85px, 0.3vw, 4.32px)",
                            marginBottom: "clamp(5.14px, 0.4vw, 5.76px)",
                            fontSize: "clamp(14.13px, 1.1vw, 15.84px)",
                            color: "rgb(103, 103, 103)",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontFamily: 'sans-serif, "Noto Sans KR"',
                            position: "relative",
                        }}
                    >
                        <div
                            className="target_text"
                            style={{
                                left: "clamp(25.16px ,1.96vw ,28.2px)",
                                position: "absolute",
                            }}
                        >
                            구분
                        </div>
                        <div
                            className="place_text"
                            style={{
                                left: "clamp(95.04px ,7.4vw ,106.5px)",
                                position: "absolute",
                            }}
                        >
                            공간
                        </div>
                        <div
                            className="toclean_text"
                            style={{
                                left: "clamp(203.46px ,15.83vw ,228px)",
                                position: "absolute",
                            }}
                        >
                            to-clean
                        </div>
                        <div
                            className="deadLine_text"
                            style={{
                                left: "clamp(340.97px ,26.53vw ,382.1px)",
                                position: "absolute",
                            }}
                        >
                            기한
                        </div>
                    </section>
                    <div
                        className="scrollBar"
                        style={{
                            marginTop: "clamp(24.99px, 1.95vw, 28px)",
                            marginLeft: "clamp(9.82px, 1vw, 11px)",
                            width: "clamp(467.6px, 36.4vw, 524px)",
                            height: "clamp(409.59px, 31.87vw, 459px)",
                            overflowY: "auto",
                        }}
                    >
                        {targetPersonData.map((item) => (
                            <TListItem item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TListModal;
