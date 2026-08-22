export type QuestionType = "short" | "single" | "matching";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  themeId: string;
  category: string;
  subcategory: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string[];
  explanation: string;
  formula?: string;
  points: number;
}
