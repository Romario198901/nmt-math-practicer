"use client";

import { useRouter } from "next/navigation";

interface PracticeResult {
  total: number;
  correct: number;
  totalTime: number;
}

export default function ResultsPage() {
  const router = useRouter();

  const rawResult =
    typeof window !== "undefined"
      ? sessionStorage.getItem("nmt-practice-result")
      : null;

  const result: PracticeResult | null = rawResult
    ? JSON.parse(rawResult)
    : null;

  const handleRestart = () => {
    sessionStorage.removeItem("nmt-practice-result");

    router.push("/");
  };

  if (!result) {
    return (
      <main>
        <p>Результат не знайдено.</p>

        <button type="button" onClick={() => router.push("/")}>
          На головну
        </button>
      </main>
    );
  }

  const percentage = Math.round((result.correct / result.total) * 100);

  const averageTime = Math.round(result.totalTime / result.total);

  return (
    <main>
      <h1>Результат</h1>

      <p>
        Правильних відповідей: {result.correct} з {result.total}
      </p>

      <p>Результат: {percentage}%</p>

      <p>Загальний час: {result.totalTime} с</p>

      <p>Середній час на завдання: {averageTime} с</p>

      <button type="button" onClick={handleRestart}>
        Пройти ще раз
      </button>
    </main>
  );
}
