import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import style from "../style/ScheduleItem.module.css";

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

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const styleReact: React.CSSProperties = {
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
    <div ref={setNodeRef} style={styleReact} className={style.taskItem}>
      {isEditing ? (
        <div className={style.editForm}>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={style.editInput}
            autoFocus
          />
          <div className={style.taskActionsBottom}>
            <button
              className={`${style.iconSmallButton} ${style.save}`}
              onClick={handleSave}
              aria-label="저장"
              title="저장"
              type="button"
            >
              💾
            </button>
            <button
              className={`${style.iconSmallButton} ${style.cancel}`}
              onClick={() => setIsEditing(false)}
              aria-label="취소"
              title="취소"
              type="button"
            >
              ❌
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={style.taskLeft}
            {...listeners}
            {...attributes}
            style={{ cursor: "grab" }}
          >
            <div className={style.taskContent}>{task.content}</div>
            {task.deadline && (
              <div className={style.taskDeadline}>{task.deadline}</div>
            )}
          </div>

          {/* 버튼을 글씨/마감일 아래 하단으로 이동 */}
          <div className={style.taskActionsBottom}>
            <button
              className={`${style.iconButton} ${style.editButton}`}
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
              className={`${style.iconButton} ${style.deleteButton}`}
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
