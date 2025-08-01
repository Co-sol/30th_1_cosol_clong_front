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
  const date = value instanceof Date ? value : new Date(value);
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const isLogFailed = (log, referenceDateStr) => {
  const deadlineStr = log.deadline ? toDateStr(log.deadline) : toDateStr(log.date);
  const missedDeadline = !log.finish && deadlineStr === referenceDateStr;
  const backendFailed =
    log.originalStatus === "failed" && toDateStr(log.failedAt) === referenceDateStr;
  return missedDeadline || backendFailed;
};

// storage key builder: per owner-email (whose logs), per date
const makeStorageKey = (ownerEmail, dateStr) => `voted_feedbacks_${ownerEmail}_${dateStr}`;

// load full map: { voterEmail: [id, ...], ... }
const loadVotedMap = (ownerEmail, dateStr) => {
  try {
    const raw = localStorage.getItem(makeStorageKey(ownerEmail, dateStr));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

// get set for specific voter (currentUser)
const loadVotedSet = (ownerEmail, dateStr, voterEmail) => {
  const map = loadVotedMap(ownerEmail, dateStr);
  const arr = Array.isArray(map[voterEmail]) ? map[voterEmail] : [];
  return new Set(arr);
};

// persist entire map
const persistVotedMap = (ownerEmail, dateStr, map) => {
  try {
    localStorage.setItem(makeStorageKey(ownerEmail, dateStr), JSON.stringify(map));
  } catch {}
};

// helpers for flow
const hasUserVoted = (ownerEmail, dateStr, voterEmail, reviewId) => {
  return loadVotedSet(ownerEmail, dateStr, voterEmail).has(reviewId);
};
const addUserVote = (ownerEmail, dateStr, voterEmail, reviewId) => {
  const map = loadVotedMap(ownerEmail, dateStr);
  const arr = Array.isArray(map[voterEmail]) ? map[voterEmail] : [];
  if (!arr.includes(reviewId)) {
    map[voterEmail] = [...new Set([...arr, reviewId])];
    persistVotedMap(ownerEmail, dateStr, map);
  }
};
const removeUserVote = (ownerEmail, dateStr, voterEmail, reviewId) => {
  const map = loadVotedMap(ownerEmail, dateStr);
  if (Array.isArray(map[voterEmail])) {
    map[voterEmail] = map[voterEmail].filter((id) => id !== reviewId);
    persistVotedMap(ownerEmail, dateStr, map);
  }
};

function GroupJournalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMember, setSelectedMember] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [weekSummaries, setWeekSummaries] = useState({});
  const [allMemberLogs, setAllMemberLogs] = useState({}); // email -> { pending, completed, failed, referenceDateStr }
  const [votedSet, setVotedSet] = useState(new Set()); // currentUser's voted review_ids for selectedMember+date

  const today = new Date();
  const todayStr = toDateStr(today);
  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);
  const weekLabel = `${currentWeek[0]?.getMonth() + 1}월`;
  const selectedDate = currentWeek[selectedDay] || today;
  const selectedDateStr = toDateStr(selectedDate);
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

  // load user & group members
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

  // 로그나 유저/선택된 멤버/날짜가 바뀔 때 currentUser 기준으로 reacted 동기화
  useEffect(() => {
    if (!selectedMember || !currentUser) return;
    setAllMemberLogs((prev) => {
      const member = prev[selectedMember];
      if (!member) return prev;
      const userVotedSet = loadVotedSet(selectedMember, selectedDateStr, currentUser);
      // sync votedSet state so handleFeedback & UI guard see latest
      setVotedSet(userVotedSet);
      const applyReacted = (arr = []) =>
        arr.map((item) => (userVotedSet.has(item.id) ? { ...item, reacted: true } : { ...item, reacted: false }));
      return {
        ...prev,
        [selectedMember]: {
          pending: applyReacted(member.pending),
          completed: applyReacted(member.completed),
          failed: applyReacted(member.failed),
          referenceDateStr: member.referenceDateStr,
        },
      };
    });
  }, [allMemberLogs[selectedMember], selectedMember, selectedDateStr, currentUser]);


  const MAX_MEMBER_COUNT = 4;
  const paddedMembers = [...members, ...Array(MAX_MEMBER_COUNT - members.length).fill({})];

  const fetchSingleMemberLogs = async (email, dateStr) => {
    try {
      const res = await axiosInstance.post("/groups/logs-list/", {
        email,
        date: dateStr,
      });

      const respDate = res.data.data?.date;
      const referenceDateStr = respDate ? toDateStr(respDate) : dateStr;

      const normalize = (arr = [], status) =>
        arr.map((entry) => {
          const locationItem = entry.location?.item;
          return {
            id: entry.review_id,
            email: entry.assignee?.email,
            place: entry.location?.space,
            item: locationItem,
            user: entry.assignee?.name,
            task: entry.title,
            date: entry.complete_at,
            likeCount: entry.good_count ?? 0,
            dislikeCount: entry.bad_count ?? 0,
            deadline: entry.due_date ?? entry.deadline ?? entry.complete_at,
            finish: status !== "failed",
            completed: status === "completed",
            completedAt: entry.complete_at,
            failedAt: entry.complete_at,
            reacted: false,
            originalStatus: status,
          };
        });

      return {
        pending: normalize(res.data.data?.pending || [], "pending"),
        completed: normalize(res.data.data?.completed || [], "completed"),
        failed: normalize(res.data.data?.failed || [], "failed"),
        referenceDateStr,
      };
    } catch (e) {
      console.error(`멤버 로그 불러오기 실패: ${email}`, e);
      return null;
    }
  };

  // load all member logs when selectedDateStr or members change
  useEffect(() => {
    if (!members.length) return;

    const fetchAll = async () => {
      const emails = members.map((m) => m.email).filter(Boolean);
      const results = await Promise.all(
        emails.map((email) => fetchSingleMemberLogs(email, selectedDateStr))
      );
      setAllMemberLogs((prev) => {
        const updated = { ...prev };
        emails.forEach((email, idx) => {
          const data = results[idx];
          if (!data) return;
          let { pending, completed, failed, referenceDateStr } = data;

          if (email === selectedMember && currentUser) {
            const stored = loadVotedSet(email, selectedDateStr, currentUser);
            const applyReacted = (arr = []) =>
              arr.map((item) => (stored.has(item.id) ? { ...item, reacted: true } : item));
            pending = applyReacted(pending);
            completed = applyReacted(completed);
            failed = applyReacted(failed);
            setVotedSet(stored);
          }

          updated[email] = { pending, completed, failed, referenceDateStr };
        });
        return updated;
      });
    };

    fetchAll();
  }, [selectedDateStr, members, selectedMember, currentUser]);

  // week summaries
  useEffect(() => {
    const fetchWeekSummaries = async () => {
      try {
        if (!members.length) return;
        const results = await Promise.all(
          currentWeek.map(async (date) => {
            const dStr = toDateStr(date);
            const emails = members.map((m) => m.email).filter(Boolean);
            const perMemberCounts = await Promise.all(
              emails.map(async (email) => {
                const memberLogs = await fetchSingleMemberLogs(email, dStr);
                if (!memberLogs) return 0;
                const { referenceDateStr } = memberLogs;
                return (memberLogs.completed || []).filter(
                  (log) =>
                    log.finish &&
                    log.completed &&
                    toDateStr(log.completedAt) === referenceDateStr
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
    const { referenceDateStr } = member;
    const isTodayForMember = referenceDateStr === toDateStr(new Date());
    const completed = (member.completed || []).filter(
      (log) =>
        log.finish &&
        log.completed &&
        toDateStr(log.completedAt) === referenceDateStr
    ).length;
    const failed = [
      ...(member.pending || []),
      ...(member.completed || []),
      ...(member.failed || []),
    ].filter((log) => isLogFailed(log, referenceDateStr)).length;
    const pending =
      isTodayForMember
        ? (member.pending || []).filter(
            (log) =>
              log.finish &&
              !log.completed &&
              toDateStr(log.date) === referenceDateStr
          ).length
        : 0;
    return { completed, pending, failed };
  };

  const filteredLogs = (() => {
    if (!selectedMember) return [];
    const member = allMemberLogs[selectedMember];
    if (!member) return [];
    const { referenceDateStr } = member;
    const isTodayForMember = referenceDateStr === toDateStr(new Date());
    const logs = [...(member.pending || []), ...(member.completed || []), ...(member.failed || [])];
    return logs.filter((log) => {
      const isPending =
        isTodayForMember &&
        log.finish &&
        !log.completed &&
        toDateStr(log.date) === referenceDateStr;
      const isSuccess =
        log.finish && log.completed && toDateStr(log.completedAt) === referenceDateStr;
      const isFailedLog = isLogFailed(log, referenceDateStr);
      return isPending || isSuccess || isFailedLog;
    });
  })();

  const getStatusOrder = (log, referenceDateStr) => {
    const isPending = log.finish && !log.completed && toDateStr(log.date) === referenceDateStr;
    const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === referenceDateStr;
    const isFailedLog = isLogFailed(log, referenceDateStr);
    if (isPending) return 0;
    if (isSuccess) return 1;
    if (isFailedLog) return 2;
    return 3;
  };

  const sortedLogs = (() => {
    if (!selectedMember) return [];
    const member = allMemberLogs[selectedMember];
    if (!member) return filteredLogs.slice();
    const { referenceDateStr } = member;
    return filteredLogs
      .slice()
      .sort((a, b) => getStatusOrder(a, referenceDateStr) - getStatusOrder(b, referenceDateStr));
  })();

  // 피드백 핸들러 (좋아요/싫어요)
  const handleFeedback = async (log, type) => {
    if (!selectedMember || !currentUser) return;

    // 1. 지금 로그인한 사람 기준으로 최신 리스트에서 중복 체크
    if (hasUserVoted(selectedMember, selectedDateStr, currentUser, log.id)) return;

    const feedback = type === "like" ? "good" : "bad";

    // 2. 옵티미스틱하게 reacted 표시
    setAllMemberLogs((prev) => {
      const member = prev[selectedMember];
      if (!member) return prev;
      const markReacted = (arr = []) =>
        arr.map((item) => (item.id === log.id ? { ...item, reacted: true } : item));
      return {
        ...prev,
        [selectedMember]: {
          pending: markReacted(member.pending),
          completed: markReacted(member.completed),
          failed: markReacted(member.failed),
          referenceDateStr: member.referenceDateStr,
        },
      };
    });

    // 3. 로컬 상태에 바로 추가 (optimistic)
    setVotedSet((prev) => {
      const s = new Set(prev);
      s.add(log.id);
      return s;
    });
    addUserVote(selectedMember, selectedDateStr, currentUser, log.id);

    try {
      const res = await axiosInstance.post("/groups/logs-feedback/", {
        review_id: log.id,
        feedback,
      });

      const updatedLike = res.data?.data?.good_count;
      const updatedDislike = res.data?.data?.bad_count;

      setAllMemberLogs((prev) => {
        const member = prev[selectedMember];
        if (!member) return prev;

        const updateCounts = (arr = []) =>
          arr.map((item) => {
            if (item.id === log.id) {
              // fallback: 서버가 카운트 안 줬을 때 기존값 유지
              const likeCount =
                typeof updatedLike === "number"
                  ? updatedLike
                  : item.likeCount + (type === "like" ? 1 : 0);
              const dislikeCount =
                typeof updatedDislike === "number"
                  ? updatedDislike
                  : item.dislikeCount + (type === "dislike" ? 1 : 0);
              return {
                ...item,
                likeCount,
                dislikeCount,
                reacted: true,
              };
            }
            return item;
          });

        return {
          ...prev,
          [selectedMember]: {
            pending: updateCounts(member.pending),
            completed: updateCounts(member.completed),
            failed: updateCounts(member.failed),
            referenceDateStr: member.referenceDateStr,
          },
        };
      });
    } catch (e) {
      console.error("피드백 전송 실패:", e);
      // 6. 실패 시 rollback: UI, votedSet, storage
      setAllMemberLogs((prev) => {
        const member = prev[selectedMember];
        if (!member) return prev;
        const rollback = (arr = []) =>
          arr.map((item) => (item.id === log.id ? { ...item, reacted: false } : item));
        return {
          ...prev,
          [selectedMember]: {
            pending: rollback(member.pending),
            completed: rollback(member.completed),
            failed: rollback(member.failed),
            referenceDateStr: member.referenceDateStr,
          },
        };
      });
      setVotedSet((prev) => {
        const s = new Set(prev);
        s.delete(log.id);
        return s;
      });
      removeUserVote(selectedMember, selectedDateStr, currentUser, log.id);
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
                    const dateStr = toDateStr(date);
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
                      const member = allMemberLogs[selectedMember] || {};
                      const ref = member.referenceDateStr || selectedDateStr;
                      const isFailed = isLogFailed(log, ref);
                      const isPending = log.finish && !log.completed && toDateStr(log.date) === ref;
                      const isSuccess = log.finish && log.completed && toDateStr(log.completedAt) === ref;
                      const displayDate = log.deadline ? new Date(log.deadline) : new Date(log.date);

                      return (
                        <div
                          key={i}
                          className={`log-item-box ${
                            isSuccess ? "completed" : isFailed ? "failed" : isPending ? "incomplete" : ""
                          }`}
                        >
                          <p className="log-meta">
                            {displayDate.getMonth() + 1}월 {displayDate.getDate()}일 / {log.place}
                            {log.item ? ` / ${log.item}` : ""}
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
