"use client";

import { useId, useState, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export function Textarea({
  label,
  placeholder = "",
  value,
  onChange,
  hint,
  disabled = false,
  className,
  rows = 8,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-1.5 font-[family-name:var(--font-sans)]", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[length:var(--text-sm)] font-medium leading-[var(--leading-tight)] text-[var(--color-text)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "resize-y rounded-[var(--radius-md)] border-[1.5px] px-3 py-[9px]",
          "text-[length:var(--text-base)] font-[family-name:var(--font-sans)] leading-[var(--leading-normal)]",
          "outline-none transition-[border-color,box-shadow] duration-[120ms]",
          disabled
            ? "bg-[var(--color-border-light)] text-[var(--color-text-muted)]"
            : "bg-[var(--color-surface)] text-[var(--color-text)]",
          focused
            ? "border-[var(--color-border-focus)] [box-shadow:var(--ring-focus)]"
            : "border-[var(--color-border)]",
        )}
        {...props}
      />
      {hint && (
        <span className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">{hint}</span>
      )}
    </div>
  );
}
