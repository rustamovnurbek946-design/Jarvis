type StatusKind = "success" | "pending" | "error" | "info" | "draft";

interface StatusTagProps {
  status?: StatusKind;
  label?: string;
}

const CONFIG: Record<StatusKind, { bg: string; color: string; dot: string; defaultText: string }> = {
  success: {
    bg: "var(--color-success-light)",
    color: "var(--color-success)",
    dot: "var(--color-success)",
    defaultText: "Bajarildi",
  },
  pending: {
    bg: "var(--color-warning-light)",
    color: "#92400E",
    dot: "var(--color-warning)",
    defaultText: "Kutilmoqda",
  },
  error: {
    bg: "var(--color-error-light)",
    color: "var(--color-error)",
    dot: "var(--color-error)",
    defaultText: "Xatolik",
  },
  info: {
    bg: "var(--color-info-light)",
    color: "#0369A1",
    dot: "var(--color-info)",
    defaultText: "Ma'lumot",
  },
  draft: {
    bg: "var(--color-border-light)",
    color: "var(--color-text-muted)",
    dot: "var(--color-text-subtle)",
    defaultText: "Qoralama",
  },
};

export function StatusTag({ status = "pending", label }: StatusTagProps) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-full)] px-2.5 py-[3px] font-[family-name:var(--font-sans)] text-[length:var(--text-xs)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-wide)]"
      style={{ background: c.bg, color: c.color }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ background: c.dot }} />
      {label || c.defaultText}
    </span>
  );
}
