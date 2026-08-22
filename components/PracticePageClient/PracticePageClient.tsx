"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container/Container";
import QuestionCard from "@/components/QuestionCard/QuestionCard";

import { usePractice } from "@/hooks/usePractice";
import { usePracticeTimer } from "@/hooks/usePracticeTimer";

import { usePracticeSessionStore } from "@/stores/usePracticeSessionStore";
import { usePracticeSettingsStore } from "@/stores/usePracticeSettingsStore";
import { completeSession } from '@/services/sessionApi';

import styles from "./PracticePageClient.module.css";

export default function PracticePageClient() {
  const router = useRouter();

const sessionId = usePracticeSessionStore(
  state => state.sessionId
);

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

    const timeout = window.setTimeout(() => {
      goToNextQuestion();
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [ultimateMode, isAnswered, isLastQuestion, goToNextQuestion]);

 const handleFinish = async () => {
  if (!sessionId) {
    return;
  }

  const total = questions.length;
  const correct = correctAnswersCount;

  const accuracy = Math.round(
    (correct / total) * 100
  );

  const averageTime = Math.round(
    elapsedSeconds / total
  );

  try {
    await completeSession(sessionId, {
      finishedAt: Date.now(),

      completedTasksCount: total,

      correctAnswersCount: correct,

      accuracy,

      totalTime: elapsedSeconds,

      averageTime,

      status: 'completed',
    });

    sessionStorage.setItem(
      'nmt-practice-result',
      JSON.stringify({
        total,
        correct,
        accuracy,
        totalTime: elapsedSeconds,
        averageTime,
      })
    );

    clearSession();

    router.push('/results');
  } catch (error) {
    console.error(
      'Failed to complete session:',
      error
    );
  }
};

  if (!hasHydrated) {
    return (
      <main className={styles.page}>
        <Container>
          <p className={styles.message}>Завантаження тренування...</p>
        </Container>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className={styles.page}>
        <Container>
          <div className={styles.emptyState}>
            <h1 className={styles.emptyTitle}>Активну сесію не знайдено</h1>

            <p className={styles.message}>
              Поверніться на головну сторінку та запустіть нове тренування.
            </p>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => router.push("/")}
            >
              На головну
            </button>
          </div>
        </Container>
      </main>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className={styles.page}>
      <Container className={styles.container}>
        <section className={styles.practice}>
          <header className={styles.header}>
            <div>
              <p className={styles.label}>Завдання</p>

              <p className={styles.progressText}>
                {currentIndex + 1} з {questions.length}
              </p>
            </div>

            <div className={styles.timer}>
              <span className={styles.timerLabel}>Час</span>

              <strong className={styles.timerValue}>{formattedTime}</strong>
            </div>
          </header>

          <div className={styles.progressBar} aria-hidden="true">
            <div
              className={styles.progressValue}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.cardWrapper}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              onAnswer={checkAnswer}
            />
          </div>

          <footer className={styles.footer}>
            {ultimateMode && isAnswered && !isLastQuestion && (
              <p className={styles.ultimateMessage}>
                Наступне питання через 2 секунди...
              </p>
            )}

            {isAnswered && !isLastQuestion && !ultimateMode && (
              <button
                className={styles.primaryButton}
                type="button"
                onClick={goToNextQuestion}
              >
                Далі
              </button>
            )}

            {isAnswered && isLastQuestion && (
              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleFinish}
              >
                Завершити
              </button>
            )}
          </footer>
        </section>
      </Container>
    </main>
  );
}
