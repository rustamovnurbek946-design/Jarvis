import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)] " +
    "hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)]",
  secondary:
    "bg-transparent text-[var(--color-primary)] border-[var(--color-primary)] " +
    "hover:bg-[var(--color-primary-light)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] border-transparent " +
    "hover:bg-[var(--color-border-light)] hover:text-[var(--color-text)]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-[length:var(--text-sm)] py-1.5 px-3",
  md: "text-[length:var(--text-base)] py-[9px] px-4",
  lg: "text-[length:var(--text-md)] py-3 px-5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
        "font-[family-name:var(--font-sans)] font-medium leading-[var(--leading-tight)]",
        "rounded-[var(--radius-md)] border-[1.5px] outline-none",
        "transition-[background,box-shadow,border-color,color] duration-[120ms]",
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:[box-shadow:var(--ring-focus)]",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
