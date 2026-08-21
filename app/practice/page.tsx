import type { Metadata } from "next";

import PracticePageClient from "@/components/PracticePageClient/PracticePageClient";

export const metadata: Metadata = {
  title: "Тренування",
  description:
    "Проходьте математичні завдання для підготовки до НМТ, перевіряйте відповіді та контролюйте час виконання.",
};

export default function PracticePage() {
  return <PracticePageClient />;
}
