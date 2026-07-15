"use client";

import { useEffect } from "react";

const SURFACE_COLOR = "#ffffff";
const BG_COLOR = "#f8fafc";

function applyViewportHeight(webApp: NonNullable<Window["Telegram"]>["WebApp"]) {
  if (!webApp) return;
  document.documentElement.style.setProperty(
    "--tg-viewport-height",
    `${webApp.viewportStableHeight}px`,
  );
}

export function TelegramMiniAppInit() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    try {
      webApp.setHeaderColor(SURFACE_COLOR);
      webApp.setBackgroundColor(BG_COLOR);
    } catch {
      // Older Telegram client versions don't support hex header/background colors.
    }
    try {
      webApp.disableVerticalSwipes?.();
    } catch {
      // Not available on this client version.
    }

    applyViewportHeight(webApp);
    const onViewportChanged = () => applyViewportHeight(webApp);
    webApp.onEvent("viewportChanged", onViewportChanged);
    return () => webApp.offEvent("viewportChanged", onViewportChanged);
  }, []);

  return null;
}
