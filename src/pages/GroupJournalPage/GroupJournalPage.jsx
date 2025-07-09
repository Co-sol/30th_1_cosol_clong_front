import React, { useState } from "react";
import Header from "../../components/Header";
import "./GroupJournalPage.css";

function GroupJournalPage() {
  const [selectedDay, setSelectedDay] = useState(5);
  const [weekLabel, setWeekLabel] = useState("5월 1째주");
  const [members, setMembers] = useState([
    { name: "cosol", success: 3, fail: 2, avatar: "/assets/cosol.png" },
    { name: "solux", success: 3, fail: 2, avatar: "/assets/solux.png" },
    { name: "A", success: 3, fail: 2, avatar: "/assets/a.png" },
    { name: "sook", success: 3, fail: 2, avatar: "/assets/sook.png" },
  ]);

  return (
    <>
      <Header />
      <div className="groupjournal-scaled">
        <div className="groupjournal-wrapper">
          <div className="groupjournal-container">
            {/* 왼쪽 영역 */}
            <div className="groupjournal-left">
              <div className="calendar-section">
                <div className="week-label">
                  <h2 className="section-title">{weekLabel}</h2>
                </div>
                <div className="day-selector">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div
                      key={day}
                      className={`day-box ${selectedDay === day ? "selected" : ""}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                      <div className="day-status">청소 완료 2</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 그룹원 영역 */}
              <div className="member-grid">
                {members.map((m, idx) => (
                  <div className="member-card" key={idx}>
                    <div className="member-name">{m.name}</div>
                    <div className="member-content">
                      <img src={m.avatar} alt={m.name} className="avatar-img" />
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
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 사이드 카드 */}
            <div className="groupjournal-right">
              <div className="groupjournal-sidecard">
                <div className="card-section-header column">
                  <h2 style={{ textAlign: "center" }}>{selectedDay}/5</h2>
                  <p>→ 여기에 멤버 상세 정보 등 표시 가능</p>
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
