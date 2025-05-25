import React, { useState } from 'react';
import { ScheduleItem } from './SchedulePage';

interface ScheduleFormProps {
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onAddSchedule }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) {
      alert('일정 제목과 날짜를 입력해주세요.');
      return;
    }
    onAddSchedule({ title, date });
    setTitle('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="일정 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
};

export default ScheduleForm;
