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
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// 실패 판단: deadline 기준 또는 싫어요 과반 (fallback 포함)
const isLogFailed = (log, selectedDateStr, threshold) => {
  const deadlineStr = log.deadline ? toDateStr(log.deadline) : toDateStr(log.date);
  const missedDeadline = !log.finish && deadlineStr === selectedDateStr;

  const disliked =
    log.dislikeCount >= threshold &&
    ((log.lastDislikeExceededAt && toDateStr(log.lastDislikeExceededAt) === selectedDateStr) ||
      toDateStr(log.failedAt) === selectedDateStr);

  return missedDeadline || disliked;
};

function GroupJournalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMember, setSelectedMember] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [weekSummaries, setWeekSummaries] = useState({});
  const [allMemberLogs, setAllMemberLogs] = useState({}); // email -> { pending, completed, failed }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/mypage/info/");
        const userData = userRes.data.data;
        setCurrentUser(userData.email);
        setSelectedMember(userData.email);

        const memberRes = await axiosInstance.get("/groups/member-info/");
        const memberList = (memberRes.data.data || []).map((m) => ({
          name: m.name,
          email: m.email,
          badge: `badge${(m.profile || 0) + 1}`,
        }));

        const me = memberList.find((m) => m.email === userData.email);
        const others = memberList.filter((m) => m.email !== userData.email);
        setMembers(me ? [me, ...others] : memberList);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  const threshold = Math.max(1, Math.round(Math.max(members.length - 1, 0) / 2)); // 본인 제외 과반, 최소 1
  const MAX_MEMBER_COUNT = 4;
  const paddedMembers = [...members, ...Array(MAX_MEMBER_COUNT - members.length).fill({})];

  const today = new Date();
  const todayStr = toDateStr(today);
  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);
  const weekLabel = `${currentWeek[0]?.getMonth() + 1}월`;
  const selectedDate = currentWeek[selectedDay] || today;
  const selectedDateStr = toDateStr(selectedDate.toISOString());
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

  const fetchSingleMemberLogs = async (email, dateStr) => {
    try {
      const res = await axiosInstance.post("/groups/logs-list/", {
        email,
        date: dateStr,
      });
      const normalize = (arr, status) =>
        (arr || []).map((item) => ({
          id: item.review_id,
          email: item.assignee?.email,
          place: item.location?.space,
          user: item.assignee?.name,
          task: item.title,
          date: item.complete_at,
          likeCount: item.good_count || 0,
          dislikeCount: item.bad_count || 0,
          deadline: item.due_date ?? item.deadline ?? item.complete_at,
          finish: status !== "failed",
          completed: status === "completed",
          completedAt: item.complete_at,
          failedAt: item.complete_at,
          reacted: false,
        }));
      return {
        pending: normalize(res.data.data?.pending, "pending"),
        completed: normalize(res.data.data?.completed, "completed"),
        failed: normalize(res.data.data?.failed, "failed"),
      };
    } catch (e) {
      console.error(`멤버 로그 불러오기 실패: ${email}`, e);
      return null;
    }
  };

  useEffect(() => {
    if (!members.length) return;
    const fetchAllMemberLogs = async () => {
      const emails = members.map((m) => m.email).filter(Boolean);
      const promises = emails.map(async (email) => {
        const data = await fetchSingleMemberLogs(email, selectedDateStr);
        if (data) return { email, data };
        return null;
      });
      const results = await Promise.all(promises);
      const map = {};
      results.forEach((r) => {
        if (r && r.email) map[r.email] = r.data;
      });
      setAllMemberLogs(map);
    };
    fetchAllMemberLogs();
  }, [selectedDateStr, members]);

  useEffect(() => {
    const fetchWeekSummaries = async () => {
      try {
        if (!members.length) return;
        const results = await Promise.all(
          currentWeek.map(async (date) => {
            const dStr = toDateStr(date.toISOString());
            const emails = members.map((m) => m.email).filter(Boolean);
            const perMemberCounts = await Promise.all(
              emails.map(async (email) => {
                const memberLogs = await fetchSingleMemberLogs(email, dStr);
                if (!memberLogs) return 0;
                return memberLogs.completed.filter(
                  (log) =>
                    log.finish &&
                    log.completed &&
                    toDateStr(log.completedAt) === dStr
                ).length;
              })
            );
            const count = perMemberCounts.reduce((sum, c) => sum + c, 0);
            return { date: dStr, count };
          })
        );
        const map = {};
        results.forEach(({ date, count }) => {
          map[date] = count;
        });
        setWeekSummaries(map);
      } catch (err) {
        console.error("주 요약(당일 완료 기준) 불러오기 실패:", err);
      }
    };
    fetchWeekSummaries();
  }, [weekOffset, members]);

  const isToday = selectedDateStr === todayStr;
  const isPastDate = new Date(selectedDateStr) < new Date(todayStr);

  const getCardCounts = (email) => {
    const member = allMemberLogs[email];
    if (!member) return { completed: 0, pending: 0, failed: 0 };

    const completed = (member.completed || []).filter(
      (log) =>
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === selectedDateStr
    ).length;

    const failed = [
      ...(member.pending || []),
      ...(member.completed || []),
      ...(member.failed || []),
    ].filter((log) => isLogFailed(log, selectedDateStr, threshold)).length;

    const pending =
      isToday
        ? (member.pending || []).filter(
            (log) =>
              log.finish &&
              !log.completed &&
              log.likeCount < threshold &&
              log.dislikeCount < threshold &&
              toDateStr(log.date) === selectedDateStr
          ).length
        : 0;

    return { completed, pending, failed };
  };

  const filteredLogs = (() => {
    if (!selectedMember) return [];
    const member = allMemberLogs[selectedMember];
    if (!member) return [];

    const logs = [...(member.pending || []), ...(member.completed || []), ...(member.failed || [])];

    return logs.filter((log) => {
      const isPending =
        isToday &&
        log.finish &&
        !log.completed &&
        log.likeCount < threshold &&
        log.dislikeCount < threshold &&
        toDateStr(log.date) === selectedDateStr;

      const isSuccess =
        log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;

      const isFailedLog = isLogFailed(log, selectedDateStr, threshold);

      return isPending || isSuccess || isFailedLog;
    });
  })();

  const getStatusOrder = (log) => {
    const isPending =
      isToday &&
      log.finish &&
      !log.completed &&
      log.likeCount < threshold &&
      log.dislikeCount < threshold &&
      toDateStr(log.date) === selectedDateStr;
    const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
    const isFailedLog = isLogFailed(log, selectedDateStr, threshold);

    if (isPending) return 0;
    if (isSuccess) return 1;
    if (isFailedLog) return 2;
    return 3;
  };

  const sortedLogs = filteredLogs.slice().sort((a, b) => getStatusOrder(a) - getStatusOrder(b));

  const handleFeedback = async (log, type) => {
    const feedback = type === "like" ? "good" : "bad";
    if (!selectedMember) return;

    setAllMemberLogs((prev) => {
      const member = prev[selectedMember];
      if (!member) return prev;
      const update = (arr) =>
        (arr || []).map((item) => {
          if (item.id === log.id) {
            const newDislikeCount = type === "dislike" ? item.dislikeCount + 1 : item.dislikeCount;
            const exceededNow =
              type === "dislike" &&
              item.dislikeCount < threshold &&
              newDislikeCount >= threshold;

            return {
              ...item,
              likeCount: type === "like" ? item.likeCount + 1 : item.likeCount,
              dislikeCount: newDislikeCount,
              reacted: true,
              lastDislikeExceededAt: exceededNow ? new Date().toISOString() : item.lastDislikeExceededAt,
            };
          }
          return item;
        });
      return {
        ...prev,
        [selectedMember]: {
          pending: update(member.pending),
          completed: update(member.completed),
          failed: update(member.failed),
        },
      };
    });

    try {
      await axiosInstance.post("/groups/logs-feedback/", {
        review_id: log.id,
        feedback,
      });
    } catch (e) {
      console.error("피드백 전송 실패:", e);
    }

    // 재동기화, 기존 lastDislikeExceededAt 유지
    const refreshed = await fetchSingleMemberLogs(selectedMember, selectedDateStr);
    if (refreshed) {
      setAllMemberLogs((prev) => {
        const prevMember = prev[selectedMember] || {};
        const mergeList = (newList = [], oldList = []) =>
          newList.map((newItem) => {
            const oldItem = (oldList || []).find((o) => o.id === newItem.id);
            if (oldItem && oldItem.lastDislikeExceededAt && !newItem.lastDislikeExceededAt) {
              return { ...newItem, lastDislikeExceededAt: oldItem.lastDislikeExceededAt };
            }
            return newItem;
          });

        return {
          ...prev,
          [selectedMember]: {
            pending: mergeList(refreshed.pending, prevMember.pending),
            completed: mergeList(refreshed.completed, prevMember.completed),
            failed: mergeList(refreshed.failed, prevMember.failed),
          },
        };
      });
    }
  };

  return (
    <>
      <Header />
      <div className="groupjournal-scaled">
        <div className="groupjournal-wrapper">
          <div className="groupjournal-container">
            {/* 좌측 */}
            <div className="groupjournal-left">
              <div className="calendar-section">
                <div className="week-label">
                  <div className="arrow-button left" onClick={() => setWeekOffset((p) => p - 1)} />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div className="arrow-button right" onClick={() => setWeekOffset((p) => p + 1)} />
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
                    const count = weekSummaries[dateStr] ?? 0;
                    const isFuture = date > today;
                    return (
                      <div
                        key={i}
                        className={`day-box ${selectedDay === i && !isFuture ? "selected" : ""} ${
                          isFuture ? "future" : ""
                        }`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{ cursor: isFuture ? "default" : "pointer", opacity: isFuture ? 0.5 : 1 }}
                      >
                        {date.getDate()}
                        <div className="day-status">{!isFuture ? `청소 완료 ${count}` : "\u00A0"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="member-grid">
                {paddedMembers.map((m, idx) => {
                  const email = m.email;
                  const { completed, pending, failed } = email
                    ? getCardCounts(email)
                    : { completed: 0, pending: 0, failed: 0 };
                  return (
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
                            <img src={`/assets/${m.badge}.png`} alt={`${m.name}의 배지`} className="avatar-img" />
                            <div className="stats-columns">
                              <div className="stat-block">
                                <div className="label">청소 완료</div>
                                <div className="value success">{completed}</div>
                              </div>
                              <div className="stat-block">
                                <div className="label">
                                  {isToday ? "검토 대기" : isPastDate ? "미션 실패" : "검토 대기"}
                                </div>
                                <div className="value fail">{isToday ? pending : isPastDate ? failed : 0}</div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="member-placeholder" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 우측 */}
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
                      const isFailed = isLogFailed(log, selectedDateStr, threshold);
                      const isPending =
                        isToday &&
                        log.finish &&
                        !log.completed &&
                        log.likeCount < threshold &&
                        log.dislikeCount < threshold &&
                        toDateStr(log.date) === selectedDateStr;
                      const isSuccess =
                        log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
                      const displayDate = log.deadline ? new Date(log.deadline) : new Date(log.date);

                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            isSuccess ? "completed" : isFailed ? "failed" : isPending ? "incomplete" : ""
                          }`}
                        >
                          <p className="log-meta">
                            {displayDate.getMonth() + 1}월 {displayDate.getDate()}일 / {log.place} / {log.user}
                          </p>
                          <h4 className="log-task">{log.task}</h4>
                          <div className="log-feedback">
                            {!isSuccess && !isFailed && (
                              <>
                                <button
                                  onClick={() => handleFeedback(log, "like")}
                                  disabled={log.email === currentUser || log.reacted}
                                  className={log.email === currentUser || log.reacted ? "btn-disabled" : ""}
                                >
                                  👍 {log.likeCount}
                                </button>
                                <button
                                  onClick={() => handleFeedback(log, "dislike")}
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
