"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { GoalItem } from "@/lib/actions/goals";

interface GoalCardProps {
  goal: GoalItem;
  onEdit: (goal: GoalItem) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const done = goal.status === "done";
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <Card padding="lg" shadow="sm">
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div className="flex-1 text-base leading-[1.35] font-semibold text-[var(--color-text)]">
          {goal.title}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {done ? (
            <StatusTag status="success" label="Bajarilgan" />
          ) : (
            <StatusTag status="info" label="Faol" />
          )}
          <div ref={ref} className="relative">
            <button
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Ko'proq"
              className="flex rounded-md p-[5px] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 z-20 mt-1 w-40 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-lg)]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(goal);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13.5px] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                >
                  <Pencil size={15} />
                  Tahrirlash
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(goal.id);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13.5px] text-[var(--color-error)] hover:bg-[var(--color-bg)]"
                >
                  <Trash2 size={15} />
                  O&apos;chirish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-[18px] text-[13.5px] leading-normal text-[var(--color-text-muted)]">
        {goal.desc}
      </div>

      <div className="mb-[18px] flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
        <Calendar size={15} />
        <span>
          Muddat: <span className="font-medium text-[var(--color-text)]">{goal.due}</span>
        </span>
      </div>

      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[var(--tracking-wide)] text-[var(--color-text-muted)] uppercase">
          Progress
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: done ? "var(--color-success)" : "var(--color-primary)" }}
        >
          {goal.progress}%
        </span>
      </div>
      <ProgressBar value={goal.progress} color={done ? "var(--color-success)" : "var(--color-primary)"} />
    </Card>
  );
}
