import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-dvh flex-col overflow-hidden md:flex-row">
      <Sidebar userName={session.user.name ?? "Foydalanuvchi"} userEmail={session.user.email ?? null} />
      <main className="flex-1 overflow-auto px-4 py-5 pb-24 md:px-10 md:py-9 md:pb-9">{children}</main>
      <BottomNav />
    </div>
  );
}
