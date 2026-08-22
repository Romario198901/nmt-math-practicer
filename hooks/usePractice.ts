import { getCurrentUser } from "@/services/authApi";
import { createTaskResult } from "@/services/taskResultsApi";

import { usePracticeSessionStore } from "@/stores/usePracticeSessionStore";

import { checkAnswer } from "@/utils/checkAnswer";

import type { Question } from "@/types/question";

export const usePractice = (questions: Question[]) => {
  const {
    sessionId,
    currentIndex,
    selectedAnswer,
    isAnswered,
    isCorrect,
    correctAnswersCount,
    currentQuestionStartedAt,
    setAnswerResult,
    incrementCorrectAnswers,
    goToNextQuestion,
  } = usePracticeSessionStore();

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || isAnswered || !sessionId) {
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      console.error("Anonymous user not found.");

      return;
    }

    const correct = checkAnswer(answer, currentQuestion.correctAnswer);

    const answeredAt = Date.now();

    const responseTime = currentQuestionStartedAt
      ? Math.max(0, Math.floor((answeredAt - currentQuestionStartedAt) / 1000))
      : 0;

    try {
      await createTaskResult({
        userId: user.uid,

        sessionId,

        taskId: currentQuestion.id,

        themeId: currentQuestion.themeId,

        answer,

        isCorrect: correct,

        responseTime,

        answeredAt,
      });

      setAnswerResult(answer, correct);

      if (correct) {
        incrementCorrectAnswers();
      }
    } catch (error) {
      console.error("Failed to save task result:", error);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return {
    currentQuestion,
    currentIndex,
    selectedAnswer,
    isAnswered,
    isCorrect,
    isLastQuestion,
    correctAnswersCount,
    checkAnswer: handleAnswer,
    goToNextQuestion,
  };
};
