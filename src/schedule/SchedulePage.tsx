// src/schedule/SchedulePage.tsx
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import ScheduleItem from './ScheduleItem';
import ScheduleForm from './ScheduleForm';
import './SchedulePage.css';

type Task = { id: string; text: string };

const initialTasks: Record<string, Task[]> = {
  todo: [{ id: '1', text: '할 일 1' }],
  inProgress: [{ id: '2', text: '작업 중 1' }],
  done: [{ id: '3', text: '완료됨 1' }],
};

const SchedulePage: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleAddTask = (column: string, text: string) => {
    const newTask = { id: Date.now().toString(), text };
    setTasks(prev => ({
      ...prev,
      [column]: [...prev[column], newTask],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // active.id, over.id는 모두 task id
    const sourceCol = Object.keys(tasks).find(col =>
      tasks[col].some(task => task.id === active.id)
    );
    const targetCol = Object.keys(tasks).find(col =>
      tasks[col].some(task => task.id === over.id)
    );
    if (!sourceCol || !targetCol) return;

    const activeIndex = tasks[sourceCol].findIndex(task => task.id === active.id);
    const overIndex = tasks[targetCol].findIndex(task => task.id === over.id);

    const draggedTask = tasks[sourceCol][activeIndex];
    if (!draggedTask) return;

    setTasks(prev => {
      const newSource = [...prev[sourceCol]];
      const newTarget = sourceCol === targetCol ? newSource : [...prev[targetCol]];

      newSource.splice(activeIndex, 1);
      newTarget.splice(overIndex, 0, draggedTask);

      return {
        ...prev,
        [sourceCol]: newSource,
        [targetCol]: newTarget,
      };
    });
  };

  return (
    <div className="board">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map(([column, items]) => (
          <div key={column} className="column">
            <h3>
              {column === 'todo' ? '예정' : column === 'inProgress' ? '진행중' : '완료'}
            </h3>
            <ScheduleForm onAdd={(text) => handleAddTask(column, text)} />
            <SortableContext
              items={items.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="task-list">
                {items.map(task => (
                  <ScheduleItem key={task.id} id={task.id} text={task.text} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  );
};

export default SchedulePage;
