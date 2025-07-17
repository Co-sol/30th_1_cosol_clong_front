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

    const CELL_SIZE = cellSize;
    const GRID_SIZE = 10;
    const GRID_GAP = 1;

    return (
        <div className="CreatedSpace">
            <div className="grid-panel">
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
