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
        padding: "clamp(25px, 2.43vw, 35px) clamp(28px, 2.78vw, 40px)",
        height: "clamp(554px, 54.17vw, 780px)",
        width: "clamp(433px, 42.36vw, 610px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "clamp(14px, 1.39vw, 20px)",
        marginTop: "clamp(46px, 6.25vw, 72px)",
        marginBottom: "clamp(50px, 6.87vw, 79px)",
        position: "relative",
    },
    close: {
        position: "absolute",
        top: "clamp(8.5px, 0.83vw, 12px)",
        right: "clamp(8.5px, 0.83vw, 12px)",
        background: "none",
        border: "none",
        fontSize: "clamp(17px, 1.67vw, 24px)",
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
                            fontSize: "clamp(17px, 1.67vw, 24px)",
                            textAlign: "center",
                            paddingTop: "clamp(13px, 1.32vw, 19px)",
                            paddingBottom: "clamp(15px, 1.56vw, 22.5px)",
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
                            marginBottom: "clamp(18px, 2.08vw, 27px)",
                        }}
                    >
                        <img
                            style={{
                                width: "clamp(70px, 4.89vw, 4.4rem)",
                                height: "clamp(70px, 4.89vw, 4.4rem)",
                                borderRadius: "50%",
                                border: "0.3rem solid rgb(164, 235, 217)",
                            }}
                            src={getBadgeImage(person.badgeId)}
                        />
                    </div>
                    <section
                        className="title"
                        style={{
                            display: "flex",
                            marginLeft: "clamp(2px, 0.3vw, 4.32px)",
                            marginBottom: "clamp(3px, 0.4vw, 5.76px)",
                            fontSize: "clamp(12px, 1.1vw, 15.84px)",
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
                                left: "clamp(20px, 2vw, 28.5px)",
                                position: "absolute",
                            }}
                        >
                            구분
                        </div>
                        <div
                            className="place_text"
                            style={{
                                left: "107px", // clamp(70px, 6.9vw, 99px)
                                position: "absolute",
                            }}
                        >
                            공간
                        </div>
                        <div
                            className="toclean_text"
                            style={{
                                left: "228px",
                                position: "absolute",
                            }}
                        >
                            to-clean
                        </div>
                        <div
                            className="deadLine_text"
                            style={{
                                left: "clamp(270.58px ,26.42vw ,380.5px )",
                                position: "absolute",
                            }}
                        >
                            기한
                        </div>
                    </section>
                    <div
                        className="scrollBar"
                        style={{
                            marginTop: "clamp(19px, 1.95vw, 28px)",
                            marginLeft: "clamp(8px, 1vw, 11px)",
                            width: "clamp(372px, 36.4vw, 524px)",
                            height: "clamp(326.4px, 31.87vw, 459px)",
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
