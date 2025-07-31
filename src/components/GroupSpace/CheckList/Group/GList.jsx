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
        // mount 시에만 체크리스트 데이터 불러옴 (mockdata 지우고 실데이터 불러오는 것)
        const fetchCheckListData = async () => {
            try {
                const res = await axiosInstance.get("/checklists/total-view/");
                const resData = res.data.data;

                const sumCheckListData = resData.map((item) => {
                    // console.log("불러오는 체트리스트 데이터: ", item);
                    const due = new Date(item.due_date);
                    const now = new Date();
                    now.setHours(23);
                    now.setMinutes(59);
                    now.setSeconds(59);
                    const d_day = Math.ceil(
                        (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return {
                        target: item.location.item ? "person" : "group",
                        id: item.checklist_item_id,
                        name: item.assignee.name,
                        badgeId: item.assignee.profile,
                        parentPlace: item.location.space || "none",
                        place: item.location.item || item.location.space,
                        toClean: item.title,
                        deadLine: d_day > 0 ? `D-${d_day}` : "D-day",
                        due_data: item.due_date,
                        // wait: item.status !== 0 ? 1 : 0,
                    };
                });

                setCheckListData(sumCheckListData);
            } catch (e) {
                console.error("checkListItem 데이터 불러오기 실패:", e);
            }
        };
        fetchCheckListData();

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
