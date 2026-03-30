import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PVT Toolkit — Калькуляторы корреляций для нефтяной инженерии",
  description: "Инструменты для расчёта PVT свойств нефти: газосодержание (Rs), объёмный коэффициент (Bo), давление насыщения (Pb). Поддержка 20+ эмпирических корреляций.",
  keywords: ["PVT", "нефтегаз", "корреляции", "Rs", "Bo", "Pb", "газосодержание", "объёмный коэффициент", "давление насыщения", "petroleum engineering"],
  authors: [{ name: "PVT Toolkit" }],
  openGraph: {
    title: "PVT Toolkit — Калькуляторы корреляций",
    description: "Расчёт PVT свойств нефти по эмпирическим корреляциям",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.44/dist/katex.min.css" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
