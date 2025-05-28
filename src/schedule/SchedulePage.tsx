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

  const clearDragState = (taskId?: string) => {
    if (!taskId || taskId === activeId) {
      setActiveId(null);
      setActiveColumn(null);
    }
  };

  const handleAddTask = (
    content: string,
    column: ColumnId,
    deadline?: string
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
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
    clearDragState(taskId);
  };

  const handleEditTask = (
    column: ColumnId,
    taskId: string,
    newContent: string
  ) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task
      ),
    }));
    clearDragState(taskId);
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

    if (["todo", "inProgress", "done"].includes(overId)) {
      const destColumn = overId as ColumnId;
      if (destColumn === activeColumn) {
        clearDragState();
        return;
      }

      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: sourceTasks,
        [destColumn]: [movedTask, ...prev[destColumn]],
      }));
    } else {
      const overIndex = sourceTasks.findIndex((task) => task.id === overId);
      if (overIndex === -1 || overIndex === taskIndex) return;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      sourceTasks.splice(overIndex, 0, movedTask);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: sourceTasks,
      }));
    }

    clearDragState();
  };

  const activeTask =
    activeId && activeColumn
      ? tasks[activeColumn].find((task) => task.id === activeId)
      : null;

  return (
    <div className="schedule-container">
      <h1>📅 일정 관리 보드</h1>
      <ScheduleForm onAddTask={handleAddTask} />
      <div className="main-content">
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
                onEditTask={(taskId, newContent) =>
                  handleEditTask(columnId, taskId, newContent)
                }
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div
                key={`overlay-${activeTask.id}`}
                className="drag-overlay-item"
              >
                <ScheduleItem
                  task={activeTask}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <aside className="sidebar">
          <MiniCalendar
            tasks={[...tasks.todo, ...tasks.inProgress, ...tasks.done]}
          />
        </aside>
      </div>
    </div>
  );
};

export default SchedulePage;
