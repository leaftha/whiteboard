import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";

import ScheduleList from "./ScheduleList";
import ScheduleForm from "./ScheduleForm";
import ScheduleItem from "./ScheduleItem";
import MiniCalendar from "./MiniCalendar";

import "./SchedulePage.css";

export type ColumnId = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  content: string;
  deadline?: string;
}

type TasksByColumn = {
  [key in ColumnId]: Task[];
};

const initialTasks: TasksByColumn = {
  todo: [],
  inProgress: [],
  done: [],
};

const SchedulePage: React.FC = () => {
  const [tasks, setTasks] = useState<TasksByColumn>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnId | null>(null);

  const handleAddTask = (
    content: string,
    column: ColumnId,
    deadline?: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      deadline,
    };
    setTasks((prev) => ({
      ...prev,
      [column]: [newTask, ...prev[column]],
    }));
  };

  const handleDeleteTask = (column: ColumnId, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId),
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);

    for (const col in tasks) {
      if (tasks[col as ColumnId].some((task) => task.id === id)) {
        setActiveColumn(col as ColumnId);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (!over || !activeId || !activeColumn) return;

    const sourceTasks = [...tasks[activeColumn]];
    const taskIndex = sourceTasks.findIndex((task) => task.id === activeId);
    if (taskIndex === -1) return;

    const overId = over.id as string;

    // 컬럼간 이동 (맨 앞에 삽입)
    if (["todo", "inProgress", "done"].includes(overId)) {
      const destColumn = overId as ColumnId;
      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: sourceTasks,
        [destColumn]: [movedTask, ...prev[destColumn]],
      }));
    } else {
      // 같은 컬럼 내 순서 변경
      const overIndex = sourceTasks.findIndex((task) => task.id === overId);
      if (overIndex === -1 || overIndex === taskIndex) return;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      sourceTasks.splice(overIndex, 0, movedTask);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: sourceTasks,
      }));
    }

    setActiveId(null);
    setActiveColumn(null);
  };

  const activeTask =
    activeId && activeColumn
      ? tasks[activeColumn].find((task) => task.id === activeId)
      : null;

  return (
    <div className="schedule-container">
      <h1>📅 일정 관리 보드</h1>

      {/* 일정 추가 폼 */}
      <ScheduleForm onAddTask={handleAddTask} />

      <div className="main-content">
        {/* 좌측 일정 칼럼 + 드래그앤드롭 */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="columns">
            {(["todo", "inProgress", "done"] as ColumnId[]).map((columnId) => (
              <ScheduleList
                key={columnId}
                columnId={columnId}
                title={
                  columnId === "todo"
                    ? "📝 예정"
                    : columnId === "inProgress"
                    ? "🚧 진행 중"
                    : "✅ 완료"
                }
                tasks={tasks[columnId]}
                onDeleteTask={(taskId) => handleDeleteTask(columnId, taskId)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <ScheduleItem
                task={activeTask}
                onDelete={() => handleDeleteTask(activeColumn!, activeTask.id)}
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* 우측 사이드바: 미니 달력 */}
        <aside className="sidebar">
          <MiniCalendar />
        </aside>
      </div>
    </div>
  );
};

export default SchedulePage;
