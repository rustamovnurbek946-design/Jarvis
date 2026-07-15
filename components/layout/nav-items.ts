import { Target, CheckSquare, Sparkles, BarChart3, BookOpen } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", icon: Target, label: "Maqsadlar" },
  { href: "/tasks", icon: CheckSquare, label: "Vazifalar" },
  { href: "/ai", icon: Sparkles, label: "AI xulosasi" },
  { href: "/day", icon: BarChart3, label: "Kun tahlili" },
  { href: "/knowledge", icon: BookOpen, label: "Bilim bazasi" },
] as const;
