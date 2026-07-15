"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startTelegramLogin, checkTelegramLoginStatus } from "@/lib/actions/telegram-auth";
import { isTelegramMiniApp, getTelegramInitData } from "@/lib/telegram/miniapp-client";

type Phase = "idle" | "waiting" | "miniapp" | "miniapp-error" | "expired" | "error";

const POLL_MS = 1500;

export function LoginClient() {
  // Checked once on mount: the deep-link "open bot in a new tab, then poll"
  // flow below doesn't work inside a Telegram Mini App WebView — opening a
  // t.me link there navigates away and closes the mini app entirely, with
  // no way back. So a mini app must always go through initData auto-login,
  // never fall back to the manual button.
  const [isMiniApp] = useState(() => isTelegramMiniApp());
  const [phase, setPhase] = useState<Phase>("idle");
  const tokenRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => stopPolling, []);

  // Inside a Telegram Mini App, initData is already signed by Telegram —
  // sign the user in with it instead of showing the deep-link flow. No
  // setState before the `await`: the spinner is already the default view
  // for isMiniApp (see the render below), so this only needs to update
  // state on the async result.
  const signInWithInitData = async () => {
    const initData = getTelegramInitData();
    const result = await signIn("telegram-miniapp", { initData, redirect: false });
    if (result?.ok) {
      router.replace("/");
    } else {
      setPhase("miniapp-error");
    }
  };

  useEffect(() => {
    if (!isMiniApp) return;
    // signInWithInitData only sets state after its `await signIn(...)` resolves,
    // not synchronously — safe despite the lint rule's conservative static check.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    signInWithInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniApp]);

  const retryMiniAppLogin = () => {
    setPhase("idle");
    signInWithInitData();
  };

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

        {isMiniApp ? (
          phase === "miniapp-error" ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[13px] text-[var(--color-error)]">
                Kirish amalga oshmadi. Sizga ruxsat berilmagan bo&apos;lishi mumkin — admin bilan
                bog&apos;laning yoki qaytadan urinib ko&apos;ring.
              </p>
              <Button variant="primary" size="md" onClick={retryMiniAppLogin}>
                Qaytadan urinish
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="text-sm text-[var(--color-text-muted)]">Kirish...</div>
              <div className="size-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
          )
        ) : phase === "waiting" ? (
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

        {!isMiniApp && phase === "expired" && (
          <p className="mt-4 text-[13px] text-[var(--color-error)]">
            Kirish havolasi eskirdi. Qaytadan urinib ko&apos;ring.
          </p>
        )}
        {!isMiniApp && phase === "error" && (
          <p className="mt-4 text-[13px] text-[var(--color-error)]">
            Xatolik yuz berdi. Qaytadan urinib ko&apos;ring.
          </p>
        )}
      </Card>
    </div>
  );
}
