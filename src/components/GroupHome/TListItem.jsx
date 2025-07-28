import { useContext, useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toCleanDispatchContext } from "../../context/GroupContext";
import Button from "../Button";
import "./TListItem.css";

const TListItem = ({ item }) => {
    const [owner, setIsOwner] = useState("임시");

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await axiosInstance.get("/mypage/info/");
                setIsOwner(res.data.data.name);
            } catch (error) {
                console.error("로그인 주체 불러옴:", error);
            }
        };
        fetchOwner();
    }, []);

    const { onWait } = useContext(toCleanDispatchContext);

    const onClickWait = () => {
        onWait(item.id);
    };

    return (
        <div className="TListItem">
            <div className="target">
                {item.target === "group" ? "그룹" : "개인"}
            </div>
            <div className="place">{item.place}</div>
            <div className="toClean">{item.toClean}</div>
            <div className="deadLine">{item.deadLine}</div>
            {owner === item.name && (
                <Button onClick={onClickWait} type={"done"} text={"완료"} />
            )}
        </div>
    );
};

export default TListItem;
