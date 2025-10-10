import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ScheduleItem from "./ScheduleItem";
import { ColumnId } from "./SchedulePage";
import style from "../style/ScheduleList.module.css";

interface Task {
  id: string;
  content: string;
  deadline?: string;
  priority?: "high" | "medium" | "low";
}

interface ScheduleListProps {
  columnId: ColumnId;
  title: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newContent: string) => void;
}

type ColorTheme =
  | "default"
  | "blue"
  | "purple"
  | "pink"
  | "green"
  | "orange"
  | "teal";

const ScheduleList: React.FC<ScheduleListProps> = ({
  columnId,
  title,
  tasks,
  onDeleteTask,
  onEditTask,
}) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  // 컬러 테마 초기화 및 로컬 스토리지에서 불러오기
  useEffect(() => {
    const savedColorTheme = localStorage.getItem(
      "schedule-color-theme"
    ) as ColorTheme;
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  // 컬러 테마 적용
  useEffect(() => {
    const root = document.documentElement;

    // 컬러 테마 설정
    if (colorTheme !== "default") {
      root.setAttribute("data-color-theme", colorTheme);
    } else {
      root.removeAttribute("data-color-theme");
    }

    // 로컬 스토리지에 저장
    localStorage.setItem("schedule-color-theme", colorTheme);
  }, [colorTheme]);

  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme);
  };

  const getPriorityTasks = () => {
    const high = tasks.filter((task) => task.priority === "high").length;
    const medium = tasks.filter((task) => task.priority === "medium").length;
    const low = tasks.filter((task) => task.priority === "low").length;

    return { high, medium, low };
  };

  const getThemeDisplayName = (theme: ColorTheme) => {
    const names = {
      default: "Purple",
      blue: "Blue",
      purple: "Deep Purple",
      pink: "Pink",
      green: "Green",
      orange: "Orange",
      teal: "Teal",
    };
    return names[theme];
  };

  const priorityStats = getPriorityTasks();
  const completionRate = Math.round((tasks.length / 10) * 100);

  return (
    <div
      ref={setNodeRef}
      className={`${style.scheduleColumn} ${isOver ? style.droppableOver : ""}`}
      id={columnId}
    >
      {/* 컬러 테마 선택 패널 */}
      <div className={style.themeControls}>
        <div className={style.colorThemes}>
          {(
            [
              "default",
              "blue",
              "purple",
              "pink",
              "green",
              "orange",
              "teal",
            ] as ColorTheme[]
          ).map((color) => (
            <button
              key={color}
              className={`${style.colorThemeBtn} ${
                colorTheme === color ? style.active : ""
              }`}
              onClick={() => handleColorThemeChange(color)}
              title={`Switch to ${getThemeDisplayName(color)} theme`}
              data-color={color}
              aria-label={`${getThemeDisplayName(color)} theme`}
            />
          ))}
        </div>
      </div>

      {/* 컬럼 헤더 */}
      <div className={style.columnHeader}>
        <h2>{title}</h2>
        {tasks.length > 0 && (
          <div className={style.taskStats}>
            <span className={style.totalTasks}>
              📊 {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
            {priorityStats.high > 0 && (
              <span className={`${style.priorityBadge} ${style.high}`}>
                🔥 {priorityStats.high} high
              </span>
            )}
            {priorityStats.medium > 0 && (
              <span className={`${style.priorityBadge} ${style.medium}`}>
                ⚡ {priorityStats.medium} medium
              </span>
            )}
            {priorityStats.low > 0 && (
              <span className={`${style.priorityBadge} ${style.low}`}>
                🌱 {priorityStats.low} low
              </span>
            )}
          </div>
        )}
      </div>

      {/* 스크롤 가능한 태스크 영역 */}
      <div className={style.scheduleColumnContent}>
        {tasks.length === 0 ? (
          <div className={style.emptyState}>
            <div className={style.emptyIcon}>📋</div>
            <p className={style.emptyMsg}>할 일이 없습니다</p>
            <p className={style.emptySubMsg}>
              새로운 작업을 여기로 드래그해보세요! ✨
            </p>
          </div>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <ScheduleItem
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task.id)}
                onEdit={(newContent) => onEditTask(task.id, newContent)}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {/* 컬럼 푸터 - 진행률 표시 */}
      {tasks.length > 0 && (
        <div className={style.columnFooter}>
          <div className={style.progressBar}>
            <div
              className={style.progressFill}
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
          <div className={style.progressInfo}>
            <span className={style.progressText}>
              Progress: {tasks.length}/10 tasks ({completionRate}%)
            </span>
            {completionRate >= 80 && (
              <span className={style.progressEmoji}>🎉</span>
            )}
            {completionRate >= 100 && (
              <span className={style.overflowWarning}>⚠️ Over capacity!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
