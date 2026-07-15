interface TelegramWebApp {
  initData: string;
  ready(): void;
  expand(): void;
  disableVerticalSwipes?(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  onEvent(event: "viewportChanged", callback: () => void): void;
  offEvent(event: "viewportChanged", callback: () => void): void;
  viewportStableHeight: number;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
