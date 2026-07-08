import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      <body className="flex h-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto px-10 py-9">{children}</main>
      </body>
    </html>
  );
}
