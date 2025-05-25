import React, { useState } from 'react';
import ScheduleList from './ScheduleList';
import ScheduleForm from './ScheduleForm';
import './SchedulePage.css';

export interface ScheduleItem {
  id: number;
  title: string;
  date: string;
}

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 1, title: '회의', date: '2025-05-20' },
    { id: 2, title: '개발 마감', date: '2025-05-22' },
  ]);

  const addSchedule = (newSchedule: Omit<ScheduleItem, 'id'>) => {
    const newId = schedules.length ? schedules[schedules.length - 1].id + 1 : 1;
    setSchedules([...schedules, { id: newId, ...newSchedule }]);
  };

  return (
    <div>
      <h1>일정 관리</h1>
      <ScheduleForm onAddSchedule={addSchedule} />
      <ScheduleList schedules={schedules} />
    </div>
  );
};

export default SchedulePage;
