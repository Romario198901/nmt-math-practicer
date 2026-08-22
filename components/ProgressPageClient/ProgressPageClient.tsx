"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container/Container";

import { signInAnonymousUser } from "@/services/authApi";
import { getThemes } from "@/services/themesApi";
import { getUserTaskResults } from "@/services/taskResultsApi";

import { calculateThemeMastery } from "@/utils/calculateThemeMastery";
import { getThemeProgress, type ThemeProgress } from "@/utils/getThemeProgress";
import { canAccessTheme } from "@/utils/canAccessTheme";

import type { ThemeMastery } from "@/types/themeMastery";
import styles from "./ProgressPageClient.module.css";

const subscribe = () => {
  return () => {};
};

const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const getStatusLabel = (status: ThemeProgress["status"]): string => {
  switch (status) {
    case "mastered":
      return "Засвоєно";

    case "learning":
      return "Вивчається";

    case "weak":
      return "Потребує повторення";

    case "insufficient":
      return "Недостатньо даних";

    case "untested":
      return "Не розпочато";
  }
};

export default function ProgressPageClient() {
  const router = useRouter();
  const [mastery, setMastery] = useState<ThemeMastery[]>([]);
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [progress, setProgress] = useState<ThemeProgress[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isCancelled = false;

    const loadProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const user = await signInAnonymousUser();

        const [themes, taskResults] = await Promise.all([
          getThemes(),
          getUserTaskResults(user.uid),
        ]);

        const activeThemes = themes.filter((theme) => theme.isActive);

        const calculatedMastery = calculateThemeMastery(taskResults);

        const themeProgress = getThemeProgress(activeThemes, calculatedMastery);

        if (!isCancelled) {
          setProgress(themeProgress);
          setMastery(calculatedMastery);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);

        if (!isCancelled) {
          setError("Не вдалося завантажити прогрес.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated]);

  const handleThemeClick = (themeId: string) => {
    router.push(`/?theme=${encodeURIComponent(themeId)}`);
  };

  if (!isHydrated || isLoading) {
    return (
      <main className={styles.page}>
        <Container>
          <p className={styles.message}>Завантаження прогресу...</p>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <Container>
          <p className={styles.error}>{error}</p>
        </Container>
      </main>
    );
  }

  const masteredCount = progress.filter(
    (item) => item.status === "mastered",
  ).length;

  return (
    <main className={styles.page}>
      <Container>
        <section className={styles.wrapper}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Персональна траєкторія</p>

              <h1 className={styles.title}>Прогрес навчання</h1>

              <p className={styles.description}>
                Тут відображається стан засвоєння всіх активних тем.
              </p>
            </div>

            <div className={styles.summary}>
              <strong>{masteredCount}</strong>

              <span>з {progress.length} тем засвоєно</span>
            </div>
          </header>

          <div className={styles.grid}>
            {progress.map((item) => {
              const isAvailable = canAccessTheme(item.theme, mastery);

              return (
                <article
                  key={item.theme.id}
                  className={`${styles.card} ${
                    !isAvailable ? styles.lockedCard : ""
                  }`}
                >
                  <div>
                    <span
                      className={`${styles.status} ${
                        !isAvailable ? styles.locked : styles[item.status]
                      }`}
                    >
                      {!isAvailable
                        ? "Заблоковано"
                        : getStatusLabel(item.status)}
                    </span>

                    <h2 className={styles.cardTitle}>{item.theme.title}</h2>

                    <p className={styles.level}>Рівень {item.theme.level}</p>
                  </div>

                  {isAvailable ? (
                    <>
                      <div className={styles.progressInfo}>
                        <span>
                          {item.correctAnswers} / {item.totalAnswers} правильних
                        </span>

                        <strong>{item.accuracy}%</strong>
                      </div>

                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressValue}
                          style={{
                            width: `${item.accuracy}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.prerequisites}>
                      <p>Спочатку потрібно засвоїти:</p>

                      {item.theme.prerequisites.map((prerequisiteId) => {
                        const prerequisite = progress.find(
                          (progressItem) =>
                            progressItem.theme.id === prerequisiteId,
                        );

                        return prerequisite ? (
                          <span
                            key={prerequisiteId}
                            className={styles.prerequisite}
                          >
                            {prerequisite.theme.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  <button
                    className={styles.button}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleThemeClick(item.theme.id)}
                  >
                    {!isAvailable
                      ? "Тема заблокована"
                      : item.status === "untested"
                        ? "Почати тему"
                        : "Тренувати тему"}
                  </button>
                </article>
              );
            })}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => router.push("/")}
            >
              На головну
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}
