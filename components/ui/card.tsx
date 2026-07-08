import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardPadding = "sm" | "md" | "lg";
type CardShadow = "none" | "sm" | "md" | "lg";
type CardRadius = "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  shadow?: CardShadow;
  radius?: CardRadius;
  border?: boolean;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const SHADOW_CLASSES: Record<CardShadow, string> = {
  none: "shadow-none",
  sm: "shadow-[var(--shadow-sm)]",
  md: "shadow-[var(--shadow-md)]",
  lg: "shadow-[var(--shadow-lg)]",
};

const RADIUS_CLASSES: Record<CardRadius, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
};

export function Card({
  padding = "md",
  shadow = "sm",
  radius = "lg",
  border = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] font-[family-name:var(--font-sans)]",
        PADDING_CLASSES[padding],
        SHADOW_CLASSES[shadow],
        RADIUS_CLASSES[radius],
        border && "border border-[var(--color-border)]",
        className,
      )}
      {...props}
    />
  );
}
