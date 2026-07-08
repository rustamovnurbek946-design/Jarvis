"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "prefix"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export function Input({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  hint,
  error,
  disabled = false,
  prefix,
  suffix,
  className,
  ...props
}: InputProps) {
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
      <div
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] px-3 py-[9px]",
          "transition-[border-color,box-shadow] duration-[120ms]",
          disabled ? "bg-[var(--color-border-light)]" : "bg-[var(--color-surface)]",
          error
            ? "border-[var(--color-error)]"
            : focused
              ? "border-[var(--color-border-focus)] [box-shadow:var(--ring-focus)]"
              : "border-[var(--color-border)]",
        )}
      >
        {prefix && (
          <span className="shrink-0 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "flex-1 border-none bg-transparent outline-none",
            "text-[length:var(--text-base)] font-[family-name:var(--font-sans)]",
            disabled ? "text-[var(--color-text-muted)] cursor-not-allowed" : "text-[var(--color-text)]",
          )}
          {...props}
        />
        {suffix && (
          <span className="shrink-0 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
            {suffix}
          </span>
        )}
      </div>
      {(hint || error) && (
        <span
          className={cn(
            "text-[length:var(--text-xs)] leading-[var(--leading-normal)]",
            error ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]",
          )}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
