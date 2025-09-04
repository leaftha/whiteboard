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
    <div
      style={{
        fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        maxWidth: "380px",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "0 8px",
        }}
      >
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            width: "40px",
            height: "40px",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(102, 126, 234, 0.3)";
          }}
        >
          ◀
        </button>

        <div
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1f2937",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          {format(currentMonth, "yyyy년 M월")}
        </div>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(102, 126, 234, 0.3)";
          }}
        >
          ▶
        </button>
      </div>

      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "12px",
          padding: "0 4px",
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map((dayName, index) => (
          <div
            key={dayName}
            style={{
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              padding: "8px 0",
              color:
                index === 0 ? "#ef4444" : index === 6 ? "#3b82f6" : "#6b7280",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "8px",
              border: "1px solid #f1f5f9",
            }}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            marginBottom: "4px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {week.map((day, dayIndex) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const hasTask = tasksByDate(day).length > 0;
            const isWeekend = dayIndex === 0 || dayIndex === 6;

            return (
              <div
                key={dayIndex}
                style={{
                  position: "relative",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: isToday ? "700" : "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: isToday
                    ? "#667eea"
                    : isCurrentMonth
                    ? "#ffffff"
                    : "#f8fafc",
                  color: isToday
                    ? "#ffffff"
                    : isCurrentMonth
                    ? isWeekend
                      ? dayIndex === 0
                        ? "#ef4444"
                        : "#3b82f6"
                      : "#374151"
                    : "#9ca3af",
                  border: isToday
                    ? "2px solid #667eea"
                    : hasTask && isCurrentMonth
                    ? "2px solid #10b981"
                    : "1px solid #f1f5f9",
                  boxShadow: isToday
                    ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                    : hasTask && isCurrentMonth
                    ? "0 2px 8px rgba(16, 185, 129, 0.2)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonth && !isToday) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCurrentMonth && !isToday) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = hasTask
                      ? "0 2px 8px rgba(16, 185, 129, 0.2)"
                      : "none";
                  }
                }}
              >
                <span>{format(day, "d")}</span>
                {hasTask && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "4px",
                      width: "8px",
                      height: "8px",
                      backgroundColor: isToday ? "#ffffff" : "#10b981",
                      borderRadius: "50%",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* 하단 정보 */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
              }}
            />
            <span>할 일 있음</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#667eea",
                borderRadius: "50%",
              }}
            />
            <span>오늘</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
