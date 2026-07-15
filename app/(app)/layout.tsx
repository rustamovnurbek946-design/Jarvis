import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar userName={session.user.name ?? "Foydalanuvchi"} userEmail={session.user.email ?? null} />
      <main className="flex-1 overflow-auto px-10 py-9">{children}</main>
    </div>
  );
}
