import "./PList.css";
import { useContext, useEffect, useState } from "react";
import PListItem from "./PListItem";
import Button from "../../../Button";
import PListAddModal from "./PListAddModal";
import axiosInstance from "../../../../api/axiosInstance";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import { TriggerStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

const PList = ({
  selectedName,
  selectedParentPlace,
  selectedData,
  clickedDiagram,
}) => {
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
    // mount 시에만 체크리스트 데이터 불러옴 (mockdata 지우고 실데이터 불러오는 것)
    const fetchCheckListData = async () => {
      try {
        const res = await axiosInstance.get("/checklists/total-view/");
        const resData = res.data.data;

        const sumCheckListData = resData.map((item) => {
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
            parentPlace: item.location.item ? item.location.space : "none",
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

    const fetchPlaceData = async () => {
      try {
        const res = await axiosInstance.get("/spaces/info/");
        const spaces = res.data.data;
        let result = [];

        for (let space of spaces) {
          if (space.space_type === 1 && space.items.length > 0) {
            const res2 = await axiosInstance.post("/groups/check-user/", {
              email: space.owner_email,
            });
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
    fetchPlaceData();
    fetchPersonData();
  }, [trigger]);

  const selectedBadgeId = personData.find(
    (p) => p.name === selectedName
  )?.badgeId;

  const targetPersonData = checkListData.filter(
    (item) =>
      item.target === "person" &&
      // String(item.name) === String(selectedName) && // 이러면 test1방이면 test1의 todo만 뽑아주고, test2방이면 test2의 todo만 뽑아줌 (오류 조건)
      String(item.parentPlace) === String(selectedParentPlace)
    // && item.wait !== 1
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
      {selectedData?.isClickedSidebar && clickedDiagram?.space_name && (
        <Button onClick={onClickEditMode} text={text} type={"edit"} />
      )}
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
            setCheckListData={setCheckListData}
          />
        ))}
        {isEditMode && <Button onClick={onClickAdd} text={"+"} type={"add2"} />}
        {isAddMode && (
          <PListAddModal
            isAddMode={isAddMode}
            setIsAddMode={setIsAddMode}
            targetPlaceData={targetPlaceData}
            selectedName={selectedName}
            selectedBadgeId={selectedBadgeId}
            selectedParentPlace={selectedParentPlace}
            onAddItem={(item) => setCheckListData((prev) => [...prev, item])}
          />
        )}
      </div>
    </div>
  );
};

export default PList;
