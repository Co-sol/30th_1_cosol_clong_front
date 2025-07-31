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

  // 모든 멤버별 로그 캐시 (email -> { pending, completed, failed })
  const [allMemberLogs, setAllMemberLogs] = useState({});

  // 기본 정보 로드: 내 정보 + 그룹원
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/mypage/info/");
        const userData = userRes.data.data;
        setCurrentUser(userData.email);
        setSelectedMember(userData.email);

        const memberRes = await axiosInstance.get("/groups/member-info/");
        const memberList = memberRes.data.data.map((m) => ({
          name: m.name,
          email: m.email,
          badge: `badge${(m.profile || 0) + 1}`,
        }));

        // 본인 먼저
        const me = memberList.find((m) => m.email === userData.email);
        const others = memberList.filter((m) => m.email !== userData.email);
        setMembers(me ? [me, ...others] : memberList);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  const threshold = Math.round(Math.max(members.length - 1, 0) / 2); // 본인 제외 과반

  const MAX_MEMBER_COUNT = 4;
  const paddedMembers = [...members, ...Array(MAX_MEMBER_COUNT - members.length).fill({})];

  const today = new Date();
  const todayStr = toDateStr(today);
  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);

  const weekLabel = `${currentWeek[0].getMonth() + 1}월`;
  const selectedDate = currentWeek[selectedDay];
  const selectedDateStr = toDateStr(selectedDate.toISOString());
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

  // helper: 단일 멤버 logs-list 재조회 (정합성 확보용)
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
        pending: normalize(res.data.data.pending, "pending"),
        completed: normalize(res.data.data.completed, "completed"),
        failed: normalize(res.data.data.failed, "failed"),
      };
    } catch (e) {
      console.error(`멤버 로그 불러오기 실패: ${email}`, e);
      return null;
    }
  };

  // 선택한 날짜/멤버 변경 시 모든 멤버 logs-list 캐시 업데이트
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

  // 주 단위 총 완료 수 (캘린더 아래 숫자)
  useEffect(() => {
    const fetchWeekSummaries = async () => {
      try {
        const results = await Promise.all(
          currentWeek.map((date) => {
            const d = toDateStr(date.toISOString());
            return axiosInstance
              .post("/groups/logs/", { date: d })
              .then((res) => ({ date: d, count: res.data.data.total_completed_count }));
          })
        );
        const map = {};
        results.forEach(({ date, count }) => {
          map[date] = count;
        });
        setWeekSummaries(map);
      } catch (err) {
        console.error("주 요약 불러오기 실패:", err);
      }
    };
    fetchWeekSummaries();
  }, [weekOffset]);

  const isToday = selectedDateStr === todayStr;
  const isPastDate = new Date(selectedDateStr) < new Date(todayStr);

  // 카드용 숫자 계산
  const getCardCounts = (email) => {
    const member = allMemberLogs[email];
    if (!member) return { completed: 0, pending: 0, failed: 0 };

    const completed = member.completed.filter(
      (log) => log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr
    ).length;

    const failed = member.failed.filter((log) => {
      const isMissed = !log.finish && toDateStr(log.date) === selectedDateStr;
      const isDisliked =
        log.finish &&
        log.dislikeCount >= threshold &&
        toDateStr(log.failedAt) === selectedDateStr;
      return isMissed || isDisliked;
    }).length;

    const pending =
      isToday
        ? member.pending.filter(
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

  // 오른쪽 리스트 (선택 멤버 기준, 상태 필터링)
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

      const isFailed =
        (!log.finish && toDateStr(log.date) === selectedDateStr) ||
        (log.finish &&
          log.dislikeCount >= threshold &&
          toDateStr(log.failedAt) === selectedDateStr);

      return isPending || isSuccess || isFailed;
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
    const isSuccess =
      log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
    const isFailed =
      (!log.finish && toDateStr(log.date) === selectedDateStr) ||
      (log.finish &&
        log.dislikeCount >= threshold &&
        toDateStr(log.failedAt) === selectedDateStr);

    if (isPending) return 0;
    if (isSuccess) return 1;
    if (isFailed) return 2;
    return 3;
  };

  const sortedLogs = filteredLogs.slice().sort((a, b) => getStatusOrder(a) - getStatusOrder(b));

  // 좋아요/싫어요 클릭: 옵티미스틱 + 재동기화
  const handleFeedback = async (log, type) => {
    const feedback = type === "like" ? "good" : "bad";
    if (!selectedMember) return;

    // 옵티미스틱 업데이트
    setAllMemberLogs((prev) => {
      const member = prev[selectedMember];
      if (!member) return prev;
      const update = (arr) =>
        (arr || []).map((item) => {
          if (item.id === log.id) {
            return {
              ...item,
              likeCount: type === "like" ? item.likeCount + 1 : item.likeCount,
              dislikeCount: type === "dislike" ? item.dislikeCount + 1 : item.dislikeCount,
              reacted: true,
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

    // 서버 요청
    try {
      await axiosInstance.post("/groups/logs-feedback/", {
        review_id: log.id,
        feedback,
      });
    } catch (e) {
      console.error("피드백 전송 실패:", e);
    }

    // 정확한 상태로 재동기화
    const refreshed = await fetchSingleMemberLogs(selectedMember, selectedDateStr);
    if (refreshed) {
      setAllMemberLogs((prev) => ({
        ...prev,
        [selectedMember]: refreshed,
      }));
    }
  };

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
                  <div className="arrow-button left" onClick={() => setWeekOffset((prev) => prev - 1)} />
                  <h2 className="section-title">{weekLabel}</h2>
                  <div className="arrow-button right" onClick={() => setWeekOffset((prev) => prev + 1)} />
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
                        className={`day-box ${selectedDay === i && !isFuture ? "selected" : ""} ${isFuture ? "future" : ""}`}
                        onClick={() => !isFuture && setSelectedDay(i)}
                        style={{ cursor: isFuture ? "default" : "pointer", opacity: isFuture ? 0.5 : 1 }}
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
                                <div className="value fail">
                                  {isToday ? pending : isPastDate ? failed : 0}
                                </div>
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
                      const isFailed =
                        (!log.finish && toDateStr(log.date) === selectedDateStr) ||
                        (log.finish && log.dislikeCount >= threshold && toDateStr(log.failedAt) === selectedDateStr);
                      const isPending =
                        isToday &&
                        log.finish &&
                        !log.completed &&
                        log.likeCount < threshold &&
                        log.dislikeCount < threshold &&
                        toDateStr(log.date) === selectedDateStr;
                      const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === selectedDateStr;
                      const displayDate = new Date(log.deadline ?? log.date);
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
