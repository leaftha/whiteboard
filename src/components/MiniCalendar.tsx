import React, { useState } from "react";
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
import style from "../style/MiniCalendar.module.css";
interface MiniCalendarProps {
  tasks?: { id: string; content: string; deadline?: string }[];
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ tasks = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const tasksByDate = (date: Date) =>
    tasks.filter(
      (task) =>
        task.deadline &&
        format(new Date(task.deadline), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
    );

  return (
    <div className={style.miniCalendar}>
      <div className={style.calendarHeader}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          ◀
        </button>
        <div className={style.currentMonth}>
          {format(currentMonth, "yyyy년 M월")}
        </div>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          ▶
        </button>
      </div>

      <div className={style.daysRow}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className={style.dayName}>
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, i) => (
        <div key={i} className={style.weekRow}>
          {week.map((day, j) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const hasTask = tasksByDate(day).length > 0;

            return (
              <div
                key={j}
                className={[
                  style.dayCell,
                  isCurrentMonth ? style.current : style.disabled,
                  isToday ? style.today : "",
                ].join(" ")}
              >
                <div className={style.dayNumber}>{format(day, "d")}</div>
                {hasTask && <div className={style.taskIndicator} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MiniCalendar;
