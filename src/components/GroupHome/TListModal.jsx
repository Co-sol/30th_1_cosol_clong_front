import { useState, useEffect } from "react";
import { getBadgeImage } from "../../utils/get-badge-images";
import TListItem from "./TListItem";
import axiosInstance from "../../api/axiosInstance";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "white",
    padding: "31.23px 35.69px",
    height: "696.04px",
    width: "544.34px",
    boxShadow: "0 3.57px 21.42px rgba(0, 0, 0, 0.15)",
    borderRadius: "17.85px",
    marginTop: "64.25px",
    marginBottom: "70.5px",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: "10.71px",
    right: "10.71px",
    background: "none",
    border: "none",
    fontSize: "21.42px",
    cursor: "pointer",
    color: "#888",
    fontFamily: "NotoSansKR-Regular, sans-serif",
    fontWeight: 400,
  },
};

const TListModal = ({ isOpen, onClose, person }) => {
  const [owner, setIsOwner] = useState("임시");
  const [checkListData, setCheckListData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCheckListData = async () => {
      setIsSaving(true);
      try {
        const res = await axiosInstance.get("/checklists/total-view/");
        const resData = res.data.data || [];

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
            wait: item.status !== undefined ? (item.status !== 0 ? 1 : 0) : 0,
          };
        });

        setCheckListData(sumCheckListData);
      } catch (e) {
        console.error("checkListItem 데이터 불러오기 실패:", e);
      } finally {
        setIsSaving(false);
      }
    };
    fetchCheckListData();
  }, []);

  useEffect(() => {
    const fetchOwner = async () => {
      setIsSaving(true);
      try {
        const res = await axiosInstance.get("/mypage/info/");
        setIsOwner(res.data.data.name);
      } catch (error) {
        console.error("로그인 주체 불러옴:", error);
      } finally {
        setIsSaving(false);
      }
    };
    fetchOwner();
  }, []);

  const selectedName = person.name;
  const targetPersonData = checkListData.filter(
    (item) => String(item.name) === String(selectedName) && item.wait !== 1
  );

  const handleItemCompleted = (id) => {
    setCheckListData((prev) =>
      prev.map((i) => (i.id === id ? { ...i, wait: 1 } : i))
    );
  };

  if (!isOpen) return null;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>
          ×
        </button>
        <div className="TList">
          <h3
            style={{
              fontSize: "21.42px",
              textAlign: "center",
              paddingTop: "16.95px",
              paddingBottom: "20.08px",
              marginBottom: 0,
              fontWeight: "bold",
            }}
          >
            To-clean
          </h3>
          <div
            className="profile"
            style={{
              textAlign: "center",
              marginBottom: "24.09px",
            }}
          >
            <img
              style={{
                width: "62.82px",
                height: "62.82px",
                borderRadius: "50%",
                border: "4.28px solid rgb(164, 235, 217)",
              }}
              src={getBadgeImage(person.badgeId)}
              alt="profile"
            />
          </div>
          <section
            className="title"
            style={{
              display: "flex",
              marginLeft: "3.85px",
              marginBottom: "5.14px",
              fontSize: "14.13px",
              color: "rgb(103, 103, 103)",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: 'sans-serif, "Noto Sans KR"',
              position: "relative",
            }}
          >
            <div
              className="target_text"
              style={{
                left: "25.16px",
                position: "absolute",
              }}
            >
              구분
            </div>
            <div
              className="place_text"
              style={{
                left: "93.5px",
                position: "absolute",
              }}
            >
              공간
            </div>
            <div
              className="toclean_text"
              style={{
                left: "203.46px",
                position: "absolute",
              }}
            >
              to-clean
            </div>
            <div
              className="deadLine_text"
              style={{
                left: "340.97px",
                position: "absolute",
              }}
            >
              기한
            </div>
          </section>
          <div
            className="scrollBar"
            style={{
              marginTop: "24.99px",
              marginLeft: "9.82px",
              width: "467.6px",
              height: "409.59px",
              overflowY: "auto",
            }}
          >
            {targetPersonData.map((item) => (
              <TListItem
                key={item.id}
                item={item}
                owner={owner}
                onCompleted={handleItemCompleted}
              />
            ))}
          </div>
        </div>
      </div>
      {isSaving && (
        <div className="save-overlay">
          <div className="save-spinner"></div>
          <div className="save-message"></div>
        </div>
      )}
    </div>
  );
};

export default TListModal;
