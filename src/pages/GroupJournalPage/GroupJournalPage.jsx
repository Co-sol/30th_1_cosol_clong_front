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
  const MAX_MEMBER_COUNT = 4;

  const initialMembers = [
    { name: "cosol", badge: "badge1", success: 3, fail: 2 },
    { name: "solux", badge: "badge2", success: 4, fail: 1 },
    { name: "sook", badge: "badge3", success: 5, fail: 0 },
  ];

  // 빈 멤버 카드로 채우기
  const paddedMembers = [
    ...initialMembers,
    ...Array(MAX_MEMBER_COUNT - initialMembers.length).fill({}),
  ];

  const today = new Date();
  const currentBaseDate = new Date(today);
  currentBaseDate.setDate(today.getDate() + weekOffset * 7);
  const currentWeek = getWeekDates(currentBaseDate);

  const weekLabel = `${currentWeek[0].getMonth() + 1}월 ${Math.ceil(currentWeek[0].getDate() / 7)}째주`;
  const selectedDate = currentWeek[selectedDay];
  const displayDay = selectedDate.getDate();
  const displayMonth = selectedDate.getMonth() + 1;

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

              <div className="member-grid">
                {paddedMembers.map((m, idx) => (
                  <div className="member-card" key={idx}>
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
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default GroupJournalPage;
