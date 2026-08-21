import type { Metadata } from "next";

import ResultsPageClient from "@/components/ResultsPageClient/ResultsPageClient";

export const metadata: Metadata = {
  title: "Результати",
  description:
    "Перегляньте результат тренування з математики: кількість правильних відповідей, відсоток успішності та середній час виконання завдання.",
};

export default function ResultsPage() {
  return <ResultsPageClient />;
}
