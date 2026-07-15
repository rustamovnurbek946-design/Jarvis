import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginClient } from "@/components/auth/login-client";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return <LoginClient />;
}
