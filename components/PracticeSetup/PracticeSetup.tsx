"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getQuestions } from "@/services/questionsApi";
import { usePracticeSettingsStore } from "@/stores/usePracticeSettingsStore";
import { usePracticeSessionStore } from "@/stores/usePracticeSessionStore";
import { createPracticeSession } from "@/utils/createPracticeSession";

export default function PracticeSetup() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    topic,
    questionsCount,
    difficulty,
    questionType,
    shuffleQuestions,
    shuffleAnswers,
    ultimateMode,
    setTopic,
    setQuestionsCount,
    setDifficulty,
    setQuestionType,
    setShuffleQuestions,
    setShuffleAnswers,
    setUltimateMode,
    resetSettings,
  } = usePracticeSettingsStore();

  const setQuestions = usePracticeSessionStore((state) => state.setQuestions);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const questions = await getQuestions();

      const sessionQuestions = createPracticeSession(questions, {
        topic,
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

      setQuestions(sessionQuestions);

      router.push("/practice");
    } catch (error) {
      console.error(error);

      setError("Не вдалося завантажити завдання.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1>NMT Math Practicer</h1>

      <div>
        <label htmlFor="topic">Тема</label>

        <select
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        >
          <option value="all">Усі теми</option>
          <option value="numbers">Числа</option>
          <option value="percentages">Відсотки</option>
          <option value="algebra">Алгебра</option>
          <option value="powers">Степені</option>
          <option value="geometry">Геометрія</option>
          <option value="functions">Функції</option>
          <option value="probability">Ймовірність</option>
          <option value="word-problems">Текстові задачі</option>
        </select>
      </div>

      <div>
        <label htmlFor="questionsCount">Кількість завдань</label>

        <select
          id="questionsCount"
          value={questionsCount}
          onChange={(event) => setQuestionsCount(Number(event.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <div>
        <label htmlFor="difficulty">Складність</label>

        <select
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

      <div>
        <label htmlFor="questionType">Тип завдань</label>

        <select
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

      <label>
        <input
          type="checkbox"
          checked={shuffleQuestions}
          onChange={(event) => setShuffleQuestions(event.target.checked)}
        />
        Перемішувати завдання
      </label>

      <label>
        <input
          type="checkbox"
          checked={shuffleAnswers}
          onChange={(event) => setShuffleAnswers(event.target.checked)}
        />
        Перемішувати варіанти відповідей
      </label>

      <label>
        <input
          type="checkbox"
          checked={ultimateMode}
          onChange={(event) => setUltimateMode(event.target.checked)}
        />
        Ultimate mode
      </label>

      {error && <p>{error}</p>}

      <div>
        <button type="button" onClick={resetSettings} disabled={isLoading}>
          Скинути
        </button>

        <button type="button" onClick={handleStart} disabled={isLoading}>
          {isLoading ? "Завантаження..." : "Почати"}
        </button>
      </div>
    </section>
  );
}
