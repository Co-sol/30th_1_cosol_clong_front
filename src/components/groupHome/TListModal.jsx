import { useState, useContext } from "react";
import { getBadgeImage } from "../../utils/get-badge-images";
import { toCleanStateContext } from "../../context/GroupContext";

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
        background: "#fff",
        borderRadius: "16px",
        padding: "35px 40px",
        height: "730px",
        width: "610px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
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
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName)
    );

    if (!isOpen) return null;
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.content} onClick={(e) => e.stopPropagation()}>
                <button style={styles.close} onClick={onClose}>
                    ×
                </button>
                <div className="TList">
                    <h3>To-clean</h3>
                    <div className="profile">
                        <img src={getBadgeImage(person.badgeId)} />
                    </div>
                    <section className="title">
                        <div className="place_text">공간</div>
                        <div className="toclean_text">to-clean</div>
                        <div className="deadLine_text">마감기한</div>
                    </section>
                    <div className="scrollBar">
                        {/* {targetPersonData.map((item) => (
                            
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TListModal;
