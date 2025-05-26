import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ColumnId = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  content: string;
  deadline?: string;
}

interface ScheduleListProps {
  id: ColumnId; // string에서 ColumnId로 변경
  title: string;
  tasks: Task[];
  onDeleteTask: (column: ColumnId, taskId: string) => void; // string -> ColumnId 변경
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  id,
  title,
  tasks,
  onDeleteTask,
}) => {
  return (
    <div className="schedule-list">
      <h3>{title}</h3>
      {tasks.length === 0 && <p>할 일이 없습니다.</p>}
      {tasks.map((task) => (
        <SortableTaskItem
          key={task.id}
          task={task}
          columnId={id}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

interface SortableTaskItemProps {
  task: Task;
  columnId: ColumnId; // string -> ColumnId 변경
  onDelete: (column: ColumnId, taskId: string) => void; // string -> ColumnId 변경
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  columnId,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
    userSelect: "none",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: "12px 20px",
    marginBottom: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(columnId, task.id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.content}
        </div>
        {task.deadline && (
          <div style={{ fontSize: 12, color: "#888" }}>{task.deadline}</div>
        )}
      </div>
      <button
        onClick={handleDeleteClick}
        aria-label="삭제"
        className="delete-button"
      >
        삭제
      </button>
    </div>
  );
};

export default ScheduleList;
