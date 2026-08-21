import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "modern-normalize/modern-normalize.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "НМТ Математика — тренажер",
    template: "%s | НМТ Математика",
  },
  description:
    "Інтерактивний тренажер для підготовки до НМТ з математики: тестові завдання, короткі відповіді, таймер і статистика результатів.",
  applicationName: "НМТ Математика",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="uk">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
