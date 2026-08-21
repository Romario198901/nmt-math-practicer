"use client";

import { useRouter } from "next/navigation";

interface PracticeErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function PracticeError({ error, reset }: PracticeErrorProps) {
  const router = useRouter();

  return (
    <main>
      <h1>Помилка тренування</h1>

      <p>Не вдалося продовжити поточне тренування.</p>

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
