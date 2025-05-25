import React from 'react';
import { ScheduleItem } from './SchedulePage';

interface ScheduleListProps {
  schedules: ScheduleItem[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules }) => {
  return (
    <div>
      <h2>일정 목록</h2>
      {schedules.length === 0 ? (
        <p>등록된 일정이 없습니다.</p>
      ) : (
        <ul>
          {schedules.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> - {item.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduleList;
