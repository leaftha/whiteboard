import React, { useState } from "react";
import { ColumnId } from "./SchedulePage";
import "./ScheduleForm.css";

interface ScheduleFormProps {
  onAddTask: (content: string, column: ColumnId, deadline?: string) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onAddTask }) => {
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [column, setColumn] = useState<ColumnId>("todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddTask(content, column, deadline);
      setContent("");
      setDeadline("");
      setColumn("todo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="할 일을 입력하세요"
        required
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <select
        value={column}
        onChange={(e) => setColumn(e.target.value as ColumnId)}
      >
        <option value="todo">예정</option>
        <option value="inProgress">진행 중</option>
        <option value="done">완료</option>
      </select>
      <button type="submit" className="add-button">
        추가
      </button>
    </form>
  );
};

export default ScheduleForm;


