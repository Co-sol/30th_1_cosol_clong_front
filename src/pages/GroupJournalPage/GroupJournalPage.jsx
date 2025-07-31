import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import "./GroupJournalPage.css";
import axiosInstance from "../../api/axiosInstance"; 

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
  const [selectedMember, setSelectedMember] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [weekSummaries, setWeekSummaries] = useState({});

  // 그룹원 및 내 정보 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) 내 정보
        const userRes = await axiosInstance.get("/mypage/info/");
        const userData = userRes.data.data;
        setCurrentUser(userData.email);   // email로 관리
        setSelectedMember(userData.email);

        // 2) 그룹원 정보
        const memberRes = await axiosInstance.get("/groups/member-info/");
        const memberList = memberRes.data.data.map((m) => ({
          name: m.name,
          email: m.email,
          badge: `badge${(m.profile || 0) + 1}`,
          success: 0,
          fail: 0,
        }));

        // 3) 본인 먼저 배치
        const me = memberList.find((m) => m.email === userData.email);
        const others = memberList.filter((m) => m.email !== userData.email);
        setMembers(me ? [me, ...others] : memberList);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const threshold = Math.round((members.length - 1) / 2);

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

    // ➊ 실제 API 연동을 위한 상태 선언
    const [summary, setSummary] = useState(null);
    const [summaryMap, setSummaryMap] = useState({});         // POST /groups/logs?date=
    const [pendingReviews, setPendingReviews] = useState([]); // GET  /groups/logs-pending?date=
    const [memberLogs, setMemberLogs] = useState({           // POST /groups/logs-list?email=&date=
      pending: [],
      completed: [],
      failed: []
    });

    // → logs 배열 정의 추가
    const logs = [
      ...memberLogs.pending,
      ...memberLogs.completed,
      ...memberLogs.failed,
    ];

  // ➋ 날짜가 바뀔 때마다 요약+pending 불러오기
  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axiosInstance.post("/groups/logs/", {
        date: selectedDateStr
      });
      setSummaryMap(prev => ({
        ...prev,
        [selectedDateStr]: res.data.data
      }));
    };
    const fetchPending = async () => {
      const res = await axiosInstance.get("/groups/logs-pending/", {
        params: { date: selectedDateStr }
      });
      setPendingReviews(res.data.data);
    };
    fetchSummary();
    fetchPending();
  }, [selectedDateStr]);

    // (➋′) 주가 바뀔 때마다 7일치 총 완료 수 받아오기
  useEffect(() => {
    const fetchWeekSummaries = async () => {
      const results = await Promise.all(
        currentWeek.map(date => {
          const d = toDateStr(date.toISOString());
          return axiosInstance.post("/groups/logs/", { date: d })
            .then(res => ({ date: d, count: res.data.data.total_completed_count }));
        })
      );
      const map = {};
      results.forEach(({ date, count }) => { map[date] = count; });
      setWeekSummaries(map);
    };
    fetchWeekSummaries();
  }, [weekOffset]);  // 주 변경 시마다

  // ➌ 멤버 또는 날짜가 바뀔 때마다 해당 멤버 로그 상세 불러오기
  useEffect(() => {
    if (!selectedMember) return;
    const fetchMemberLogs = async () => {
      const res = await axiosInstance.post("/groups/logs-list/", {
        email: selectedMember,
        date:  selectedDateStr,
      });

      // 수정 후: email 과 상태 플래그(finish/completed/at) 추가
      const normalize = (arr, status) =>
        arr.map(item => ({
          id:            item.review_id,
          email:         item.assignee.email,      // ← 필수!
          place:         item.location.space,
          user:          item.assignee.name,
          task:          item.title,
          date:          item.complete_at,
          likeCount:     item.good_count  || 0,
          dislikeCount:  item.bad_count   || 0,

          // 상태 플래그 매핑
          finish:        status !== "failed",      // failed 배열만 finish=false
          completed:     status === "completed",   // completed 배열만 completed=true
          completedAt:   item.complete_at,         // 완료 시점
          failedAt:      item.complete_at,         // 실패 시점 (마감기한 or bad vote)
        }));

      setMemberLogs({
        pending:   normalize(res.data.data.pending,   "pending"),
        completed: normalize(res.data.data.completed, "completed"),
        failed:    normalize(res.data.data.failed,    "failed"),
      });
    };
    fetchMemberLogs();
  }, [selectedMember, selectedDateStr]);


  // ➍ 좋아요/싫어요 클릭 시 API 호출
  const handleFeedback = async (reviewId, type) => {
    const feedback = type === "like" ? "good" : "bad";
    await axiosInstance.post("/groups/logs-feedback/", {
      review_id: reviewId,
      feedback
    });
    // 변경 후 다시 조회
    // (이전 useEffect들이 selectedDateStr를 의존하고 있으니,
    //  단순히 fetchPending, fetchMemberLogs 재호출)
    const pendingRes = await axiosInstance.get("/groups/logs-pending/", {
      params: { date: selectedDateStr }
    });
    setPendingReviews(pendingRes.data.data);

    const memberRes = await axiosInstance.get("/groups/logs-list/", {
      params: { email: selectedMember, date: selectedDateStr }
    });
    setMemberLogs(memberRes.data.data);
  };

  const isToday = selectedDateStr === todayStr;
  const isPastDate = new Date(selectedDateStr) < new Date(todayStr);

  // 멤버별 카운트
  const pendingCounts = members.reduce((acc, m) => {
    acc[m.email] = logs.filter(
      (log) =>
        log.email === m.email &&
        log.finish &&
        !log.completed &&
        log.likeCount < threshold &&
        log.dislikeCount < threshold
    ).length;
    return acc;
  }, {});

  const failedCounts = members.reduce((acc, m) => {
    acc[m.email] = logs.filter(
      (log) =>
        log.email === m.email &&
        ((!log.finish && log.date === selectedDateStr) ||
         (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr))
    ).length;
    return acc;
  }, {});

  const completedCounts = members.reduce((acc, m) => {
    acc[m.email] = logs.filter(
      (log) =>
        log.email === m.email &&
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === selectedDateStr
    ).length;
    return acc;
  }, {});

  // 날짜별 완료 합계
  const aggregateCompletedByDate = (dateStr) =>
    logs.filter(
      (log) =>
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === dateStr
    ).length;

  // 로그 필터링
  const filteredLogs = logs.filter((log) => {
    if (log.email !== selectedMember) return false;
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
    return false;
  });

  const getStatusOrder = (log) => {
    const isPending = isToday && log.finish && !log.completed && log.likeCount < threshold && log.dislikeCount < threshold;
    const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
    const isFailed = (!log.finish && log.date === selectedDateStr)
      || (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr);

    if (isPending) return 0;
    if (isSuccess) return 1;
    if (isFailed) return 2;
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
                  <div className="arrow-button left" onClick={() => setWeekOffset(prev => prev - 1)} />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div className="arrow-button right" onClick={() => setWeekOffset(prev => prev + 1)} />
                </div>
                <div className="day-labels">
                  {["일","월","화","수","목","금","토"].map((d,i) => (
                    <div className="day-label" key={i}>{d}</div>
                  ))}
                </div>
                <div className="day-selector">
                  {currentWeek.map((date,i) => { 
                    const dateStr = toDateStr(date.toISOString())
                    const count   = weekSummaries[dateStr] ?? 0;
                    const isFuture = date > today;
                    return (
                      <div
                        key={i}
                        className={`day-box ${selectedDay === i && !isFuture ? "selected" : ""} ${isFuture ? "future" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{ cursor: isFuture ? "default" : "pointer", opacity: isFuture ? 0.5 : 1 }}
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
                    className={`member-card ${selectedMember === m.email ? "selected" : ""}`}
                    onClick={() => m.email && setSelectedMember(m.email)}
                    style={{ cursor: m.email ? "pointer" : "default" }}
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
                                {summaryMap[m.email]?.completed_count || 0}
                              </div>
                            </div>
                            <div className="stat-block">
                              <div className="label">
                                {isToday ? "검토 대기" : isPastDate ? "미션 실패" : "검토 대기"}
                              </div>
                              <div className="value fail">
                                {isToday
                                  ? summaryMap[m.email]?.eval_wait_count || 0
                                  : isPastDate
                                  ? summaryMap[m.email]?.failed_count     || 0
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
                                  onClick={() => handleFeedback(log.id, "like")}
                                  disabled={log.email === currentUser || log.reacted}
                                  className={log.email === currentUser || log.reacted ? "btn-disabled" : ""}
                                >
                                  👍 {log.likeCount}
                                </button>
                                <button
                                  onClick={() => handleFeedback(log.id, "dislike")}
                                  disabled={log.email === currentUser || log.reacted}
                                  className={log.email === currentUser || log.reacted ? "btn-disabled" : ""}
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
