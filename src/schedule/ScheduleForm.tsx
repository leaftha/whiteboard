import React, { useState } from "react";

interface ScheduleFormProps {
  onAdd: (content: string) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onAdd }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="새 일정 입력"
      />
      <button type="submit">추가</button>
    </form>
  );
};

export default ScheduleForm;
