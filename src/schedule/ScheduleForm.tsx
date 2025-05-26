import React, { useState } from 'react';

interface Props {
  onAdd: (text: string) => void;
}

const ScheduleForm: React.FC<Props> = ({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="할 일 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
};

export default ScheduleForm;
