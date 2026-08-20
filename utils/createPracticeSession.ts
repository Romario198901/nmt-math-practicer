import type { PracticeSettings } from "@/types/practice";
import type { Question } from "@/types/question";

const shuffleArray = <T>(items: T[]): T[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

export const createPracticeSession = (
  questions: Question[],
  settings: PracticeSettings,
): Question[] => {
  let filteredQuestions = [...questions];

  if (settings.topic !== "all") {
    filteredQuestions = filteredQuestions.filter(
      (question) => question.category === settings.topic,
    );
  }

  if (settings.difficulty !== "all") {
    filteredQuestions = filteredQuestions.filter(
      (question) => question.difficulty === settings.difficulty,
    );
  }

  if (settings.questionType !== "all") {
    filteredQuestions = filteredQuestions.filter(
      (question) => question.type === settings.questionType,
    );
  }

  if (settings.shuffleQuestions) {
    filteredQuestions = shuffleArray(filteredQuestions);
  }

  const sessionQuestions = filteredQuestions.slice(0, settings.questionsCount);

  if (!settings.shuffleAnswers) {
    return sessionQuestions;
  }

  return sessionQuestions.map((question) => {
    if (!question.options) {
      return question;
    }

    return {
      ...question,
      options: shuffleArray(question.options),
    };
  });
};
