import "./PListAddModal.css";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import Modal from "../../../Modal";
import Button from "../../../Button";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import DropDown from "./DropDown";
import axiosInstance from "../../../../api/axiosInstance";
import { TriggerSetStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";
import { setDate } from "date-fns";

registerLocale("ko", ko);

const toKoreaTime = (date) => {
    date.setHours(14);
    date.setMinutes(59);
    date.setSeconds(59);
    let offset = date.getTimezoneOffset() * 60000; // ms단위라 60000곱해줌
    const date2 = new Date(date.getTime() - offset); // 참고로 offset 음수임
    return date2;
};

const PListAddModal = ({
    isAddMode,
    setIsAddMode,
    targetPlaceData,
    selectedName,
    selectedBadgeId,
    selectedParentPlace,
    onAddItem,
}) => {
    const setTrigger = useContext(TriggerSetStateContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [createData, setCreateData] = useState({
        target: "person",
        parentPlace: selectedParentPlace,
        place: "",
        toClean: "",
        due_data: new Date(),
        name: selectedName,
        badgeId: selectedBadgeId,
    });
    const today = new Date();

    const onClickCloseModal = () => {
        setIsAddMode(false);
    };

    const onClickCreate = async () => {
        if (!createData.toClean || !createData.place) {
            alert("장소와 to-clean 내용을 모두 입력해주세요.");
            return;
        }
        const due = new Date(createData.due_data);
        const now = new Date();
        now.setHours(23);
        now.setMinutes(59);
        now.setSeconds(59);
        const d_day = Math.ceil(
            (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        setIsAdding(true);

        try {
            const { data } = await axiosInstance.get("/spaces/info/");
            const space = data.data.find(
                (s) =>
                    s.space_name === createData.place ||
                    s.space_name === createData.parentPlace
            );
            if (!space) throw new Error("space not found");

            const res2 = await axiosInstance.get("/groups/member-info/");
            const user = res2.data.data.find((u) => u.name === createData.name);
            if (!user) throw new Error("user not found");

            const req = {
                checklist_id: space.space_id,
                email: user.email,
                title: createData.toClean,
                due_date: createData.due_data,
                unit_item:
                    createData.target === "person" ? createData.place : null,
            };

            const res = await axiosInstance.post("/checklists/create/", req);
            if (res.data.success) {
                const newItem = {
                    ...createData,
                    id: res.data.checklist_item_id,
                    deadLine: d_day > 0 ? `D-${d_day}` : "D-day",
                    // wait: 0,
                };
                onAddItem(newItem);
                setIsAddMode(false);
                setTrigger((prev) => (prev += 1));
            }
        } catch (e) {
            console.error("추가 실패:", e);
        }
    };

    return (
        <div className="PListAddModal">
            <Modal
                isOpen={isAddMode}
                onClose={onClickCloseModal}
                contentStyle={{
                    minWidth: "475px",
                    width: "37vw",
                    maxWidth: "532px",
                    height: "clamp(501px, 39vw, 561px)",
                    paddingTop: "clamp(64px, 5vw, 72px)",
                    paddingBottom: "clamp(38px, 3vw, 43px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="selectedPlace">{selectedParentPlace}</div>
                <section className="place_section">
                    <div className="place_text">장소를 선택하세요</div>
                    <DropDown
                        className="placeDropdown"
                        targetPlaceData={targetPlaceData}
                        setCreateData={setCreateData}
                        createData={createData}
                    />
                </section>
                <section className="createToClean">
                    <div className="toClean_text">
                        추가하실 to-clean을 입력하세요.
                    </div>
                    <textarea
                        name="toClean"
                        value={createData.toClean}
                        onChange={(e) => {
                            setCreateData({
                                ...createData,
                                toClean: e.target.value,
                            });
                        }}
                    />
                </section>
                <section className="createDeadLine">
                    <div className="deadLine_text">마감 기한</div>
                    <DatePicker
                        className="DatePicker"
                        placeholderText="0000-00-00"
                        locale="ko"
                        dateFormat="yyyy-MM-dd"
                        minDate={today} //today.setDate(today.getDate() + 1)
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setCreateData((prev) => ({
                                ...prev,
                                due_data: toKoreaTime(date).toISOString(),
                            }));
                        }}
                        shouldCloseOnSelect={false}
                    />
                </section>
                <Button onClick={onClickCreate} type={"save"} text={"저장"} />
            </Modal>
            {isAdding && (
                <div className="save-overlay">
                    <div className="save-spinner"></div>
                    <div className="save-message">
                        잠시만 기다려주세요 <br />
                        체크리스트 추가 중입니다 ...
                    </div>
                </div>
            )}
        </div>
    );
};

export default PListAddModal;
