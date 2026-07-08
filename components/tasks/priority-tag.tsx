import { PRIORITY, type Priority } from "@/lib/mock/tasks-data";

export function PriorityTag({ priority }: { priority: Priority }) {
  const p = PRIORITY[priority];
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-[3px] text-[11.5px] font-semibold whitespace-nowrap"
      style={{ background: p.bg, color: p.fg }}
    >
      {p.label}
    </span>
  );
}
