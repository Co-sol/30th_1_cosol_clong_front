import "./GListAddModal.css";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import Modal from "../../../Modal";
import Button from "../../../Button";
import axiosInstance from "../../../../api/axiosInstance";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { TriggerSetStateContext } from "../../../../pages/GroupSpacePage/GroupSpacePage";

registerLocale("ko", ko);

const toKoreaTime = (date) => {
    console.log("date", date);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
};

const GListAddModal = ({
    selectedData,
    isAddMode,
    setIsAddMode,
    selectedPlace,
    personData,
    addCheckItem,
}) => {
    const [activeName, setActiveName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [createData, setCreateData] = useState({
        target: !selectedData ? "group" : "person",
        parentPlace: !selectedData ? "none" : selectedData.name,
        place: selectedPlace,
        toClean: "",
        due_data: new Date(),
        name: "",
        badgeId: 1,
    });
    const setTrigger = useContext(TriggerSetStateContext);
    const onClickCloseModal = () => setIsAddMode(false);

    const onClickCreate = async () => {
        if (!createData.toClean || !createData.name) {
            alert("to-clean 내용과 담당자를 모두 입력해주세요.");
            return;
        }
        const due = new Date(createData.due_data);

        // D-day로 추가 -> 기한 지남 처리되는 오류 잡음
        const now = new Date();
        const d_day = Math.ceil(
            (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        setIsAdding(true);

        try {
            const res1 = await axiosInstance.get("/spaces/info/");
            const checklistSpace = res1.data.data.find(
                (space) =>
                    space.space_name === createData.place ||
                    space.space_name === createData.parentPlace
            );
            if (!checklistSpace)
                throw new Error("공간 정보를 찾을 수 없습니다");

            const res2 = await axiosInstance.get("/groups/member-info/");
            const user = res2.data.data.find((m) => m.name === createData.name);
            if (!user) throw new Error("사용자 정보 없음");
            const requestBody = {
                checklist_id: checklistSpace.space_id,
                email: user.email,
                title: createData.toClean,
                due_date: createData.due_data,
                unit_item:
                    createData.target === "person" ? createData.place : null,
            };
            console.log("requestBody", requestBody);

            const res3 = await axiosInstance.post(
                "/checklists/create/",
                requestBody
            );

            if (res3.data.success) {
                console.log("res", res3);
                const newItem = {
                    ...createData,
                    id: res3.data.data.checklist_item_id,
                    deadLine: d_day > 0 ? `D-${d_day}` : "D-day",
                    // wait: 0,
                };

                addCheckItem(newItem);
                setIsAddMode(false);
                setTrigger((prev) => prev + 1);
            }
        } catch (e) {
            console.error("체크리스트 추가 실패:", e);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="GListAddModal">
            <Modal
                isOpen={isAddMode}
                onClose={onClickCloseModal}
                contentStyle={{
                    minWidth: "500px",
                    width: "500px",
                    minHeight: "550px",
                    height: "550px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    className: "AddModal",
                    position: "relative",
                }}
            >
                <div className="selectedPlace">{selectedPlace}</div>
                <section className="createToClean">
                    <div className="toClean_text">
                        추가하실 to-clean을 입력하세요.
                    </div>
                    <textarea
                        value={createData.toClean}
                        onChange={(e) =>
                            setCreateData((prev) => ({
                                ...prev,
                                toClean: e.target.value,
                            }))
                        }
                    />
                </section>
                <section className="createDeadLine">
                    <div className="deadLine_text">마감 기한</div>
                    <DatePicker
                        className="DatePicker"
                        placeholderText="0000-00-00"
                        locale="ko"
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setCreateData((prev) => ({
                                ...prev,
                                due_data: toKoreaTime(date), // toISOString -> '우리나라 시간 - 9시간' (따라서 ISO변환 전 +9 해둬야 함)
                            }));
                        }}
                        shouldCloseOnSelect={false}
                    />
                </section>
                <section className="selectPerson">
                    <div className="personTodo_text">담당자</div>
                    <div className="personTodo">
                        {personData.map((item) => (
                            <button
                                className={`hover_${
                                    activeName === item.name
                                        ? "active"
                                        : "button"
                                }`}
                                key={item.name}
                                onClick={() => {
                                    setCreateData((prev) => ({
                                        ...prev,
                                        name: item.name,
                                        badgeId: item.badgeId,
                                    }));
                                    setActiveName(item.name);
                                }}
                            >
                                <img
                                    className="BadgeTodo"
                                    src={getBadgeImage(item.badgeId)}
                                    alt="badge"
                                />
                                <div className="nameTodo">{item.name}</div>
                            </button>
                        ))}
                    </div>
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

export default GListAddModal;
