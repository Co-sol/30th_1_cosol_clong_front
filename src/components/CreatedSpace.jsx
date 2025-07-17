import "./CreatedSpace.css";
import { useState, useEffect, useContext } from "react";
import error_img from "../assets/error_img.PNG";
import { toCleanStateContext } from "../context/GroupContext";

const CreatedSpace = ({ cellSize, selectedData }) => {
    const [spaces, setSpaces] = useState([]);
    const { checkListData, placeData } = useContext(toCleanStateContext);

    useEffect(() => {
        const saved = localStorage.getItem("spaces");
        if (saved) {
            setSpaces(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="CreatedSpace">
            <div
                className="grid-panel"
                style={{
                    height: `clamp(${Math.round(
                        (cellSize / 14.4) * 12.85,
                        2
                    )}, ${Math.round(cellSize / 14.4, 2)}, ${Math.round(
                        (cellSize / 14.4) * 17.2,
                        2
                    )})`,
                    width: `clamp(${Math.round(
                        (cellSize / 14.4) * 12.85,
                        2
                    )}, ${Math.round(cellSize / 14.4, 2)}, ${Math.round(
                        (cellSize / 14.4) * 17.2,
                        2
                    )})`,

                    boxSizing: "border-box",
                    background: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px #d9d9d9",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="grid-container">
                    <div className="grid">
                        {[...Array(100)].map((_, idx) => (
                            <div key={idx} className="grid-cell" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedSpace;
