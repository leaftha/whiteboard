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
    if (!content.trim()) return;
    onAddTask(content, column, deadline ? deadline : undefined);
    setContent("");
    setDeadline("");
  };

  return (
    <div className="schedule-form-container">
      <form className="schedule-form" onSubmit={handleSubmit}>
        <input
          id="content"
          type="text"
          className="form-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="할 일을 입력하세요"
          required
        />
        <input
          id="deadline"
          type="date"
          className="form-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <select
          id="column"
          className="form-input"
          value={column}
          onChange={(e) => setColumn(e.target.value as ColumnId)}
        >
          <option value="todo">📝 예정</option>
          <option value="inProgress">🚧 진행 중</option>
          <option value="done">✅ 완료</option>
        </select>
        <button className="form-submit-btn" type="submit">
          추가
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;
