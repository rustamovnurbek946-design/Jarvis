import { cn } from "@/lib/utils";

type ProgressSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  value?: number;
  max?: number;
  size?: ProgressSize;
  color?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const HEIGHT_CLASSES: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  color,
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const bar = (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-border)]",
        HEIGHT_CLASSES[size],
        !label && !showLabel && className,
      )}
    >
      <div
        className="h-full rounded-[var(--radius-full)] transition-[width] duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ width: `${pct}%`, background: color || "var(--color-primary)" }}
      />
    </div>
  );

  if (!showLabel && !label) return bar;

  return (
    <div className={cn("flex flex-col gap-1.5 font-[family-name:var(--font-sans)]", className)}>
      {(label || showLabel) && (
        <div className="flex items-baseline justify-between text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
          {label && <span>{label}</span>}
          {showLabel && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      {bar}
    </div>
  );
}
