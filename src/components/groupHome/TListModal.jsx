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
        padding: "35px 40px",
        height: "780px",
        width: "610px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "20px",
        marginTop: "6vh",
        marginBottom: "6.6vh",
        position: "relative",
    },
    close: {
        position: "absolute",
        top: "12px",
        right: "12px",
        background: "none",
        border: "none",
        fontSize: "1.5rem",
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
                            fontSize: "min(24px, 1.67vw)",
                            textAlign: "center",
                            paddingTop: "19px",
                            paddingBottom: "22.5px",
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
                            marginBottom: "27px",
                        }}
                    >
                        <img
                            style={{
                                width: "min(4.89vw, 4.4rem)",
                                height: "min(4.89vw, 4.4rem)",
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
                            marginLeft: "min(0.3vw, 4.32px)",
                            marginBottom: "min(0.4vw, 5.76px)",
                            fontSize: "min(1.1vw, 15.84px)",
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
                                position: "absolute",
                                left: "28.5px",
                            }}
                        >
                            구분
                        </div>
                        <div
                            className="place_text"
                            style={{
                                position: "absolute",
                                left: "99px",
                            }}
                        >
                            공간
                        </div>
                        <div
                            className="toclean_text"
                            style={{
                                position: "absolute",
                                left: "180px",
                            }}
                        >
                            to-clean
                        </div>
                        <div
                            className="deadLine_text"
                            style={{
                                position: "absolute",
                                left: "375px",
                            }}
                        >
                            마감기한
                        </div>
                    </section>
                    <div
                        className="scrollBar"
                        style={{
                            marginTop: "28px",
                            marginLeft: "11px",
                            width: "524px",
                            height: "459px",
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
