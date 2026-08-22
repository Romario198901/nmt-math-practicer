"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container/Container";
import LearningRecommendations from "@/components/LearningRecommendations/LearningRecommendations";

import { signInAnonymousUser } from "@/services/authApi";
import { getThemes } from "@/services/themesApi";
import { getUserTaskResults } from "@/services/taskResultsApi";

import { calculateThemeMastery } from "@/utils/calculateThemeMastery";

import type { Theme } from "@/types/theme";
import type { ThemeMastery } from "@/types/themeMastery";

import styles from "./ResultsPageClient.module.css";

interface PracticeResult {
  total: number;
  correct: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
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

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
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

  const [themes, setThemes] = useState<Theme[]>([]);

  const [mastery, setMastery] = useState<ThemeMastery[]>([]);

  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);

  const [recommendationsError, setRecommendationsError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isHydrated || !result) {
      return;
    }

    let isCancelled = false;

    const loadRecommendations = async () => {
      try {
        setIsRecommendationsLoading(true);

        setRecommendationsError(null);

        const user = await signInAnonymousUser();

        const [themesData, taskResults] = await Promise.all([
          getThemes(),
          getUserTaskResults(user.uid),
        ]);

        const activeThemes = themesData.filter((theme) => theme.isActive);

        const calculatedMastery = calculateThemeMastery(taskResults);

        if (!isCancelled) {
          setThemes(activeThemes);
          setMastery(calculatedMastery);
        }
      } catch (error) {
        console.error("Failed to load learning recommendations:", error);

        if (!isCancelled) {
          setRecommendationsError("Не вдалося сформувати рекомендації.");
        }
      } finally {
        if (!isCancelled) {
          setIsRecommendationsLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated, result]);

  const handleRestart = () => {
    sessionStorage.removeItem("nmt-practice-result");

    router.push("/");
  };

  const handleRecommendedTheme = (themeId: string) => {
    sessionStorage.removeItem("nmt-practice-result");

    router.push(`/?theme=${encodeURIComponent(themeId)}`);
  };

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <Container className={styles.container}>
          <p className={styles.loadingMessage}>Завантаження результатів...</p>
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

  return (
    <main className={styles.page}>
      <Container className={styles.container}>
        <section className={styles.card}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Тренування завершено</p>

            <h1 className={styles.title}>Ваш результат</h1>

            <p className={styles.description}>
              Перегляньте результати проходження та рекомендації для подальшого
              навчання.
            </p>
          </div>

          <div className={styles.score}>
            <strong className={styles.scoreValue}>{result.accuracy}%</strong>

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

              <strong className={styles.statValue}>
                {result.averageTime} с
              </strong>
            </div>
          </div>

          <div className={styles.recommendationsSection}>
            {isRecommendationsLoading && (
              <p className={styles.loadingMessage}>Формуємо рекомендації...</p>
            )}

            {recommendationsError && (
              <p className={styles.error}>{recommendationsError}</p>
            )}

            {!isRecommendationsLoading && !recommendationsError && (
              <LearningRecommendations
                themes={themes}
                mastery={mastery}
                onSelectTheme={handleRecommendedTheme}
              />
            )}
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
              className={styles.progressButton}
              type="button"
              onClick={() => router.push("/progress")}
            >
              Мій прогрес
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
