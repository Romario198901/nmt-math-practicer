"use client";

import { useRouter } from "next/navigation";

interface ResultsErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ResultsError({ error, reset }: ResultsErrorProps) {
  const router = useRouter();

  return (
    <main>
      <h1>Помилка результатів</h1>

      <p>Не вдалося відобразити результат тренування.</p>

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
