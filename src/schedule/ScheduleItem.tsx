import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: string;
  text: string;
}

const ScheduleItem: React.FC<Props> = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div className="task-card" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {text}
    </div>
  );
};

export default ScheduleItem;
