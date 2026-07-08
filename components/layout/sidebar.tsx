"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flag, Target, CheckSquare, Sparkles, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Target, label: "Maqsadlar" },
  { href: "/tasks", icon: CheckSquare, label: "Vazifalar" },
  { href: "/ai", icon: Sparkles, label: "AI xulosasi" },
  { href: "/day", icon: BarChart3, label: "Kun tahlili" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Brand */}
      <div className="flex items-center gap-[11px] border-b border-[var(--color-border-light)] px-6 py-[22px]">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--color-primary)]">
          <Flag size={18} color="#fff" />
        </div>
        <span className="text-[17px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          Maqsadlarim
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-[3px] p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px]",
                "transition-[background,color] duration-[120ms]",
                isActive
                  ? "bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
                  : "font-normal text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--color-border-light)] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-[34px] items-center justify-center rounded-full bg-[var(--color-primary-muted)] text-[13px] font-semibold text-[var(--color-primary)]">
            A
          </div>
          <div>
            <div className="text-[13px] font-medium text-[var(--color-text)]">Aziz</div>
            <div className="text-[11px] text-[var(--color-text-muted)]">aziz@maqsadlarim.uz</div>
          </div>
        </div>
      </div>
    </div>
  );
}
