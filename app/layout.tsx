import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/providers/LanguageProvider";

export const metadata: Metadata = {
  title: "创业决策实验平台",
  description: "人机交互顺序与创业决策方式的心理学实验平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
