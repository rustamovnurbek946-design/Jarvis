"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around",
        "border-t border-[var(--color-border)] bg-[var(--color-surface)]",
        "pb-[env(safe-area-inset-bottom)] md:hidden",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px]",
              isActive
                ? "font-semibold text-[var(--color-primary)]"
                : "font-normal text-[var(--color-text-muted)]",
            )}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
