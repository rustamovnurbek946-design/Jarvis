"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoalCard } from "./goal-card";
import { GoalFormModal } from "./goal-form-modal";
import {
  createGoalAction,
  deleteGoalAction,
  updateGoalAction,
  type GoalFormValues,
  type GoalItem,
} from "@/lib/actions/goals";

type ModalState = "new" | GoalItem | null;

export function GoalsPageClient({ initialGoals }: { initialGoals: GoalItem[] }) {
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals);
  const [prevInitialGoals, setPrevInitialGoals] = useState<GoalItem[]>(initialGoals);
  const [modal, setModal] = useState<ModalState>(null);
  const router = useRouter();

  if (initialGoals !== prevInitialGoals) {
    setPrevInitialGoals(initialGoals);
    setGoals(initialGoals);
  }

  const activeCount = goals.filter((g) => g.status === "active").length;

  const handleSave = async (values: GoalFormValues) => {
    if (modal === "new") {
      await createGoalAction(values);
    } else if (modal) {
      await updateGoalAction(modal.id, values);
    }
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteGoalAction(id);
    router.refresh();
  };

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[26px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            Maqsadlar
          </h1>
          <div className="text-sm text-[var(--color-text-muted)]">
            {goals.length} ta maqsad · {activeCount} tasi faol
          </div>
        </div>
        <Button variant="primary" size="md" onClick={() => setModal("new")}>
          + Yangi maqsad qo&apos;shish
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-5">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} onEdit={setModal} onDelete={handleDelete} />
        ))}
      </div>

      {modal && (
        <GoalFormModal goal={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </>
  );
}
