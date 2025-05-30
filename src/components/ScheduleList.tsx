import React from "react";
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
}

interface ScheduleListProps {
  columnId: ColumnId;
  title: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newContent: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  columnId,
  title,
  tasks,
  onDeleteTask,
  onEditTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${style.scheduleColumn} ${isOver ? style.droppableOver : ""}`}
      id={columnId}
    >
      <h2>{title}</h2>
      {tasks.length === 0 ? (
        <p className="empty-msg">할 일이 없습니다.</p>
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
  );
};

export default ScheduleList;
