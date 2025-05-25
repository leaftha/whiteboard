import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Task {
  id: string;
  content: string;
}

type ColumnId = "todo" | "inProgress" | "done";

interface TaskMap {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

const initialTasks: TaskMap = {
  todo: [
    { id: "1", content: "할 일 1" },
    { id: "2", content: "할 일 2" },
  ],
  inProgress: [{ id: "3", content: "진행 중 1" }],
  done: [{ id: "4", content: "완료 1" }],
};

interface ScheduleItemProps {
  id: string;
  content: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ id, content }) => {
  return (
    <div
      style={{
        padding: 10,
        marginBottom: 8,
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: "grab",
      }}
      data-id={id}
    >
      {content}
    </div>
  );
};

const SchedulePage = () => {
  const [tasks, setTasks] = useState<TaskMap>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveId(null);
      return;
    }

    let activeColumn: ColumnId | null = null;
    let overColumn: ColumnId | null = null;
    let activeIndex = -1;
    let overIndex = -1;

    for (const columnId of Object.keys(tasks) as ColumnId[]) {
      const taskList = tasks[columnId];
      const indexActive = taskList.findIndex((t) => t.id === active.id);
      if (indexActive !== -1) {
        activeColumn = columnId;
        activeIndex = indexActive;
      }
      const indexOver = taskList.findIndex((t) => t.id === over.id);
      if (indexOver !== -1) {
        overColumn = columnId;
        overIndex = indexOver;
      }
    }

    if (
      activeColumn === null ||
      overColumn === null ||
      activeIndex === -1 ||
      overIndex === -1
    ) {
      setActiveId(null);
      return;
    }

    setTasks((prev) => {
      const newState = { ...prev };

      const ac = activeColumn as ColumnId;
      const oc = overColumn as ColumnId;

      if (ac === oc) {
        newState[ac] = arrayMove(newState[ac], activeIndex, overIndex);
      } else {
        const [movedTask] = newState[ac].splice(activeIndex, 1);
        newState[oc] = [
          ...newState[oc].slice(0, overIndex),
          movedTask,
          ...newState[oc].slice(overIndex),
        ];
      }

      return newState;
    });

    setActiveId(null);
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {(["todo", "inProgress", "done"] as ColumnId[]).map((columnId) => (
          <div
            key={columnId}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 8,
              width: 250,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ textTransform: "capitalize", marginBottom: 10 }}>
              {columnId === "todo"
                ? "예정"
                : columnId === "inProgress"
                ? "진행중"
                : "완료"}
            </h3>

            <SortableContext
              items={tasks[columnId].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks[columnId].map((task) => (
                <ScheduleItem key={task.id} id={task.id} content={task.content} />
              ))}
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  );
};

export default SchedulePage;
