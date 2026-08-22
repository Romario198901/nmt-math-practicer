"use client";

import { useRouter } from "next/navigation";

interface ProgressErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ProgressError({ error, reset }: ProgressErrorProps) {
  const router = useRouter();

  return (
    <main>
      <h1>Помилка завантаження прогресу</h1>

      <p>Не вдалося отримати дані про навчальний прогрес.</p>

      {process.env.NODE_ENV === "development" && <p>{error.message}</p>}

      <button type="button" onClick={reset}>
        Спробувати ще раз
      </button>

      <button type="button" onClick={() => router.push("/")}>
        На головну
      </button>
    </main>
  );
}
