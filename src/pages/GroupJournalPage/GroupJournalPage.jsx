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
const toDateStr = (value) => {
  // 문자열이면 Date 객체로 변환
  const date = typeof value === "string" ? new Date(value) : value;
  // 유효한 Date 객체가 아니면 빈 문자열 리턴
  if (!(date instanceof Date) || isNaN(date)) return "";
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const dd   = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function GroupJournalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMember, setSelectedMember] = useState("현영");
  const currentUser = "현영";

  const [members, setMembers] = useState([
    { name: "cosol", badge: "badge1", success: 0, fail: 0 },
    { name: "solux", badge: "badge2", success: 0, fail: 0 },
    { name: "sook",  badge: "badge3", success: 0, fail: 0 },
    { name: "현영",   badge: "badge4", success: 0, fail: 0 },
  ]);

  const threshold = Math.round((members.length - 1) / 2);

  // 1) 본인 객체 꺼내기
  const me = members.find(m => m.name === currentUser);
  // 2) 본인 제외한 나머지
  const others = members.filter(m => m.name !== currentUser);
  // 3) 순서 재조합 (본인 먼저)
  const displayMembers = [me, ...others];

  const MAX_MEMBER_COUNT = 4;
  const paddedMembers = [
    ...displayMembers,
    ...Array(MAX_MEMBER_COUNT - displayMembers.length).fill({}),
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
    // --- 7/14 cosol 데이터 ---
    { user: "cosol", task: "저녁 설거지하기", place: "부엌",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "세탁기 돌리기",   place: "욕실",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "바닥 청소하기",   place: "거실",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "저녁 설거지하기", place: "부엌",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "세탁기 돌리기",   place: "욕실",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "바닥 청소하기",   place: "거실",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 0, reacted: null },
    { user: "cosol", task: "창문 닦기",       place: "방",     date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 1, reacted: null },
    { user: "solux", task: "쓰레기 버리기",   place: "현관",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 1, reacted: null },
    { user: "sook", task: "세차하기",         place: "주차장", date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 1, reacted: null },
    { user: "sook", task: "세차하기",         place: "주차장", date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "현영", task: "책장 정리하기",     place: "서재",   date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 1, dislikeCount: 0, reacted: null },
    { user: "현영", task: "욕실 청소하기",     place: "화장실", date: "2025-07-14", finish: true,  completed: false, completedAt: null, likeCount: 0, dislikeCount: 2, reacted: "dislike", failedAt: "2025-07-14T11:00:00Z" },
    { user: "cosol", task: "아침 설거지",     place: "부엌",   date: "2025-07-13", finish: true,  completed: true,  completedAt: "2025-07-13T09:00:00Z", likeCount: 2, dislikeCount: 0, reacted: null },
    { user: "solux", task: "변기 청소하기",   place: "화장실", date: "2025-07-13", finish: false, completed: false, completedAt: null,                likeCount: 0, dislikeCount: 0, reacted: null },
    { user: "sook",  task: "책상 정리하기",   place: "C의 방", date: "2025-07-13", finish: true,  completed: true,  completedAt: "2025-07-13T10:00:00Z", likeCount: 2, dislikeCount: 0, reacted: null },
    { user: "sook",  task: "침대 정리하기",   place: "C의 방", date: "2025-07-13", finish: false, completed: false, completedAt: null,                likeCount: 0, dislikeCount: 0, reacted: null },
  ]);

  // 변경 후
  const handleFeedback = (targetLog, type) => {
    setLogs(prev =>
      prev.map(log => {
        if (log.user === currentUser || log.reacted) return log;
        // 다른 로그면 그대로
        if (log !== targetLog) return log;

        // 이미 완료된 항목은 무시
        if (log.completed) return log;
        // 같은 반응 또 누르면 무시
        if (log.reacted === type) return log;
 
        const now = new Date().toISOString();
        const updated = { ...log };

        if (type === "like") {
          if (updated.reacted === "dislike") updated.dislikeCount--;
          updated.likeCount++;
          updated.reacted = "like";
        } else {
          if (updated.reacted === "like") updated.likeCount--;
          updated.dislikeCount++;
          updated.reacted = "dislike";
        }

      // 임계치 도달 시 완료/실패 처리
        if (updated.likeCount >= threshold && updated.finish && !updated.completed) {
          updated.completed = true;
          updated.completedAt = now;
        }
        if (updated.dislikeCount >= threshold && updated.finish && !updated.completed) {
          updated.failedAt = now;
        }

        return updated;
      })
   );
  };

  const isToday      = selectedDateStr === todayStr;
  const isPastDate   = new Date(selectedDateStr) < new Date(todayStr);

  // 1) 멤버별 '검토 대기' 개수
  const pendingCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) =>
        log.user === m.name &&
        log.finish &&
        !log.completed &&
        log.likeCount < threshold &&
        log.dislikeCount < threshold
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
          (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr)
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
      log.likeCount < threshold &&
      log.dislikeCount < threshold
    ) return true;
    if (
      log.finish &&
      log.completed &&
      toDateStr(log.completedAt) === selectedDateStr
    ) return true;
    if (
      (!log.finish && log.date === selectedDateStr) ||
      (log.finish && log.dislikeCount >= threshold &&
        toDateStr(log.failedAt) === selectedDateStr)
    ) return true;
  });

  const getStatusOrder = (log) => {
    const isPending = isToday && log.finish && !log.completed && log.likeCount < threshold && log.dislikeCount < threshold;
    const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
    const isFailed  = (!log.finish && log.date === selectedDateStr)
                     || (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr);

    if (isPending) return 0;
    if (isSuccess) return 1;
    if (isFailed)  return 2;
    return 3;
  };

  const sortedLogs = filteredLogs
    .slice()  // 원본 훼손 방지
    .sort((a, b) => getStatusOrder(a) - getStatusOrder(b));

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
                        className={`day-box ${selectedDay === i && !isFuture ? "selected" : ""} ${isFuture ? "future" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{
                          cursor: isFuture ? "default" : "pointer",
                          opacity: isFuture ? 0.5 : 1
                        }}
                      >
                        {date.getDate()}
                        <div className="day-status">
                          {!isFuture ? `청소 완료 ${count}` : '\u00A0'}
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
                  {sortedLogs.length === 0 ? (
                    <p className="no-logs">일지가 없습니다.</p>
                  ) : (
                    sortedLogs.map((log,i) => {
                      const isFailed  = (!log.finish && log.date === selectedDateStr)
                        || (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr);
                      const isPending = isToday && log.finish && !log.completed && log.likeCount < threshold && log.dislikeCount < threshold;
                      const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
                      const logDate = new Date(log.date);
                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            isSuccess ? "completed" :
                            isFailed  ? "failed"    :
                            isPending ? "incomplete" : ""
                          }`}
                        >
                          <p className="log-meta">
                            {logDate.getMonth() + 1}월 {logDate.getDate()}일 / {log.place} / {log.user}
                          </p>
                          <h4 className="log-task">{log.task}</h4>
                          <div className="log-feedback">
                            {!isSuccess && !isFailed && (
                                <>
                                <button
                                    onClick={() => handleFeedback(log, "like")}
                                    disabled={log.user === currentUser || log.reacted}
                                    className={log.user === currentUser || log.reacted ? "btn-disabled" : ""}
                                >
                                    👍 {log.likeCount}
                                </button>
                                <button
                                    onClick={() => handleFeedback(log, "dislike")}
                                    disabled={log.user === currentUser || log.reacted}
                                    className={log.user === currentUser || log.reacted ? "btn-disabled" : ""}
                                >
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
