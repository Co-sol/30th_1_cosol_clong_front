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
        padding: "31.23px 35.69px", // clamp → min
        height: "696.04px", // clamp → min
        width: "544.34px", // clamp → min
        boxShadow: "0 3.57px 21.42px rgba(0, 0, 0, 0.15)", // clamp → min
        borderRadius: "17.85px", // clamp → min
        marginTop: "64.25px", // clamp → min
        marginBottom: "70.5px", // clamp → min
        position: "relative",
    },
    close: {
        position: "absolute",
        top: "10.71px", // clamp → min
        right: "10.71px", // clamp → min
        background: "none",
        border: "none",
        fontSize: "21.42px", // clamp → min
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
                            fontSize: "21.42px", // clamp → min
                            textAlign: "center",
                            paddingTop: "16.95px",
                            paddingBottom: "20.08px",
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
                            marginBottom: "24.09px",
                        }}
                    >
                        <img
                            style={{
                                width: "62.82px",
                                height: "62.82px",
                                borderRadius: "50%",
                                border: "4.28px solid rgb(164, 235, 217)",
                            }}
                            src={getBadgeImage(person.badgeId)}
                        />
                    </div>
                    <section
                        className="title"
                        style={{
                            display: "flex",
                            marginLeft: "3.85px",
                            marginBottom: "5.14px",
                            fontSize: "14.13px",
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
                                left: "25.16px",
                                position: "absolute",
                            }}
                        >
                            구분
                        </div>
                        <div
                            className="place_text"
                            style={{
                                left: "95.04px",
                                position: "absolute",
                            }}
                        >
                            공간
                        </div>
                        <div
                            className="toclean_text"
                            style={{
                                left: "203.46px",
                                position: "absolute",
                            }}
                        >
                            to-clean
                        </div>
                        <div
                            className="deadLine_text"
                            style={{
                                left: "340.97px",
                                position: "absolute",
                            }}
                        >
                            기한
                        </div>
                    </section>
                    <div
                        className="scrollBar"
                        style={{
                            marginTop: "24.99px",
                            marginLeft: "9.82px",
                            width: "467.6px",
                            height: "409.59px",
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
