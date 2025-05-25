// src/schedule/ScheduleList.tsx
import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ScheduleItem from "./ScheduleItem";

interface Task {
  id: string;
  content: string;
}

interface Props {
  id: string;
  title: string;
  tasks: Task[];
}

const ScheduleList = ({ id, title, tasks }: Props) => {
  return (
    <div
      style={{
        margin: 8,
        border: "1px solid lightgrey",
        borderRadius: 4,
        width: 300,
        minHeight: 500,
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ textAlign: "center" }}>{title}</h3>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{ padding: 8, flexGrow: 1 }}>
          {tasks.map((task) => (
            <ScheduleItem key={task.id} id={task.id} content={task.content} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default ScheduleList;
