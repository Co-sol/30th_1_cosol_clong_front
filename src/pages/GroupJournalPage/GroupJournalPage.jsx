// GroupJournalPage.jsx
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

// ISO 문자열을 YYYY-MM-DD로 변환하는 헬퍼
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
  const todayStr = toDateStr(today.toISOString());

  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);

  const weekLabel = `${currentWeek[0].getMonth() + 1}월`;
  const selectedDate = currentWeek[selectedDay];
  const selectedDateStr = toDateStr(selectedDate.toISOString());
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

  const [logs, setLogs] = useState([
    { user: "cosol", task: "저녁 설거지하기", place: "부엌", date: "2025-07-12", finish: true, completed: false, likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "세탁기 돌리기", place: "욕실", date: "2025-07-12", finish: true, completed: false, likeCount: 2, dislikeCount: 2, reacted: null },
    { user: "cosol", task: "아침 설거지", place: "부엌", date: "2025-07-11", finish: true, completed: true, completedAt: "2025-07-11T09:00:00Z", likeCount: 3, dislikeCount: 0, reacted: null },
    { user: "solux", task: "변기 청소하기", place: "화장실", date: "2025-07-11", finish: false, completed: false, likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "sook", task: "책상 정리하기", place: "C의 방", date: "2025-07-10", finish: true, completed: true, completedAt: "2025-07-10T10:00:00Z", likeCount: 3, dislikeCount: 0, reacted: null },
    { user: "sook", task: "침대 정리하기", place: "C의 방", date: "2025-07-10", finish: false, completed: false, likeCount: 0, dislikeCount: 0, reacted: null },
  ]);

  const handleFeedback = (index, type) => {
    setLogs((prev) => {
      const newLogs = [...prev];
      const log = newLogs[index];
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
      }
      if (log.dislikeCount >= 3 && log.finish && !log.completed) {
        log.failedAt = now;
      }

      return newLogs;
    });
  };

  const isToday = selectedDateStr === todayStr;
  const isPastDate = new Date(selectedDateStr) < new Date(todayStr);

  // 1) 멤버별 '검토 대기' 개수
  const pendingCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) =>
        log.user === m.name &&
        log.finish &&
        !log.completed &&
        log.likeCount < 3 &&
        log.dislikeCount < 3
    ).length;
    return acc;
  }, {});

  // 2) 멤버별 '미션 실패' 개수 (과거 선택일 기준)
  const failedCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) =>
        log.user === m.name &&
        (
          (!log.finish && log.date === selectedDateStr) ||
          (log.finish && log.dislikeCount >= 3 && toDateStr(log.failedAt) === selectedDateStr)
        )
    ).length;
    return acc;
  }, {});

  // 3) 멤버별 '청소 완료' 개수 (선택일 기준)
  const completedCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) =>
        log.user === m.name &&
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === selectedDateStr
    ).length;
    return acc;
  }, {});

  // 4) 좌측 캘린더의 전체 완료 합계 (모든 멤버)
  const aggregateCompletedByDate = (dateStr) =>
    logs.filter(
      (log) =>
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === dateStr
    ).length;

  // 5) 우측 로그 필터링
  const filteredLogs = logs.filter((log) => {
    if (log.user !== selectedMember) return false;
    if (
      isToday &&
      log.finish &&
      !log.completed &&
      log.likeCount < 3 &&
      log.dislikeCount < 3
    ) return true;
    if (
      log.finish &&
      log.completed &&
      toDateStr(log.completedAt) === selectedDateStr
    ) return true;
    if (
      (!log.finish && log.date === selectedDateStr) ||
      (log.finish &&
        log.dislikeCount >= 3 &&
        toDateStr(log.failedAt) === selectedDateStr)
    ) return true;
    return false;
  });

  return (
    <>
      <Header />
      <div className="groupjournal-scaled">
        <div className="groupjournal-wrapper">
          <div className="groupjournal-container">

            {/* 좌측: 캘린더 + 멤버 카드 */}
            <div className="groupjournal-left">

              {/* 캘린더 */}
              <div className="calendar-section">
                <div className="week-label">
                  <div
                    className="arrow-button left"
                    onClick={() => setWeekOffset(prev => prev - 1)}
                  />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div
                    className="arrow-button right"
                    onClick={() => setWeekOffset(prev => prev + 1)}
                  />
                </div>
                <div className="day-labels">
                  {["일","월","화","수","목","금","토"].map((d,i) => (
                    <div className="day-label" key={i}>{d}</div>
                  ))}
                </div>
                <div className="day-selector">
                  {currentWeek.map((date,i) => { 
                    const dateStr = toDateStr(date.toISOString());
                    const count = aggregateCompletedByDate(dateStr);
                    const isFuture = date > today;
                    return (
                      <div
                        key={i}
                        className={`day-box ${selectedDay === i ? "selected" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{
                          cursor: isFuture ? "default" : "pointer",
                          opacity: isFuture ? 0.5 : 1
                        }}
                      >
                        {date.getDate()}
                        {/* 미래일에도 빈칸을 넣어 레이아웃 유지 */}
                        <div className="day-status">
                          {!isFuture
                            ? `청소 완료 ${count}`
                            : '\u00A0'
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 멤버 카드 */}
              <div className="member-grid">
                {paddedMembers.map((m,idx) => (
                  <div
                    key={idx}
                    className={`member-card ${selectedMember === m.name ? "selected" : ""}`}
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
                              <div className="value success">
                                {completedCounts[m.name] || 0}
                              </div>
                            </div>
                            <div className="stat-block">
                              <div className="label">
                                {isToday ? "검토 대기" : isPastDate ? "미션 실패" : "검토 대기"}
                              </div>
                              <div className="value fail">
                                {isToday
                                  ? pendingCounts[m.name] || 0
                                  : isPastDate
                                  ? failedCounts[m.name] || 0
                                  : 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="member-placeholder"/>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 선택일 로그 */}
            <div className="groupjournal-right">
              <div className="groupjournal-sidecard">
                <div className="card-section-header column">
                  <h2 className="side-date">{displayMonth}/{displayDay}</h2>
                </div>
                <div className="log-list">
                  {filteredLogs.length === 0 ? (
                    <p className="no-logs">일지가 없습니다.</p>
                  ) : (
                    filteredLogs.map((log,i) => {
                      const isFailed = (!log.finish && log.date === selectedDateStr)
                        || (log.finish && log.dislikeCount >= 3 && toDateStr(log.failedAt) === selectedDateStr);
                      const isPending = isToday && log.finish && !log.completed && log.likeCount < 3 && log.dislikeCount < 3;
                      const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            isSuccess ? "completed" :
                            isFailed ? "failed" :
                            isPending ? "incomplete" : ""
                          }`}
                        >
                          <p className="log-meta">
                            {displayMonth}월 {displayDay}일 / {log.place} / {log.user}
                          </p>
                          <h4 className="log-task">{log.task}</h4>
                          <div className="log-feedback">
                            {!isSuccess && !isFailed && (
                              <>
                                <button onClick={() => handleFeedback(i, "like")}>
                                  👍 {log.likeCount}
                                </button>
                                <button onClick={() => handleFeedback(i, "dislike")}>
                                  👎 {log.dislikeCount}
                                </button>
                              </>
                            )}
                          </div>
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
