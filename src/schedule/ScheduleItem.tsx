import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ScheduleItemProps {
  id: string;
  content: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ id, content }) => {
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
    padding: 10,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
};

export default ScheduleItem;
