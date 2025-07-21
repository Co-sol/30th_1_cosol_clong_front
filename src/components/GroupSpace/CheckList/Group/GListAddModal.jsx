import "./GListAddModal.css";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import Modal from "../../../Modal";
import Button from "../../../Button";

import {
    toCleanStateContext,
    toCleanDispatchContext,
} from "../../../../context/GroupContext";
import { getBadgeImage } from "../../../../utils/get-badge-images";
import DatePicker from "react-datepicker";

import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

import axiosInstance from "../../../../api/axiosInstance";

registerLocale("ko", ko);

const GListAddModal = ({
    selectedData,
    isAddMode,
    setIsAddMode,
    selectedPlace,
}) => {
    const { onCreate } = useContext(toCleanDispatchContext);
    const { personData } = useContext(toCleanStateContext);
    const [activeName, setActiveName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [createData, setCreateData] = useState({
        target: !selectedData ? "group" : "person", // 그룹공간에서 접근할때 : 개인공간에서 접근할 때 (장소 선택 시)
        parentPlace: !selectedData ? "none" : selectedData.name,
        place: selectedPlace,
        toClean: "",
        deadLine: "미정",
        due_data: new Date(),
        name: "",
        badgeId: 1,
    });

    const onClickCloseModal = () => {
        setIsAddMode(false);
    };

    const onClickCreate = () => {
        // 유효성 검사 예: toClean 또는 name이 없으면 추가 중단
        if (!createData.toClean || !createData.name) {
            alert("to-clean 내용과 담당자를 모두 입력해주세요.");
            return;
        }

        onCreate(
            createData.target,
            createData.name,
            createData.badgeId,
            createData.parentPlace,
            createData.place,
            createData.toClean,
            createData.deadLine,
            createData.due_data
        );
        setIsAddMode(false);
    };

    return (
        <div className="GListAddModal">
            <Modal
                isOpen={isAddMode}
                onClose={onClickCloseModal}
                contentStyle={{
                    width: "39vw",
                    maxWidth: "561.6px",
                    height: "44vw",
                    maxHeight: "633.6px",
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
                        name="toClean"
                        value={createData.toClean}
                        onChange={(e) => {
                            setCreateData({
                                ...createData,
                                toClean: e.target.value,
                            });
                        }}
                    ></textarea>
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
                            const d_day = Math.ceil(
                                (date.getTime() - new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                            );
                            setSelectedDate(date);
                            setCreateData((prev) => ({
                                ...prev,
                                deadLine: `${
                                    d_day > 0 ? `D-${d_day}` : "D-day"
                                }`,
                                due_data: date.toISOString(),
                            }));
                        }}
                        shouldCloseOnSelect={false}
                    />
                </section>
                <section className="selectPerson">
                    <div className="personTodo_text">담당자</div>
                    <div className="personTodo">
                        {personData.map((item) => {
                            return (
                                <button
                                    className={`hover_${
                                        activeName === item.name
                                            ? "active"
                                            : "button"
                                    }`}
                                    key={item.name}
                                    onClick={() => {
                                        setCreateData({
                                            ...createData,
                                            name: item.name,
                                            badgeId: item.badgeId,
                                        });
                                        setActiveName(item.name);
                                    }}
                                >
                                    <img
                                        className="BadgeTodo"
                                        src={getBadgeImage(item.badgeId)}
                                    />
                                    <div className="nameTodo">{item.name}</div>
                                </button>
                            );
                        })}
                    </div>
                </section>
                <Button onClick={onClickCreate} type={"save"} text={"저장"} />
            </Modal>
        </div>
    );
};

export default GListAddModal;
