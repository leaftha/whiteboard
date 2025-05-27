import React from "react";
import { useDraggable } from "@dnd-kit/core";
import "./ScheduleItem.css";

interface Task {
  id: string;
  content: string;
  deadline?: string;
}

interface ScheduleItemProps {
  task: Task;
  onDelete: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ task, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 9999 : undefined,
    position: isDragging ? "relative" : undefined,
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 드래그 이벤트 전파 차단
    console.log("삭제 버튼 클릭, task id:", task.id);
    onDelete();
  };

  return (
    <div className="task-item" ref={setNodeRef} style={style}>
      {/* 드래그 가능한 핸들러 영역에만 listeners, attributes 적용 */}
      <div className="task-left" {...listeners} {...attributes} style={{ cursor: "grab" }}>
        <div className="task-content">{task.content}</div>
        {task.deadline && <div className="task-deadline">📅 {task.deadline}</div>}
      </div>

      {/* 삭제 버튼에는 드래그 관련 이벤트 비적용 */}
      <button
        className="task-delete-btn"
        onClick={handleDeleteClick}
        type="button"
      >
        삭제
      </button>
    </div>
  );
};

export default ScheduleItem;
