import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import ScheduleList from "./ScheduleList";
import ScheduleForm from "./ScheduleForm";
import ScheduleItem from "./ScheduleItem";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import Loading from "./loading";

export type ColumnId = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  content: string;
  deadline?: string;
}

type TasksByColumn = {
  [key in ColumnId]: Task[];
};

const initialTasks: TasksByColumn = {
  todo: [],
  inProgress: [],
  done: [],
};

interface SchedulePageProps {
  projectId?: string;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<TasksByColumn>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnId | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  let { id } = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchTasks = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "schedules", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTasks({
            todo: data.todo ?? [],
            inProgress: data.inProgress ?? [],
            done: data.done ?? [],
          });
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchTasks();
  }, [id]);

  useEffect(() => {
    const saveTasks = async () => {
      if (!id || !isLoaded) return;

      try {
        const docRef = doc(db, "schedules", id);
        await setDoc(
          docRef,
          {
            todo: [...tasks.todo],
            inProgress: [...tasks.inProgress],
            done: [...tasks.done],
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };

    saveTasks();
  }, [tasks, id, isLoaded]);
  // 📅 캘린더 관련 로직
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // 📆 날짜별 할 일 필터링
  const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
  const tasksByDate = (date: Date) =>
    allTasks.filter(
      (task) =>
        task.deadline &&
        format(new Date(task.deadline), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
    );

  // ✋ Drag state 초기화
  const clearDragState = (taskId?: string) => {
    if (!taskId || taskId === activeId) {
      setActiveId(null);
      setActiveColumn(null);
    }
  };

  // ➕ 작업 추가
  const handleAddTask = (
    content: string,
    column: ColumnId,
    deadline?: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      deadline,
    };
    setTasks((prev) => ({
      ...prev,
      [column]: [newTask, ...prev[column]],
    }));
  };

  // 🗑️ 작업 삭제
  const handleDeleteTask = (column: ColumnId, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId),
    }));
    clearDragState(taskId);
  };

  // ✏️ 작업 수정
  const handleEditTask = (
    column: ColumnId,
    taskId: string,
    newContent: string
  ) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task
      ),
    }));
    clearDragState(taskId);
  };

  // 🎯 드래그 시작
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);

    for (const col in tasks) {
      if (tasks[col as ColumnId].some((task) => task.id === id)) {
        setActiveColumn(col as ColumnId);
        break;
      }
    }
  };

  // 🏁 드래그 종료
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (!over || !activeId || !activeColumn) return;

    const overId = over.id as string;

    // 다른 컬럼으로 이동
    if (["todo", "inProgress", "done"].includes(overId)) {
      const destColumn = overId as ColumnId;
      if (destColumn === activeColumn) {
        clearDragState();
        return;
      }

      const sourceTasks = [...tasks[activeColumn]];
      const taskIndex = sourceTasks.findIndex((task) => task.id === activeId);
      if (taskIndex === -1) return;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: sourceTasks,
        [destColumn]: [movedTask, ...prev[destColumn]],
      }));
    } else {
      // 같은 컬럼 내 순서 변경
      const sourceTasks = [...tasks[activeColumn]];
      const oldIndex = sourceTasks.findIndex((task) => task.id === activeId);
      const newIndex = sourceTasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        clearDragState();
        return;
      }

      const newTasks = arrayMove(sourceTasks, oldIndex, newIndex);

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: newTasks,
      }));
    }

    clearDragState();
  };

  const activeTask =
    activeId && activeColumn
      ? tasks[activeColumn].find((task) => task.id === activeId)
      : null;

  return (
    <div
      style={{
        fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          gap: "40px",
          height: "calc(100vh - 80px)",
        }}
      >
        {/* 📅 왼쪽 캘린더 섹션 */}
        <div
          style={{
            flex: "0 0 400px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            height: "fit-content",
          }}
        >
          {/* 캘린더 헤더 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "32px",
              gap: "20px",
            }}
          >
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              style={{
                background: "none",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                color: "#6b7280",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ◀
            </button>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                margin: 0,
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {format(currentMonth, "yyyy년 M월")}
            </h2>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={{
                background: "none",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                color: "#6b7280",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ▶
            </button>
          </div>

          {/* 요일 헤더 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "1px",
              marginBottom: "16px",
            }}
          >
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
              (dayName) => (
                <div
                  key={dayName}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textAlign: "center",
                    padding: "8px 0",
                    color: "#9ca3af",
                    letterSpacing: "0.5px",
                  }}
                >
                  {dayName}
                </div>
              )
            )}
          </div>

          {/* 날짜 그리드 */}
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "1px",
                marginBottom: "1px",
              }}
            >
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const hasTask = tasksByDate(day).length > 0;

                return (
                  <div
                    key={dayIndex}
                    style={{
                      position: "relative",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      fontWeight: isToday ? "600" : "400",
                      cursor: "pointer",
                      color: isCurrentMonth
                        ? isToday
                          ? "#ffffff"
                          : "#374151"
                        : "#d1d5db",
                      backgroundColor: isToday ? "#60a5fa" : "transparent",
                      borderRadius: "8px",
                    }}
                  >
                    {format(day, "dd")}
                    {hasTask && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "4px",
                          height: "4px",
                          backgroundColor: isToday ? "#ffffff" : "#60a5fa",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 🧾 오른쪽 투두리스트 섹션 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "48px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 타이틀 중앙 + 날짜 오른쪽 */}
          <div
            style={{
              position: "relative",
              marginBottom: "40px",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#111827",
                margin: 0,
                textAlign: "center",
              }}
            >
              할 일 관리
            </h1>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              {format(new Date(), "dd MMM, EEEE")}
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <ScheduleForm onAddTask={handleAddTask} />
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {isLoaded === false ? (
              <Loading />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "24px",
                  flex: 1,
                }}
              >
                {(["todo", "inProgress", "done"] as const).map((columnId) => (
                  <div
                    key={columnId}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <SortableContext
                      items={tasks[columnId].map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <ScheduleList
                        columnId={columnId}
                        title={
                          columnId === "todo"
                            ? "할 일"
                            : columnId === "inProgress"
                            ? "진행 중"
                            : "완료"
                        }
                        tasks={tasks[columnId]}
                        onDeleteTask={(taskId) =>
                          handleDeleteTask(columnId, taskId)
                        }
                        onEditTask={(taskId, newContent) =>
                          handleEditTask(columnId, taskId, newContent)
                        }
                      />
                    </SortableContext>
                  </div>
                ))}
              </div>
            )}

            <DragOverlay>
              {activeTask && (
                <ScheduleItem
                  task={activeTask}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
