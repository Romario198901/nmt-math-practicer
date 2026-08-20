const normalizeAnswer = (answer: string): string => {
  return answer.trim().toLowerCase().replace(/\s+/g, "").replace(",", ".");
};

export const checkAnswer = (
  answer: string,
  correctAnswers: string[],
): boolean => {
  const normalizedAnswer = normalizeAnswer(answer);

  return correctAnswers.some(
    (correctAnswer) => normalizeAnswer(correctAnswer) === normalizedAnswer,
  );
};
