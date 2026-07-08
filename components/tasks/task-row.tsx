"use client";

import { useState } from "react";
import { Check, Clock, Pencil, Target, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDue, type MockTask } from "@/lib/mock/tasks-data";
import { PriorityTag } from "./priority-tag";

interface TaskRowProps {
  task: MockTask;
  onToggle: (id: number) => void;
  onEdit: (task: MockTask) => void;
  onDelete: (id: number) => void;
}

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "-mx-2.5 flex items-center gap-3.5 rounded-lg border-b border-[var(--color-border-light)] px-2.5 py-3.5",
        "transition-colors duration-[120ms]",
        hover && "bg-[var(--color-bg)]",
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label="Bajarildi"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md p-0 transition-[background,border-color] duration-[120ms]",
          task.done
            ? "border-none bg-[var(--color-primary)]"
            : "border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)]",
        )}
      >
        {task.done && <Check size={13} color="#fff" strokeWidth={3} />}
      </button>

      <div onClick={() => onEdit(task)} className="min-w-0 flex-1 cursor-pointer">
        <div
          className={cn(
            "mb-[5px] text-[14.5px] font-medium",
            task.done
              ? "text-[var(--color-text-subtle)] line-through"
              : "text-[var(--color-text)]",
          )}
        >
          {task.title}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-[5px] rounded-[var(--radius-full)] bg-[var(--color-primary-light)] px-2.5 py-[2px] text-[11.5px] font-medium text-[var(--color-primary)]">
            <Target size={12} />
            {task.goal}
          </span>
          <span className="inline-flex items-center gap-[5px] text-xs text-[var(--color-text-muted)]">
            <Clock size={13} />
            {formatDue(task.date, task.time)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onEdit(task)}
        aria-label="Tahrirlash"
        className={cn(
          "flex rounded-md p-1.5 text-[var(--color-text-subtle)] transition-opacity duration-[120ms]",
          hover ? "opacity-100" : "opacity-0",
        )}
      >
        <Pencil size={15} />
      </button>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="O'chirish"
        className={cn(
          "flex rounded-md p-1.5 text-[var(--color-error)] transition-opacity duration-[120ms]",
          hover ? "opacity-100" : "opacity-0",
        )}
      >
        <Trash2 size={15} />
      </button>

      <PriorityTag priority={task.priority} />
    </div>
  );
}
