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

// toISOString변환 후 23:59:59 되게 끔, 다음날 8:59:59로 변환해주는 함수
const toKoreaTime = (date) => {
    const date2 = new Date(date); // date1 그대로 쓰면, 원본날짜 훼손됨, 따라서 복사한 것
    date2.setHours(8); // ISOString이 9시간 전으로 되돌릴테니까, 23시에서 9시간 후로 맞춤
    date2.setMinutes(59);
    date2.setSeconds(59);
    date2.setDate(date2.getDate() + 1); //다음날이어야 함, setHours(8)만 쓰고 toISOString에 -9 당하면 전날도 돌아감..
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
        const due = new Date(createData.due_data); //9시간 후로 돌린거 그대로 반환함..
        due.setHours(23); // 따라서 toISOString 전으로
        due.setDate(due.getDate() - 1); // 되돌려줘야 함

        // D-day로 추가 -> 기한 지남 처리되는 오류 잡음
        const now = new Date();
        const d_day = Math.floor(
            (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        setIsAdding(true);

        try {
            const { data } = await axiosInstance.get("/spaces/info/");
            const space = data.data.find((s) => {
                console.log(createData, s);
                s.space_name === createData.place ||
                    s.space_name === createData.parentPlace;
            });
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
                    deadLine: d_day > 0 ? `D-${d_day}` : "D-day", // ms -> 일 단위로 바꾸니까, 1일은 있어도 0.5일은 없잖아 그건 걍 D-day지~
                    // wait: 0,
                };
                onAddItem(newItem);
                setIsAddMode(false);
                setTrigger((prev) => prev + 1);
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
                            setCreateData((prev) => ({
                                ...prev,
                                toClean: e.target.value,
                            }));
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
