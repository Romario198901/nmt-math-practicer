import { checkAnswer } from '@/utils/checkAnswer';
import { usePracticeSessionStore } from '@/stores/usePracticeSessionStore';

import type { Question } from '@/types/question';

export const usePractice = (
  questions: Question[]
) => {
  const {
    currentIndex,
    selectedAnswer,
    isAnswered,
    isCorrect,
    correctAnswersCount,
    setAnswerResult,
    incrementCorrectAnswers,
    goToNextQuestion,
  } = usePracticeSessionStore();

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || isAnswered) {
      return;
    }

    const correct = checkAnswer(
      answer,
      currentQuestion.correctAnswer
    );

    setAnswerResult(answer, correct);

    if (correct) {
      incrementCorrectAnswers();
    }
  };

  const isLastQuestion =
    currentIndex === questions.length - 1;

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