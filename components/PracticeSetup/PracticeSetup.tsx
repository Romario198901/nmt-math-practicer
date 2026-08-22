"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getQuestions } from "@/services/questionsApi";
import { getThemes } from "@/services/themesApi";

import { usePracticeSettingsStore } from "@/stores/usePracticeSettingsStore";
import { usePracticeSessionStore } from "@/stores/usePracticeSessionStore";

import { createPracticeSession } from "@/utils/createPracticeSession";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";

import { createSession } from "@/services/sessionApi";
import type { Theme } from "@/types/theme";

import styles from "./PracticeSetup.module.css";

interface PracticeSetupProps {
  initialThemeId?: string;
}

export default function PracticeSetup({ initialThemeId }: PracticeSetupProps) {
  const router = useRouter();

  const [themes, setThemes] = useState<Theme[]>([]);
  const [isThemesLoading, setIsThemesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    themeId,
    questionsCount,
    difficulty,
    questionType,
    shuffleQuestions,
    shuffleAnswers,
    ultimateMode,

    setThemeId,
    setQuestionsCount,
    setDifficulty,
    setQuestionType,
    setShuffleQuestions,
    setShuffleAnswers,
    setUltimateMode,
    resetSettings,
  } = usePracticeSettingsStore();

  const { isAuthLoading, authError, ensureAnonymousUser } = useAnonymousAuth();

  const setQuestions = usePracticeSessionStore((state) => state.setQuestions);

  const setSessionId = usePracticeSessionStore((state) => state.setSessionId);

  useEffect(() => {
    let isCancelled = false;

    const loadThemes = async () => {
      try {
        const data = await getThemes();

        if (isCancelled) {
          return;
        }

        const activeThemes = data.filter((theme) => theme.isActive);

        setThemes(activeThemes);

        if (initialThemeId) {
          const themeExists = activeThemes.some(
            (theme) => theme.id === initialThemeId,
          );

          if (themeExists) {
            setThemeId(initialThemeId);
          }
        }
      } catch (error) {
        console.error(error);

        if (!isCancelled) {
          setError("Не вдалося завантажити список тем.");
        }
      } finally {
        if (!isCancelled) {
          setIsThemesLoading(false);
        }
      }
    };

    loadThemes();

    return () => {
      isCancelled = true;
    };
  }, [initialThemeId, setThemeId]);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = await ensureAnonymousUser();

      if (!userId) {
        setError("Не вдалося створити сесію користувача.");

        return;
      }

      const questions = await getQuestions();

      const sessionQuestions = createPracticeSession(questions, {
        themeId,
        questionsCount,
        difficulty,
        questionType,
        shuffleQuestions,
        shuffleAnswers,
        ultimateMode,
      });

      if (sessionQuestions.length === 0) {
        setError("За вибраними налаштуваннями не знайдено жодного завдання.");

        return;
      }

      if (sessionQuestions.length < questionsCount) {
        setError(
          `За вибраними налаштуваннями доступно лише ${sessionQuestions.length} завдань. Змініть параметри тренування.`,
        );

        return;
      }

      const sessionId = await createSession({
        userId,

        themeIds:
          themeId === "all"
            ? [...new Set(sessionQuestions.map((question) => question.themeId))]
            : [themeId],

        startedAt: Date.now(),

        finishedAt: null,

        plannedTasksCount: sessionQuestions.length,

        completedTasksCount: 0,

        correctAnswersCount: 0,

        accuracy: null,

        totalTime: null,

        averageTime: null,

        status: "in-progress",
      });

      setQuestions(sessionQuestions);

      setSessionId(sessionId);

      router.push("/practice");
    } catch (error) {
      console.error(error);

      setError("Не вдалося розпочати тренування.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Підготовка до НМТ</p>

          <h1 className={styles.title}>Тренажер з математики</h1>

          <p className={styles.description}>
            Оберіть параметри тренування та розпочніть практику.
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="theme">
              Тема
            </label>

            <select
              className={styles.select}
              id="theme"
              value={themeId}
              disabled={isThemesLoading}
              onChange={(event) => setThemeId(event.target.value)}
            >
              <option value="all">Усі теми</option>

              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="questionsCount">
              Кількість завдань
            </label>

            <select
              className={styles.select}
              id="questionsCount"
              value={questionsCount}
              onChange={(event) =>
                setQuestionsCount(Number(event.target.value))
              }
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="difficulty">
              Складність
            </label>

            <select
              className={styles.select}
              id="difficulty"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value as "all" | "easy" | "medium" | "hard",
                )
              }
            >
              <option value="all">Усі рівні</option>

              <option value="easy">Легкі</option>

              <option value="medium">Середні</option>

              <option value="hard">Складні</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="questionType">
              Тип завдань
            </label>

            <select
              className={styles.select}
              id="questionType"
              value={questionType}
              onChange={(event) =>
                setQuestionType(
                  event.target.value as "all" | "single" | "short" | "matching",
                )
              }
            >
              <option value="all">Усі</option>

              <option value="single">Тестові</option>

              <option value="short">Власна відповідь</option>
            </select>
          </div>
        </div>

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(event) => setShuffleQuestions(event.target.checked)}
            />

            <span>Перемішувати завдання</span>
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={shuffleAnswers}
              onChange={(event) => setShuffleAnswers(event.target.checked)}
            />

            <span>Перемішувати відповіді</span>
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={ultimateMode}
              onChange={(event) => setUltimateMode(event.target.checked)}
            />

            <span>Ultimate mode</span>
          </label>
        </div>

        {(error || authError) && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            className={styles.progressButton}
            type="button"
            disabled={isLoading || isAuthLoading}
            onClick={() => router.push("/progress")}
          >
            Мій прогрес
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={isLoading || isThemesLoading}
            onClick={resetSettings}
          >
            Скинути
          </button>

          <button
            className={styles.primaryButton}
            type="button"
            disabled={isLoading || isAuthLoading || isThemesLoading}
            onClick={handleStart}
          >
            {isLoading ? "Завантаження..." : "Почати"}
          </button>
        </div>
      </div>
    </section>
  );
}
