"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PRIORITY, TODAY, type MockTask, type Priority } from "@/lib/mock/tasks-data";

export interface TaskFormValues {
  title: string;
  goal: string;
  date: string;
  time: string;
  priority: Priority;
}

function PrioritySegmentButton({
  value,
  active,
  onSelect,
}: {
  value: Priority;
  active: boolean;
  onSelect: (value: Priority) => void;
}) {
  const p = PRIORITY[value];
  return (
    <button
      onClick={() => onSelect(value)}
      className={cn(
        "flex flex-1 items-center justify-center gap-[7px] rounded-[var(--radius-md)] border-[1.5px] py-[9px]",
        "font-[family-name:var(--font-sans)] text-[13px] transition-all duration-[120ms]",
        active ? "font-semibold" : "border-[var(--color-border)] font-medium text-[var(--color-text-muted)]",
      )}
      style={active ? { borderColor: p.fg, background: p.bg, color: p.fg } : undefined}
    >
      <span className="inline-block size-2 shrink-0 rounded-full" style={{ background: p.fg }} />
      {p.label}
    </button>
  );
}

interface TaskFormModalProps {
  task: MockTask | null; // null = creating a new task
  onClose: () => void;
  onSave: (values: TaskFormValues) => void;
}

const dateTimeInputClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] " +
  "px-3 py-[9px] font-[family-name:var(--font-sans)] text-sm text-[var(--color-text)]";

export function TaskFormModal({ task, onClose, onSave }: TaskFormModalProps) {
  const editing = !!task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [goal, setGoal] = useState(task?.goal ?? "");
  const [date, setDate] = useState(task?.date ?? TODAY);
  const [time, setTime] = useState(task?.time ?? "09:00");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "mid");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (!title.trim()) {
      setErr(true);
      return;
    }
    onSave({ title: title.trim(), goal: goal.trim() || "Umumiy", date, time, priority });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.4)]"
      onClick={onClose}
    >
      <div className="w-[480px] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
        <Card padding="lg" shadow="lg">
          <div className="mb-[22px] flex items-start justify-between">
            <div>
              <div className="mb-1 text-[19px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {editing ? "Vazifani tahrirlash" : "Yangi vazifa"}
              </div>
              <div className="text-[13px] text-[var(--color-text-muted)]">
                Vazifa ma&apos;lumotlarini kiriting
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Yopish"
              className="flex rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-4">
            <Input
              label="Vazifa nomi"
              placeholder="Masalan: 20 ta so'z yodlash"
              value={title}
              onChange={(v) => {
                setTitle(v);
                if (err) setErr(false);
              }}
              error={err ? "Vazifa nomini kiriting" : undefined}
            />
            <Input label="Bog'langan maqsad" placeholder="Masalan: Ingliz tili B2" value={goal} onChange={setGoal} />

            <div className="flex gap-3">
              <div className="flex-1">
                <div className="mb-2 text-[11px] font-semibold tracking-[var(--tracking-wide)] text-[var(--color-text-muted)] uppercase">
                  Sana
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={dateTimeInputClass}
                />
              </div>
              <div className="w-[150px]">
                <div className="mb-2 text-[11px] font-semibold tracking-[var(--tracking-wide)] text-[var(--color-text-muted)] uppercase">
                  Soat
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={dateTimeInputClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold tracking-[var(--tracking-wide)] text-[var(--color-text-muted)] uppercase">
                Muhimlik
              </div>
              <div className="flex gap-2">
                <PrioritySegmentButton value="high" active={priority === "high"} onSelect={setPriority} />
                <PrioritySegmentButton value="mid" active={priority === "mid"} onSelect={setPriority} />
                <PrioritySegmentButton value="low" active={priority === "low"} onSelect={setPriority} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button variant="primary" onClick={submit}>
              Saqlash
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
