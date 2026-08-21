"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container/Container";

import styles from "./ResultsPageClient.module.css";

interface PracticeResult {
  total: number;
  correct: number;
  totalTime: number;
}

const subscribe = () => {
  return () => {};
};

const getClientSnapshot = () => true;

const getServerSnapshot = () => false;

const getStoredResult = (): PracticeResult | null => {
  const rawResult = sessionStorage.getItem("nmt-practice-result");

  if (!rawResult) {
    return null;
  }

  try {
    return JSON.parse(rawResult) as PracticeResult;
  } catch {
    sessionStorage.removeItem("nmt-practice-result");

    return null;
  }
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default function ResultsPageClient() {
  const router = useRouter();

  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [result] = useState<PracticeResult | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getStoredResult();
  });

  const handleRestart = () => {
    sessionStorage.removeItem("nmt-practice-result");

    router.push("/");
  };

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <Container className={styles.container}>
          <p>Завантаження результатів...</p>
        </Container>
      </main>
    );
  }

  if (!result) {
    return (
      <main className={styles.page}>
        <Container className={styles.container}>
          <section className={styles.emptyState}>
            <h1 className={styles.title}>Результат не знайдено</h1>

            <p className={styles.description}>
              Розпочніть нове тренування, щоб отримати результат.
            </p>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => router.push("/")}
            >
              На головну
            </button>
          </section>
        </Container>
      </main>
    );
  }

  const percentage = Math.round((result.correct / result.total) * 100);

  const averageTime = Math.round(result.totalTime / result.total);

  return (
    <main className={styles.page}>
      <Container className={styles.container}>
        <section className={styles.card}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Тренування завершено</p>

            <h1 className={styles.title}>Ваш результат</h1>

            <p className={styles.description}>
              Перегляньте основні показники проходження тесту.
            </p>
          </div>

          <div className={styles.score}>
            <strong className={styles.scoreValue}>{percentage}%</strong>

            <span className={styles.scoreLabel}>правильних відповідей</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Правильні відповіді</span>

              <strong className={styles.statValue}>
                {result.correct} / {result.total}
              </strong>
            </div>

            <div className={styles.stat}>
              <span className={styles.statLabel}>Загальний час</span>

              <strong className={styles.statValue}>
                {formatTime(result.totalTime)}
              </strong>
            </div>

            <div className={styles.stat}>
              <span className={styles.statLabel}>Середній час</span>

              <strong className={styles.statValue}>{averageTime} с</strong>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => router.push("/")}
            >
              На головну
            </button>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={handleRestart}
            >
              Пройти ще раз
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}
