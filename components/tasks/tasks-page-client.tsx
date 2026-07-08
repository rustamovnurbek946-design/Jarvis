"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskSection } from "./task-section";
import { TaskFormModal, type TaskFormValues } from "./task-form-modal";
import { INITIAL_TASKS, whenOf, type MockTask } from "@/lib/mock/tasks-data";

type ModalState = "new" | MockTask | null;

export function TasksPageClient() {
  const [tasks, setTasks] = useState<MockTask[]>(INITIAL_TASKS);
  const [modal, setModal] = useState<ModalState>(null);

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTask = (values: TaskFormValues) =>
    setTasks((prev) => [{ id: Date.now(), done: false, ...values }, ...prev]);

  const updateTask = (id: number, values: TaskFormValues) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...values } : t)));

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const byTime = (a: MockTask, b: MockTask) => (a.date + a.time).localeCompare(b.date + b.time);
  const today = tasks.filter((t) => whenOf(t.date) === "today").sort(byTime);
  const upcoming = tasks.filter((t) => whenOf(t.date) === "upcoming").sort(byTime);
  const openCount = tasks.filter((t) => !t.done).length;

  return (
    <>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[26px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            Vazifalar
          </h1>
          <div className="text-sm text-[var(--color-text-muted)]">{openCount} ta bajarilishi kerak</div>
        </div>
        <Button variant="primary" size="md" onClick={() => setModal("new")}>
          + Yangi vazifa
        </Button>
      </div>

      <div className="max-w-[720px]">
        <TaskSection title="Bugun" count={today.length} tasks={today} onToggle={toggle} onEdit={setModal} onDelete={deleteTask} />
        <TaskSection title="Kelgusi" count={upcoming.length} tasks={upcoming} onToggle={toggle} onEdit={setModal} onDelete={deleteTask} />
      </div>

      {modal && (
        <TaskFormModal
          task={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={(values) => (modal === "new" ? addTask(values) : updateTask(modal.id, values))}
        />
      )}
    </>
  );
}
