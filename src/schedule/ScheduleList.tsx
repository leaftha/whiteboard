

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import ScheduleItem from "./ScheduleItem";
import { ColumnId } from "./SchedulePage";
import "./ScheduleList.css";
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
}
const ScheduleList: React.FC<ScheduleListProps> = ({
  columnId,
  title,
  tasks,
  onDeleteTask,
}) => {
  console.log(`ScheduleList: ${columnId} 렌더링, 할 일 개수:`, tasks.length);

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`schedule-column ${isOver ? "droppable-over" : ""}`}
      id={columnId}
    >
      <h2>{title}</h2>
      {tasks.length === 0 ? (
        <p className="empty-msg">할 일이 없습니다.</p>
      ) : (
        tasks.map((task) => (
          <ScheduleItem
            key={task.id}
            task={task}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))
      )}
    </div>
  );
};

export default ScheduleList;

