import "./PList.css";
import { useContext, useEffect, useState } from "react";
import PListItem from "./PListItem";
import Button from "../../../Button";
import PListAddModal from "./PListAddModal";
import axiosInstance from "../../../../api/axiosInstance";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import { TriggerStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const PList = ({ selectedName, selectedParentPlace }) => {
    const [checkListData, setCheckListData] = useState([]);
    const [placeData, setPlaceData] = useState([]);
    const [personData, setPersonData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [text, setText] = useState("편집");
    const trigger = useContext(TriggerStateContext);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get("/spaces/info/");
                const checklistRequests = data.data.map((space) =>
                    axiosInstance.get(
                        `/checklists/spaces/${space.space_id}/checklist/`
                    )
                );
                const checklistResponses = await Promise.all(checklistRequests);

                const sumCheckListData = checklistResponses.flatMap(
                    (res, index) => {
                        const space = data.data[index];
                        const items = res.data.data[0]?.checklist_items || [];

                        return items.map((item) => {
                            const due = new Date(item.due_date);
                            const d_day = Math.ceil(
                                (due.getTime() - Date.now()) /
                                    (1000 * 60 * 60 * 24)
                            );

                            return {
                                target: item.unit_item ? "person" : "group",
                                id: item.checklist_item_id,
                                name: item.user_info.name,
                                badgeId: item.user_info.profile,
                                parentPlace: item.unit_item
                                    ? space.space_name
                                    : "none",
                                place: item.unit_item || space.space_name,
                                toClean: item.title,
                                deadLine: d_day > 0 ? `D-${d_day}` : "D-day",
                                // due_data: item.due_date,
                                wait: item.status !== 0 ? 1 : 0,
                            };
                        });
                    }
                );

                setCheckListData(sumCheckListData);
                console.log(sumCheckListData);
            } catch (e) {
                console.error("checkListItem 불러오기 실패:", e);
            }
        };

        const fetchPlaceData = async () => {
            try {
                const res = await axiosInstance.get("/spaces/info/");
                const spaces = res.data.data;
                let result = [];

                for (let space of spaces) {
                    if (space.space_type === 1 && space.items.length > 0) {
                        const res2 = await axiosInstance.post(
                            "/groups/check-user/",
                            {
                                email: space.owner_email,
                            }
                        );
                        const name = res2.data.data.UserInfo.name;

                        for (let item of space.items) {
                            result.push({
                                target: "person",
                                name: name,
                                parentPlace: space.space_name,
                                place: item.item_name,
                            });
                        }
                    }
                }

                setPlaceData(result);
            } catch (e) {
                console.error("placeData 불러오기 실패:", e);
            }
        };

        const fetchPersonData = async () => {
            try {
                const res = await axiosInstance.get("/groups/member-info/");
                const data = res.data.data.map((p) => ({
                    name: p.name,
                    badgeId: p.profile,
                }));
                setPersonData(data);
            } catch (e) {
                console.error("personData 불러오기 실패:", e);
            }
        };

        fetchData();
        fetchPlaceData();
        fetchPersonData();
    }, [trigger]);

    const selectedBadgeId = personData.find(
        (p) => p.name === selectedName
    )?.badgeId;

    const targetPersonData = checkListData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName) &&
            String(item.parentPlace) === String(selectedParentPlace) &&
            item.wait !== 1
    );

    const targetPlaceData = placeData.filter(
        (item) =>
            item.target === "person" &&
            String(item.name) === String(selectedName) &&
            String(item.parentPlace) === String(selectedParentPlace)
    );

    const onClickAdd = () => setIsAddMode(true);

    const onClickEditMode = () => {
        setIsEditMode((prev) => {
            const next = !prev;
            setText(next ? "저장" : "편집");
            return next;
        });
    };

    return (
        <div className="PList">
            <h3>To-clean</h3>
            <Button onClick={onClickEditMode} text={text} type={"edit"} />
            <div className="profile">
                <img src={getBadgeImage(selectedBadgeId)} />
            </div>
            <section className="title">
                <div className="place_text">공간</div>
                <div className="toclean_text">to-clean</div>
                <div className="deadLine_text">기한</div>
            </section>
            <div className="scrollBar">
                {targetPersonData.map((item) => (
                    <PListItem
                        key={item.id}
                        isEditMode={isEditMode}
                        item={item}
                        selectedName={selectedName}
                        owner={owner}
                    />
                ))}
                {isEditMode && (
                    <Button onClick={onClickAdd} text={"+"} type={"add2"} />
                )}
                {isAddMode && (
                    <PListAddModal
                        isAddMode={isAddMode}
                        setIsAddMode={setIsAddMode}
                        targetPlaceData={targetPlaceData}
                        selectedName={selectedName}
                        selectedBadgeId={selectedBadgeId}
                        selectedParentPlace={selectedParentPlace}
                        onAddItem={(item) =>
                            setCheckListData((prev) => [...prev, item])
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default PList;
