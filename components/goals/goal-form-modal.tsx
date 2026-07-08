"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GoalFormValues, GoalItem } from "@/lib/actions/goals";

interface GoalFormModalProps {
  goal: GoalItem | null; // null = creating a new goal
  onClose: () => void;
  onSave: (values: GoalFormValues) => void;
}

export function GoalFormModal({ goal, onClose, onSave }: GoalFormModalProps) {
  const editing = !!goal;
  const [title, setTitle] = useState(goal?.title ?? "");
  const [desc, setDesc] = useState(goal?.desc ?? "");
  const [due, setDue] = useState(goal?.due ?? "");
  const [progress, setProgress] = useState(goal ? String(goal.progress) : "0");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (!title.trim()) {
      setErr(true);
      return;
    }
    const p = Math.max(0, Math.min(100, parseInt(progress, 10) || 0));
    onSave({
      title: title.trim(),
      desc: desc.trim() || "Tavsif kiritilmagan.",
      due: due.trim() || "Belgilanmagan",
      progress: p,
      status: p >= 100 ? "done" : "active",
    });
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
                {editing ? "Maqsadni tahrirlash" : "Yangi maqsad"}
              </div>
              <div className="text-[13px] text-[var(--color-text-muted)]">
                Maqsad ma&apos;lumotlarini kiriting
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
              label="Maqsad nomi"
              placeholder="Masalan: Ingliz tilini o'rganish"
              value={title}
              onChange={(v) => {
                setTitle(v);
                if (err) setErr(false);
              }}
              error={err ? "Maqsad nomini kiriting" : undefined}
            />
            <Input label="Qisqa tavsif" placeholder="Maqsad haqida bir-ikki jumla" value={desc} onChange={setDesc} />
            <div className="flex gap-3">
              <div className="flex-1">
                <Input label="Muddat" placeholder="31-avgust, 2026" value={due} onChange={setDue} />
              </div>
              <div className="w-[120px]">
                <Input label="Progress (%)" placeholder="0" value={progress} onChange={setProgress} suffix="%" />
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
