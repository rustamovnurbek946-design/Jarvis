import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { TelegramMiniAppInit } from "@/components/telegram/telegram-miniapp-init";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maqsadlarim",
  description: "Shaxsiy AI assistent — maqsadlar va kunlik vazifalar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramMiniAppInit />
        {children}
      </body>
    </html>
  );
}
