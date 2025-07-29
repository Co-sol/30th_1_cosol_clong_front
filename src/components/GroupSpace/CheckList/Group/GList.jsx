import "./GList.css";
import { useState, useEffect, useContext } from "react";
import GListItem from "./GListItem";
import Button from "../../../Button";
import GListAddModal from "./GListAddModal";
import axiosInstance from "../../../../api/axiosInstance";
import { TriggerStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const GList = ({ selectedData, selectedPlace }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [text, setText] = useState("편집");
    const [isAddMode, setIsAddMode] = useState(false);
    const [checkListData, setCheckListData] = useState([]);
    const [personData, setPersonData] = useState([]);
    const [owner, setIsOwner] = useState("임시");
    const trigger = useContext(TriggerStateContext);
    console.log(checkListData);
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

                        return items
                            .filter((item) => !item.status) // status가 0인 애들만 걸러냄
                            .map((item) => {
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
                                    deadLine:
                                        d_day > 0 ? `D-${d_day}` : "D-day",
                                    // due_data: item.due_date,
                                    // wait: item.status !== 0 ? 1 : 0,
                                };
                            });
                    }
                );
                setCheckListData(sumCheckListData);
                console.log(sumCheckListData);
            } catch (e) {
                console.error("checkListItem 데이터 불러오기 실패:", e);
            }
        };

        const fetchPersonData = async () => {
            try {
                const res = await axiosInstance.get("/groups/member-info/");
                const basic = res.data.data.map((p) => ({
                    name: p.name,
                    badgeId: p.profile,
                }));
                setPersonData(basic.reverse());
            } catch (e) {
                console.error("person data fetch 실패:", e);
            }
        };

        fetchData();
        fetchPersonData();
    }, [trigger]);

    const groupData = !selectedData
        ? checkListData.filter(
              (item) =>
                  item.target === "group" &&
                  String(item.place) === String(selectedPlace)
              // && item.wait !== 1
          )
        : checkListData.filter(
              (item) =>
                  item.target === "person" &&
                  String(item.parentPlace) === String(selectedData.name) &&
                  String(item.place) === String(selectedPlace)
              //  && item.wait !== 1
          );

    const onClickAdd = () => setIsAddMode(!isAddMode);

    const onClickEditMode = () => {
        setIsEditMode((prev) => {
            const next = !prev;
            setText(next ? "저장" : "편집");
            return next;
        });
    };

    return (
        <div className="GList">
            <h3>To-clean</h3>
            <Button onClick={onClickEditMode} text={text} type={"edit"} />
            <div className="place">{selectedPlace}</div>
            <section className="title">
                <div className="profile_text">프로필</div>
                <div className="to-clean_text">to-clean</div>
                <div className="deadLine_text">기한</div>
            </section>
            <div className="scrollBar">
                {groupData.map((item) => (
                    <GListItem
                        key={item.id}
                        isEditMode={isEditMode}
                        item={item}
                        setCheckListData={setCheckListData}
                        owner={owner}
                        checkListData={checkListData} // 임시
                    />
                ))}
                {isEditMode && (
                    <Button onClick={onClickAdd} text={"+"} type={"add1"} />
                )}
                {isAddMode && (
                    <GListAddModal
                        selectedData={selectedData}
                        isAddMode={isAddMode}
                        setIsAddMode={setIsAddMode}
                        selectedPlace={selectedPlace}
                        personData={personData}
                        addCheckItem={(item) =>
                            setCheckListData((prev) => [...prev, item])
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default GList;
