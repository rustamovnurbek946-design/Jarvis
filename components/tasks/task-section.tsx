import { Card } from "@/components/ui/card";
import { TaskRow } from "./task-row";
import type { MockTask } from "@/lib/mock/tasks-data";

interface TaskSectionProps {
  title: string;
  count: number;
  tasks: MockTask[];
  onToggle: (id: number) => void;
  onEdit: (task: MockTask) => void;
  onDelete: (id: number) => void;
}

export function TaskSection({ title, count, tasks, onToggle, onEdit, onDelete }: TaskSectionProps) {
  return (
    <div className="mb-6">
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <span className="text-[11px] font-semibold tracking-[var(--tracking-widest)] text-[var(--color-text-muted)] uppercase">
          {title}
        </span>
        <span className="text-[11px] font-semibold text-[var(--color-text-subtle)]">{count}</span>
      </div>
      <Card padding="sm" shadow="sm">
        <div className="px-3">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </Card>
    </div>
  );
}
