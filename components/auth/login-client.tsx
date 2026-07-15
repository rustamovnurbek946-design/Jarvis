"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startTelegramLogin, checkTelegramLoginStatus } from "@/lib/actions/telegram-auth";

type Phase = "idle" | "waiting" | "expired" | "error";

const POLL_MS = 1500;

export function LoginClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const tokenRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => stopPolling, []);

  const start = async () => {
    setPhase("waiting");
    try {
      const { token, deepLink } = await startTelegramLogin();
      tokenRef.current = token;
      window.open(deepLink, "_blank", "noopener,noreferrer");

      intervalRef.current = setInterval(async () => {
        const status = await checkTelegramLoginStatus(token);
        if (status === "approved") {
          stopPolling();
          await signIn("telegram", { loginToken: token, redirectTo: "/" });
        } else if (status === "expired") {
          stopPolling();
          setPhase("expired");
        }
      }, POLL_MS);
    } catch (err) {
      console.error("startTelegramLogin failed", err);
      setPhase("error");
    }
  };

  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-[var(--color-bg)] p-6">
      <Card padding="lg" shadow="md" className="w-full max-w-[400px] text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]">
          <Send size={26} color="#fff" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          Maqsadlarim
        </h1>
        <p className="mb-8 text-sm text-[var(--color-text-muted)]">
          Shaxsiy AI assistentingizga Telegram orqali kiring
        </p>

        {phase === "waiting" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-[var(--color-text-muted)]">
              Telegram&apos;da botga o&apos;ting va &quot;Start&quot; tugmasini bosing...
            </div>
            <div className="size-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          </div>
        ) : (
          <Button variant="primary" size="lg" onClick={start} className="w-full">
            <Send size={17} />
            Telegram orqali kirish
          </Button>
        )}

        {phase === "expired" && (
          <p className="mt-4 text-[13px] text-[var(--color-error)]">
            Kirish havolasi eskirdi. Qaytadan urinib ko&apos;ring.
          </p>
        )}
        {phase === "error" && (
          <p className="mt-4 text-[13px] text-[var(--color-error)]">
            Xatolik yuz berdi. Qaytadan urinib ko&apos;ring.
          </p>
        )}
      </Card>
    </div>
  );
}
