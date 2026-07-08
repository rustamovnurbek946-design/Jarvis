import { Card } from "@/components/ui/card";
import type { AiStat } from "@/lib/mock/ai-data";

export function AiStatCard({ icon: Icon, label, value, delta }: AiStat) {
  return (
    <Card padding="md" shadow="sm">
      <div className="mb-3.5 flex items-center gap-2">
        <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
          <Icon size={16} color="var(--color-primary)" />
        </div>
        <div className="text-[12.5px] font-semibold tracking-[0.02em] text-[var(--color-text-muted)]">
          {label}
        </div>
      </div>
      <div className="mb-1.5 text-[28px] leading-none font-bold text-[var(--color-text)]">{value}</div>
      <div className="text-xs text-[var(--color-text-subtle)]">{delta}</div>
    </Card>
  );
}
