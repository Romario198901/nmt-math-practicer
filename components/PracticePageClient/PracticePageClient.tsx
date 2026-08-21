"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import QuestionCard from "@/components/QuestionCard/QuestionCard";
import { usePractice } from "@/hooks/usePractice";
import { usePracticeTimer } from "@/hooks/usePracticeTimer";
import { usePracticeSessionStore } from "@/stores/usePracticeSessionStore";
import { usePracticeSettingsStore } from "@/stores/usePracticeSettingsStore";

export default function PracticePage() {
  const router = useRouter();

  const questions = usePracticeSessionStore((state) => state.questions);

  const clearSession = usePracticeSessionStore((state) => state.clearSession);

  const hasHydrated = usePracticeSessionStore((state) => state.hasHydrated);

  const startedAt = usePracticeSessionStore((state) => state.startedAt);

  const ultimateMode = usePracticeSettingsStore((state) => state.ultimateMode);

  const {
    currentQuestion,
    currentIndex,
    selectedAnswer,
    isAnswered,
    isCorrect,
    isLastQuestion,
    correctAnswersCount,
    checkAnswer,
    goToNextQuestion,
  } = usePractice(questions);

  const { elapsedSeconds, formattedTime } = usePracticeTimer(startedAt);

  useEffect(() => {
    if (!ultimateMode || !isAnswered || isLastQuestion) {
      return;
    }

    const timeout = setTimeout(() => {
      goToNextQuestion();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [ultimateMode, isAnswered, isLastQuestion, goToNextQuestion]);

  const handleFinish = () => {
    sessionStorage.setItem(
      "nmt-practice-result",
      JSON.stringify({
        total: questions.length,
        correct: correctAnswersCount,
        totalTime: elapsedSeconds,
      }),
    );

    clearSession();

    router.push("/results");
  };

  if (!hasHydrated) {
    return (
      <main>
        <p>Завантаження...</p>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main>
        <p>Сесію не знайдено.</p>
      </main>
    );
  }

  return (
    <main>
      <p>Час: {formattedTime}</p>

      <p>
        Завдання {currentIndex + 1} з {questions.length}
      </p>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onAnswer={checkAnswer}
      />

      {ultimateMode && isAnswered && !isLastQuestion && (
        <p>Наступне питання через 2 секунди...</p>
      )}

      {isAnswered && !isLastQuestion && !ultimateMode && (
        <button type="button" onClick={goToNextQuestion}>
          Далі
        </button>
      )}

      {isAnswered && isLastQuestion && (
        <button type="button" onClick={handleFinish}>
          Завершити
        </button>
      )}
    </main>
  );
}
