import React, { useState } from "react";
import Header from "../../components/Header";
import "./GroupJournalPage.css";

const getWeekDates = (baseDate) => {
  const dayOfWeek = baseDate.getDay();
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

function GroupJournalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMember, setSelectedMember] = useState("cosol");
  const [members, setMembers] = useState([
    { name: "cosol", badge: "badge1", success: 0, fail: 0 },
    { name: "solux", badge: "badge2", success: 0, fail: 0 },
    { name: "sook", badge: "badge3", success: 0, fail: 0 },
  ]);

  const MAX_MEMBER_COUNT = 4;

  const paddedMembers = [
    ...members,
    ...Array(MAX_MEMBER_COUNT - members.length).fill({}),
  ];

  const today = new Date();
  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);

  const weekLabel = `${currentWeek[0].getMonth() + 1}월 ${Math.ceil(currentWeek[0].getDate() / 7)}째주`;
  const selectedDate = currentWeek[selectedDay];
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;
  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const [logs, setLogs] = useState([
    {
      user: "cosol",
      task: "저녁 설거지하기",
      place: "부엌",
      date: "2025-07-11",
      completed: true,
      likeCount: 3,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "cosol",
      task: "세탁기 돌리기",
      place: "욕실",
      date: "2025-07-11",
      completed: false,
      likeCount: 2,
      dislikeCount: 1,
      reacted: null,
    },
    {
      user: "solux",
      task: "변기 청소하기",
      place: "화장실",
      date: "2025-07-11",
      completed: false,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "solux",
      task: "바닥 청소하기",
      place: "거실",
      date: "2025-07-11",
      completed: false,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "sook",
      task: "책상 정리하기",
      place: "C의 방",
      date: "2025-07-10",
      completed: true,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "sook",
      task: "침대 정리하기",
      place: "C의 방",
      date: "2025-07-10",
      completed: false,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
  ]);

  const handleFeedback = (logIndex, type) => {
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      const log = newLogs[logIndex];
      if (log.completed) return newLogs;

      if (log.reacted === type) return newLogs;

      if (type === "like") {
        if (log.reacted === "dislike") {
          log.dislikeCount -= 1;
        }
        log.likeCount += 1;
        log.reacted = "like";
      } else if (type === "dislike") {
        if (log.reacted === "like") {
          log.likeCount -= 1;
        }
        log.dislikeCount += 1;
        log.reacted = "dislike";
      }

      if (log.likeCount >= 3 && !log.completed) {
        log.completed = true;
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.name === log.user
              ? { ...member, success: member.success + 1, fail: Math.max(member.fail - 1, 0) }
              : member
          )
        );
      }

      return newLogs;
    });
  };

  const filteredLogs = logs.filter(
    (log) =>
      new Date(log.date).toDateString() === selectedDate.toDateString() &&
      log.user === selectedMember
  );

  return (
    <>
      <Header />
      <div className="groupjournal-scaled">
        <div className="groupjournal-wrapper">
          <div className="groupjournal-container">
            <div className="groupjournal-left">
              <div className="calendar-section">
                <div className="week-label">
                  <div className="arrow-button left" onClick={() => setWeekOffset(weekOffset - 1)} />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div className="arrow-button right" onClick={() => setWeekOffset(weekOffset + 1)} />
                </div>

                <div className="day-labels">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
                    <div className="day-label" key={idx}>{d}</div>
                  ))}
                </div>

                <div className="day-selector">
                  {currentWeek.map((date, idx) => (
                    <div
                      key={idx}
                      className={`day-box ${selectedDay === idx ? "selected" : ""}`}
                      onClick={() => setSelectedDay(idx)}
                    >
                      {date.getDate()}
                      <div className="day-status">청소 완료 2</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="member-grid" onClick={(e) => e.stopPropagation()}>
                {paddedMembers.map((m, idx) => (
                  <div
                    className={`member-card ${selectedMember === m.name ? "selected" : ""}`}
                    key={idx}
                    onClick={() => m.name && setSelectedMember(m.name)}
                    style={{ cursor: m.name ? "pointer" : "default" }}
                  >
                    {m.name ? (
                      <>
                        <div className="member-name">{m.name}</div>
                        <div className="member-content">
                          <img
                            src={`/assets/${m.badge}.png`}
                            alt={`${m.name}의 배지`}
                            className="avatar-img"
                          />
                          <div className="stats-columns">
                            <div className="stat-block">
                              <div className="label">청소 완료</div>
                              <div className="value success">{m.success}</div>
                            </div>
                            <div className="stat-block">
                              <div className="label">검토 대기</div>
                              <div className="value fail">{m.fail}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="member-placeholder" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="groupjournal-right">
              <div className="groupjournal-sidecard">
                <div className="card-section-header column">
                  <h2 className="side-date">{displayMonth}/{displayDay}</h2>
                </div>
                <div className="log-list">
                  {filteredLogs.length === 0 ? (
                    <p className="no-logs">일지가 없습니다.</p>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`log-item-box ${log.completed ? "completed" : "incomplete"}`}
                      >
                        <p className="log-meta">{displayMonth}월 {displayDay}일 / {log.place} / {log.user}</p>
                        <h4 className="log-task">{log.task}</h4>
                        {!log.completed && (
                          <div className="log-feedback">
                            <button onClick={() => handleFeedback(logs.indexOf(log), "like")}>
                              👍 {log.likeCount || 0}
                            </button>
                            <button onClick={() => handleFeedback(logs.indexOf(log), "dislike")}>
                              👎 {log.dislikeCount || 0}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default GroupJournalPage;
