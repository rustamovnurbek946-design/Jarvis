import { AlertCircle, Check, CheckCircle2, Clock, Lightbulb, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DAY_TIPS } from "@/lib/mock/ai-data";
import { INITIAL_TASKS, TODAY } from "@/lib/mock/tasks-data";

const DATE_LABEL = "Payshanba, 3-iyul, 2026";

export default function DayAnalysisPage() {
  const todayTasks = INITIAL_TASKS.filter((t) => t.date === TODAY);
  const done = todayTasks.filter((t) => t.done);
  const pending = todayTasks.filter((t) => !t.done);

  return (
    <>
      <div className="mb-7">
        <div className="mb-1.5 text-[13px] font-semibold tracking-[var(--tracking-wide)] text-[var(--color-primary)]">
          {DATE_LABEL}
        </div>
        <h1 className="mb-2 text-[26px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          Kun tahlili
        </h1>
        <div className="flex max-w-[620px] items-start gap-2 text-[14.5px] leading-[1.6] text-[var(--color-text-muted)]">
          <Sparkles size={17} color="var(--color-primary)" className="mt-0.5 shrink-0" />
          <span>
            Bugun {done.length} ta vazifani bajardingiz, {pending.length} tasi hali kutmoqda — umumiy kun
            samaradorligi o&apos;rtachadan yuqori.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        <Card padding="lg" shadow="sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--color-success-light)]">
              <Check size={14} color="var(--color-success)" strokeWidth={3} />
            </div>
            <div className="text-[15px] font-semibold text-[var(--color-text)]">Bugun bajarilgan</div>
          </div>
          <div className="flex flex-col gap-3">
            {done.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 text-sm text-[var(--color-text)]">
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span className="flex-1">{t.title}</span>
              </div>
            ))}
            {done.length === 0 && (
              <div className="text-[13.5px] text-[var(--color-text-subtle)]">Hali hech narsa bajarilmadi.</div>
            )}
          </div>
        </Card>

        <Card padding="lg" shadow="sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--color-warning-light)]">
              <Clock size={14} color="var(--color-warning)" />
            </div>
            <div className="text-[15px] font-semibold text-[var(--color-text)]">Bajarilmagan</div>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 text-sm text-[var(--color-text)]">
                <AlertCircle size={16} color="var(--color-warning)" />
                <span className="flex-1">{t.title}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{t.time}</span>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-[13.5px] text-[var(--color-text-subtle)]">
                Barcha vazifalar bajarildi 🎉
              </div>
            )}
          </div>
        </Card>

        <Card padding="lg" shadow="sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
              <Lightbulb size={14} color="var(--color-primary)" />
            </div>
            <div className="text-[15px] font-semibold text-[var(--color-text)]">Ertaga uchun tavsiya</div>
          </div>
          <div className="flex flex-col gap-3">
            {DAY_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-[var(--color-text-muted)]">
                <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[11px] font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
