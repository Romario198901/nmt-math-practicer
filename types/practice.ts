import type { Difficulty, QuestionType } from "./question";

export interface PracticeSettings {
  themeId: string | "all";
  questionsCount: number;
  difficulty: Difficulty | "all";
  questionType: QuestionType | "all";
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  ultimateMode: boolean;
}
