
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

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: isDragging ? "none" : "transform 200ms ease",
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "default",
  };

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="task-item">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
          />
          <button
            className="icon-small-button save"
            onClick={handleSave}
            aria-label="저장"
            title="저장"
            type="button"
          >
            💾
          </button>
          <button
            className="icon-small-button cancel"
            onClick={() => setIsEditing(false)}
            aria-label="취소"
            title="취소"
            type="button"
          >
            ❌
          </button>
        </div>
      ) : (
        <>
          {/* 왼쪽: 드래그 핸들 및 내용 */}
          <div
            className="task-left"
            {...listeners}
            {...attributes}
            style={{ cursor: "grab" }}
          >
            <div className="task-content">{task.content}</div>
            {task.deadline && <div className="task-deadline">{task.deadline}</div>}
          </div>

          {/* 오른쪽: 수정 / 삭제 버튼 */}
          <div className="task-actions">
            <button
              className="icon-button edit-button"
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
              className="icon-button delete-button"
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




