import "./PListAddModal.css";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import Modal from "../../../Modal";
import Button from "../../../Button";

import {
    toCleanStateContext,
    toCleanDispatchContext,
} from "../../../../context/GroupContext";
import DatePicker from "react-datepicker";

import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import DropDown from "./DropDown";

registerLocale("ko", ko);

const PListAddModal = ({
    isAddMode,
    setIsAddMode,
    targetPlaceData,
    selectedName,
    selectedBadgeId,
    selectedParentPlace,
}) => {
    const { onCreate } = useContext(toCleanDispatchContext);
    const { personData } = useContext(toCleanStateContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [createData, setCreateData] = useState({
        target: "person",
        parentPlace: selectedParentPlace,
        place: "",
        toClean: "",
        deadLine: "미정",
        due_data: new Date(),
        name: selectedName,
        badgeId: selectedBadgeId,
    });

    const onClickCloseModal = () => {
        setIsAddMode(false);
    };

    const onClickCreate = () => {
        // 유효성 검사 예: toClean 또는 name이 없으면 추가 중단
        if (!createData.toClean || !createData.place) {
            alert("장소와 to-clean 내용을 모두 입력해주세요.");
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
        <div className="PListAddModal">
            <Modal
                isOpen={isAddMode}
                onClose={onClickCloseModal}
                contentStyle={{
                    minWidth: "475.45px",
                    width: "37.0vw", // Modal 하드 코딩 덮으려고 clamp가 아니라 쪼개서 씀 (min/maxWidth가 Modal에 하드코딩되어 있음)
                    maxWidth: "532.8px",
                    height: "clamp(501.15px ,39.0vw ,561.6px)", // 39 * 14.4 = 561.6

                    paddingTop: "clamp(64.25px ,5.0vw ,72.0px)", // 5 * 14.4
                    paddingBottom: "clamp(38.55px ,3.0vw ,43.2px)", // 3 * 14.4

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",

                    className: "AddModal",
                    position: "relative",
                }}
            >
                <div className="selectedPlace">{selectedParentPlace}</div>
                <section className="place_section">
                    <div className="place_text">장소를 선택하세요</div>
                    <DropDown
                        title={"장소 선택"}
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
                            // 선택한 날짜와 오늘 날짜 빼서 'ms(getTime)->일' 단위로 변환
                            const d_day = Math.ceil(
                                (date.getTime() - new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                            );
                            setSelectedDate(date);
                            setCreateData((prev) => ({
                                ...prev,
                                deadLine: `${
                                    // d_day면 D-day 출력, 아니면 'D-N' 출력
                                    d_day > 0 ? `D-${d_day}` : "D-day"
                                }`,
                                due_data: date.toISOString(),
                            }));
                        }}
                        shouldCloseOnSelect={false}
                    />
                </section>
                <Button onClick={onClickCreate} type={"save"} text={"저장"} />
            </Modal>
        </div>
    );
};

export default PListAddModal;
