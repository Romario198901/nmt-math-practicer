import type { TaskResult } from '@/types/taskResult';

import type {
  MasteryStatus,
  ThemeMastery,
} from '@/types/themeMastery';

export const MIN_ANSWERS_FOR_MASTERY = 5;
export const MASTERY_THRESHOLD = 80;
export const LEARNING_THRESHOLD = 60;

const getMasteryStatus = (
  accuracy: number,
  totalAnswers: number
): MasteryStatus => {
  if (
    totalAnswers <
    MIN_ANSWERS_FOR_MASTERY
  ) {
    return 'insufficient';
  }

  if (accuracy >= MASTERY_THRESHOLD) {
    return 'mastered';
  }

  if (accuracy >= LEARNING_THRESHOLD) {
    return 'learning';
  }

  return 'weak';
};

export const calculateThemeMastery = (
  results: TaskResult[]
): ThemeMastery[] => {
  const groupedResults = new Map<
    string,
    {
      totalAnswers: number;
      correctAnswers: number;
    }
  >();

  for (const result of results) {
    const current =
      groupedResults.get(result.themeId) ?? {
        totalAnswers: 0,
        correctAnswers: 0,
      };

    current.totalAnswers += 1;

    if (result.isCorrect) {
      current.correctAnswers += 1;
    }

    groupedResults.set(
      result.themeId,
      current
    );
  }

  return Array.from(
    groupedResults.entries()
  ).map(
    ([
      themeId,
      {
        totalAnswers,
        correctAnswers,
      },
    ]) => {
      const accuracy = Math.round(
        (correctAnswers / totalAnswers) * 100
      );

      return {
        themeId,
        totalAnswers,
        correctAnswers,
        accuracy,
        status: getMasteryStatus(
          accuracy,
          totalAnswers
        ),
      };
    }
  );
};