import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

import "./MiniCalendar.css";

interface MiniCalendarProps {
  tasks?: { id: string; content: string; deadline?: string }[];
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ tasks = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const days: JSX.Element[] = [];

  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        ◀
      </button>
      <div className="current-month">{format(currentMonth, "yyyy년 MMMM")}</div>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        ▶
      </button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const daysShort = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <div className="days-row">
        {daysShort.map((d) => (
          <div key={d} className="day-name">
            {d}
          </div>
        ))}
      </div>
    );
  };

  // 주 단위로 나눠서 렌더링
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // tasks 중 deadline이 해당 날짜인 항목 필터링
  const tasksByDate = (date: Date) =>
    tasks.filter(
      (task) =>
        task.deadline &&
        format(new Date(task.deadline), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  return (
    <div className="mini-calendar">
      {renderHeader()}
      {renderDaysOfWeek()}

      {weeks.map((week, idx) => (
        <div key={idx} className="week-row">
          {week.map((day, idxDay) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const dayTasks = tasksByDate(day);

            return (
              <div
                key={idxDay}
                className={`day-cell ${isCurrentMonth ? "" : "disabled"} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="day-number">{format(day, dateFormat)}</div>
                <ul className="day-tasks">
                  {dayTasks.map((task) => (
                    <li key={task.id} title={task.content}>
                      {task.content.length > 8
                        ? task.content.slice(0, 7) + "…"
                        : task.content}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MiniCalendar;
