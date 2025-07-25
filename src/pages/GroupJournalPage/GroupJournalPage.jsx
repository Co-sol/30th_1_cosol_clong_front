import React, { useState } from "react";
import Header from "../../components/Header";
import "./GroupJournalPage.css";
// 추가 필요
// import axiosInstance from "../../api/axiosInstance";

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

const toDateStr = (value) => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (!(date instanceof Date) || isNaN(date)) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function GroupJournalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMember, setSelectedMember] = useState("현영");
  const currentUser = "현영";

  const [members, setMembers] = useState([
    { name: "cosol", badge: "badge1" },
    { name: "solux", badge: "badge2" },
    { name: "sook",  badge: "badge3" },
    { name: "현영",   badge: "badge4" },
  ]);

  const threshold = Math.round((members.length - 1) / 2);

  const me = members.find((m) => m.name === currentUser);
  const others = members.filter((m) => m.name !== currentUser);
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

  // [삭제 예정] 목데이터 (백엔드 연동 시 axios GET으로 대체)
  const [logs, setLogs] = useState([
    {
      review_id: 1,
      assignee: { id: "uuid-1", email: "cosol@example.com", name: "cosol" },
      title: "저녁 설거지하기",
      complete_at: "2025-07-14T09:00:00Z",
      location: { space: "부엌", item: null },
      good_count: 0,
      bad_count: 0,
      reacted: null,
      status: 0,
    },
    {
      review_id: 2,
      assignee: { id: "uuid-1", email: "cosol@example.com", name: "cosol" },
      title: "세탁기 돌리기",
      complete_at: "2025-07-14T10:00:00Z",
      location: { space: "욕실", item: null },
      good_count: 1,
      bad_count: 0,
      reacted: null,
      status: 0,
    },
    {
      review_id: 3,
      assignee: { id: "uuid-1", email: "cosol@example.com", name: "cosol" },
      title: "바닥 청소하기",
      complete_at: "2025-07-14T11:00:00Z",
      location: { space: "거실", item: null },
      good_count: 1,
      bad_count: 0,
      reacted: null,
      status: 0,
    },
    {
      review_id: 4,
      assignee: { id: "uuid-1", email: "cosol@example.com", name: "cosol" },
      title: "창문 닦기",
      complete_at: "2025-07-14T12:00:00Z",
      location: { space: "방", item: null },
      good_count: 0,
      bad_count: 1,
      reacted: null,
      status: 0,
    },
    {
      review_id: 5,
      assignee: { id: "uuid-2", email: "solux@example.com", name: "solux" },
      title: "쓰레기 버리기",
      complete_at: "2025-07-14T09:00:00Z",
      location: { space: "현관", item: null },
      good_count: 0,
      bad_count: 1,
      reacted: null,
      status: 0,
    },
    {
      review_id: 6,
      assignee: { id: "uuid-3", email: "sook@example.com", name: "sook" },
      title: "세차하기",
      complete_at: "2025-07-14T13:00:00Z",
      location: { space: "주차장", item: null },
      good_count: 1,
      bad_count: 1,
      reacted: null,
      status: 0,
    },
    {
      review_id: 7,
      assignee: { id: "uuid-4", email: "hyun@example.com", name: "현영" },
      title: "책장 정리하기",
      complete_at: "2025-07-14T10:00:00Z",
      location: { space: "서재", item: null },
      good_count: 1,
      bad_count: 0,
      reacted: null,
      status: 1,
    },
    {
      review_id: 8,
      assignee: { id: "uuid-4", email: "hyun@example.com", name: "현영" },
      title: "욕실 청소하기",
      complete_at: "2025-07-14T11:00:00Z",
      location: { space: "화장실", item: null },
      good_count: 0,
      bad_count: 2,
      reacted: "bad",
      status: 2,
    },
  ]);

    // [추가 예정] useEffect로 데이터 fetch
  // useEffect(() => {
  //   axiosInstance.get("/groups/logs-pending/")
  //     .then(res => setLogs(res.data.data))
  //     .catch(err => console.error(err));
  // }, []);

  // [삭제 예정] 프론트에서 피드백 처리 로직
  const handleFeedback = (targetLog, type) => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.assignee.name === currentUser || log.reacted) return log;
        if (log.review_id !== targetLog.review_id) return log;

        const updated = { ...log };
        if (type === "good") {
          if (updated.reacted === "bad") updated.bad_count--;
          updated.good_count++;
          updated.reacted = "good";
        } else {
          if (updated.reacted === "good") updated.good_count--;
          updated.bad_count++;
          updated.reacted = "bad";
        }

        if (updated.good_count >= threshold && updated.status === 0) {
          updated.status = 1; // 승인
        }
        if (updated.bad_count >= threshold && updated.status === 0) {
          updated.status = 2; // 반려
        }
        return updated;
      })
    );
  };
  // [추가 예정] 백엔드 피드백 API 호출
  // const handleFeedback = (targetLog, type) => {
  //   axiosInstance.post("/groups/logs-feedback/", {
  //     review_id: targetLog.review_id,
  //     feedback: type
  //   })
  //   .then(res => {
  //     // 응답 데이터를 setLogs()로 갱신
  //     setLogs(prev =>
  //       prev.map(log =>
  //         log.review_id === targetLog.review_id
  //           ? { ...log, ...res.data.data }
  //           : log
  //       )
  //     );
  //   })
  //   .catch(err => console.error(err));
  // };

  const isToday = selectedDateStr === todayStr;
  const isPastDate = new Date(selectedDateStr) < new Date(todayStr);

  // [삭제 예정] 통계 계산 로직
  const pendingCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) => log.assignee.name === m.name && log.status === 0
    ).length;
    return acc;
  }, {});

  const failedCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) => log.assignee.name === m.name && log.status === 2
    ).length;
    return acc;
  }, {});

  const completedCounts = members.reduce((acc, m) => {
    acc[m.name] = logs.filter(
      (log) => log.assignee.name === m.name && log.status === 1
    ).length;
    return acc;
  }, {});

    // [추가 예정] completed_count, eval_wait_count, failed_count는
  // axiosInstance.post("/groups/logs/", { date: selectedDateStr })
  // 로 받아서 stats로 setStats 후 stats 값 사용
  // const [stats, setStats] = useState([]);
  // useEffect(() => {
  //   axiosInstance.post("/groups/logs/", { date: selectedDateStr })
  //     .then(res => setStats(res.data.data.logs))
  //     .catch(err => console.error(err));
  // }, [selectedDateStr]);
  
  const aggregateCompletedByDate = (dateStr) =>
    logs.filter(
      (log) => log.status === 1 && toDateStr(log.complete_at) === dateStr
    ).length;

  // 로그 필터링
  const filteredLogs = logs.filter(
    (log) => log.assignee.name === selectedMember
  );

  const getStatusOrder = (log) => {
    if (log.status === 0) return 0;
    if (log.status === 1) return 1;
    if (log.status === 2) return 2;
    return 3;
  };

  const sortedLogs = filteredLogs.slice().sort((a, b) => getStatusOrder(a) - getStatusOrder(b));

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
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                  />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div
                    className="arrow-button right"
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                  />
                </div>
                <div className="day-labels">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                    <div className="day-label" key={i}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="day-selector">
                  {currentWeek.map((date, i) => {
                    const dateStr = toDateStr(date.toISOString());
                    const count = aggregateCompletedByDate(dateStr);
                    const isFuture = date > today;
                    return (
                      <div
                        key={i}
                        className={`day-box ${
                          selectedDay === i && !isFuture ? "selected" : ""
                        } ${isFuture ? "future" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{
                          cursor: isFuture ? "default" : "pointer",
                          opacity: isFuture ? 0.5 : 1,
                        }}
                      >
                        {date.getDate()}
                        <div className="day-status">
                          {!isFuture ? `청소 완료 ${count}` : "\u00A0"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 멤버 카드 */}
              <div className="member-grid">
                {paddedMembers.map((m, idx) => (
                  <div
                    key={idx}
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
                              <div className="value success">
                                {completedCounts[m.name] || 0}
                              </div>
                            </div>
                            <div className="stat-block">
                              <div className="label">
                                {isToday
                                  ? "검토 대기"
                                  : isPastDate
                                  ? "미션 실패"
                                  : "검토 대기"}
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
                      <div className="member-placeholder" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 선택일 로그 */}
            <div className="groupjournal-right">
              <div className="groupjournal-sidecard">
                <div className="card-section-header column">
                  <h2 className="side-date">
                    {displayMonth}/{displayDay}
                  </h2>
                </div>
                <div className="log-list">
                  {sortedLogs.length === 0 ? (
                    <p className="no-logs">일지가 없습니다.</p>
                  ) : (
                    sortedLogs.map((log, i) => {
                      const logDate = new Date(log.complete_at);
                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            log.status === 1
                              ? "completed"
                              : log.status === 2
                              ? "failed"
                              : "incomplete"
                          }`}
                        >
                          <p className="log-meta">
                            {logDate.getMonth() + 1}월 {logDate.getDate()}일 /{" "}
                            {log.location.space} / {log.assignee.name}
                          </p>
                          <h4 className="log-task">{log.title}</h4>
                          <div className="log-feedback">
                            {log.status === 0 && (
                              <>
                                <button
                                  onClick={() => handleFeedback(log, "good")}
                                  disabled={
                                    log.assignee.name === currentUser ||
                                    log.reacted
                                  }
                                  className={
                                    log.assignee.name === currentUser ||
                                    log.reacted
                                      ? "btn-disabled"
                                      : ""
                                  }
                                >
                                  👍 {log.good_count}
                                </button>
                                <button
                                  onClick={() => handleFeedback(log, "bad")}
                                  disabled={
                                    log.assignee.name === currentUser ||
                                    log.reacted
                                  }
                                  className={
                                    log.assignee.name === currentUser ||
                                    log.reacted
                                      ? "btn-disabled"
                                      : ""
                                  }
                                >
                                  👎 {log.bad_count}
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
