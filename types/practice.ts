import type { Difficulty, QuestionType } from "./question";

export type PracticeTopic = "all" | string;
export interface PracticeSettings {
  topic: PracticeTopic;
  questionsCount: number;
  difficulty: Difficulty | "all";
  questionType: QuestionType | "all";
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  ultimateMode: boolean;
}
