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

// ISO 문자열을 YYYY-MM-DD 형태로 잘라주는 헬퍼
const toDateStr = (iso) => iso.split("T")[0];

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
  const todayStr = today.toISOString().split("T")[0];

  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);

  const weekLabel = `${currentWeek[0].getMonth() + 1}월`;
  const selectedDate = currentWeek[selectedDay];
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

  const [logs, setLogs] = useState([
    {
      user: "cosol",
      task: "저녁 설거지하기",
      place: "부엌",
      date: "2025-07-12",
      finish: true,
      completed: false,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "cosol",
      task: "세탁기 돌리기",
      place: "욕실",
      date: "2025-07-12",
      finish: true,
      completed: false,
      likeCount: 2,
      dislikeCount: 2,
      reacted: null,
    },
    {
      user: "solux",
      task: "변기 청소하기",
      place: "화장실",
      date: "2025-07-11",
      finish: false,
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
      finish: false,
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
      finish: true,
      completed: true,
      completedAt: "2025-07-10T10:00:00Z",
      likeCount: 3,
      dislikeCount: 0,
      reacted: null,
    },
    {
      user: "sook",
      task: "침대 정리하기",
      place: "C의 방",
      date: "2025-07-10",
      finish: false,
      completed: false,
      likeCount: 0,
      dislikeCount: 0,
      reacted: null,
    },
  ]);

  const handleFeedback = (logIndex, type) => {
    setLogs((prev) => {
      const newLogs = [...prev];
      const log = newLogs[logIndex];
      if (log.completed) return newLogs;
      if (log.reacted === type) return newLogs;

      const now = new Date().toISOString();

      if (type === "like") {
        if (log.reacted === "dislike") log.dislikeCount--;
        log.likeCount++;
        log.reacted = "like";
      } else {
        if (log.reacted === "like") log.likeCount--;
        log.dislikeCount++;
        log.reacted = "dislike";
      }

      if (log.likeCount >= 3 && log.finish && !log.completed) {
        log.completed = true;
        log.completedAt = now;
        setMembers((ms) =>
          ms.map((m) =>
            m.name === log.user
              ? { ...m, success: m.success + 1, fail: Math.max(m.fail - 1, 0) }
              : m
          )
        );
      }

      if (log.dislikeCount >= 3 && log.finish && !log.completed) {
        log.failedAt = now;
      }

      return newLogs;
    });
  };

  const isToday = selectedDateStr === todayStr;
  const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0);

  const filteredLogs = logs.filter((log) => {
    if (log.user !== selectedMember) return false;

    // 2) 청소 완료
    if (log.finish && log.likeCount >= 3) {
      const completedDay = toDateStr(log.completedAt);
      return completedDay === selectedDateStr;
    }

    // 1) 검토 대기
    if (
      isToday &&
      log.finish &&
      log.likeCount <= 2 &&
      log.dislikeCount <= 2
    ) {
      return true;
    }

    // 3) 미션 실패 — finish false
    if (!log.finish) {
      return log.date === selectedDateStr;
    }

    // 3) 미션 실패 — dislike 3개
    if (log.finish && log.dislikeCount >= 3) {
      const failedDay = toDateStr(log.failedAt);
      return failedDay === selectedDateStr;
    }

    return false;
  });

  return (
    <>
      <Header />
      <div className="groupjournal-scaled">
        <div className="groupjournal-wrapper">
          <div className="groupjournal-container">
            <div className="groupjournal-left">
              {/* 캘린더 */}
              <div className="calendar-section">
                <div className="week-label">
                  <div
                    className="arrow-button left"
                    onClick={() => setWeekOffset(weekOffset - 1)}
                  />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div
                    className="arrow-button right"
                    onClick={() => setWeekOffset(weekOffset + 1)}
                  />
                </div>
                <div className="day-labels">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                    <div className="day-label" key={i}>{d}</div>
                  ))}
                </div>
                <div className="day-selector">
                  {currentWeek.map((date, i) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const completedCount = logs.filter(
                      (l) =>
                        l.finish &&
                        l.likeCount >= 3 &&
                        toDateStr(l.completedAt) === dateStr
                    ).length;
                    const isFuture = date > today;
                    return (
                      <div
                        key={i}
                        className={`day-box ${selectedDay === i ? "selected" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{
                          cursor: isFuture ? "default" : "pointer",
                          opacity: isFuture ? 0.5 : 1,
                        }}
                      >
                        {date.getDate()}
                        {!isFuture && (
                          <div className="day-status">
                            {completedCount > 0 ? `청소 완료 ${completedCount}` : ""}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 멤버 카드 */}
              <div className="member-grid" onClick={(e) => e.stopPropagation()}>
                {paddedMembers.map((m, i) => (
                  <div
                    key={i}
                    className={`member-card ${
                      selectedMember === m.name ? "selected" : ""
                    }`}
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

            {/* 오른쪽 로그 카드 */}
            <div className="groupjournal-right">
              <div className="groupjournal-sidecard">
                <div className="card-section-header column">
                  <h2 className="side-date">{displayMonth}/{displayDay}</h2>
                </div>
                <div className="log-list">
                  {filteredLogs.length === 0 ? (
                    <p className="no-logs">일지가 없습니다.</p>
                  ) : (
                    filteredLogs.map((log, i) => {
                      const isFailed = !log.finish || (log.finish && log.dislikeCount >= 3);
                      const isPending =
                        log.finish &&
                        log.likeCount <= 2 &&
                        log.dislikeCount <= 2 &&
                        isToday;
                      const isSuccess = log.finish && log.likeCount >= 3;

                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            isSuccess
                              ? "completed"
                              : isPending
                              ? "incomplete"
                              : isFailed
                              ? "failed"
                              : ""
                          }`}
                        >
                          <p className="log-meta">
                            {displayMonth}월 {displayDay}일 / {log.place} / {log.user}
                          </p>
                          <h4 className="log-task">{log.task}</h4>
                          {!isSuccess && !isFailed && (
                            <div className="log-feedback">
                              <button onClick={() => handleFeedback(logs.indexOf(log), "like")}>
                                👍 {log.likeCount}
                              </button>
                              <button onClick={() => handleFeedback(logs.indexOf(log), "dislike")}>
                                👎 {log.dislikeCount}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
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
