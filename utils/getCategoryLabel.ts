const categoryLabels: Record<string, string> = {
  numbers: "Числа",
  percentages: "Відсотки",
  algebra: "Алгебра",
  powers: "Степені та корені",
  functions: "Функції",
  geometry: "Геометрія",
  probability: "Ймовірність і статистика",
  "word-problems": "Текстові задачі",
};

export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] ?? category;
};
