import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AiStatCard } from "@/components/ai/ai-stat-card";
import { AI_STATS, WEEKLY_RANGE_LABEL, WEEKLY_SUMMARY_PARAGRAPHS } from "@/lib/mock/ai-data";

export default function AiPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="mb-1 text-[26px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          AI xulosasi
        </h1>
        <div className="text-sm text-[var(--color-text-muted)]">
          Haftalik faoliyatingiz asosida avtomatik tahlil
        </div>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
        {AI_STATS.map((s) => (
          <AiStatCard key={s.label} {...s} />
        ))}
      </div>

      <Card padding="lg" shadow="sm" className="max-w-[760px]">
        <div className="mb-[18px] flex items-center gap-2.5">
          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--color-primary)]">
            <Sparkles size={17} color="#fff" />
          </div>
          <div>
            <div className="text-[15.5px] font-semibold text-[var(--color-text)]">Haftalik xulosa</div>
            <div className="text-xs text-[var(--color-text-subtle)]">{WEEKLY_RANGE_LABEL}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 text-[14.5px] leading-[1.7] text-[var(--color-text)]">
          {WEEKLY_SUMMARY_PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Card>
    </>
  );
}
