'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PracticeResult {
  total: number;
  correct: number;
  totalTime: number;
}

const getStoredResult = (): PracticeResult | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawResult = sessionStorage.getItem(
    'nmt-practice-result'
  );

  if (!rawResult) {
    return null;
  }

  try {
    return JSON.parse(rawResult) as PracticeResult;
  } catch {
    sessionStorage.removeItem(
      'nmt-practice-result'
    );

    return null;
  }
};

export default function ResultsPageClient() {
  const router = useRouter();

  const [result] = useState<PracticeResult | null>(
    getStoredResult
  );

  const handleRestart = () => {
    sessionStorage.removeItem(
      'nmt-practice-result'
    );

    router.push('/');
  };

  if (!result) {
    return (
      <main>
        <p>Результат не знайдено.</p>

        <button
          type="button"
          onClick={() => router.push('/')}
        >
          На головну
        </button>
      </main>
    );
  }

  const percentage = Math.round(
    (result.correct / result.total) * 100
  );

  const averageTime = Math.round(
    result.totalTime / result.total
  );

  return (
    <main>
      <h1>Результат</h1>

      <p>
        Правильних відповідей:{' '}
        {result.correct} з {result.total}
      </p>

      <p>Результат: {percentage}%</p>

      <p>
        Загальний час: {result.totalTime} с
      </p>

      <p>
        Середній час на завдання:{' '}
        {averageTime} с
      </p>

      <button
        type="button"
        onClick={handleRestart}
      >
        Пройти ще раз
      </button>
    </main>
  );
}