import React, { useState, useEffect } from "react";
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
  onEdit: (newContent: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  task,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  useEffect(() => {
    setEditContent(task.content);
  }, [task.content]);

  // 드래그 가능 영역을 따로 뽑기 위해 useDraggable에 id만 넘기고
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: isDragging ? "none" : "transform 200ms ease",
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "default", // 기본 커서는 드래그 핸들에만 grab 씀
  };

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef} // 전체 블럭에 ref는 붙임 (드래그 라이브러리용)
      style={style}
      className="schedule-item"
    >
      {isEditing ? (
        <div className="edit-form" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave}>저장</button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
          >
            취소
          </button>
        </div>
      ) : (
        <>
          {/* 드래그 가능 영역: 여기만 listeners, attributes 붙임 */}
          <div
            className="task-content"
            {...listeners}
            {...attributes}
            style={{ userSelect: "none", cursor: "grab" }}
          >
            <p>{task.content}</p>
            {task.deadline && <span className="deadline">{task.deadline}</span>}
          </div>

          {/* 클릭만 가능한 수정/삭제 버튼 */}
          <div className="task-actions" style={{ pointerEvents: "auto" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              aria-label="Edit task"
              title="수정"
              type="button"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete task"
              title="삭제"
              type="button"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleItem;
