export type MasteryStatus =
  | "mastered"
  | "learning"
  | "weak"
  | "insufficient"
  | "untested";

export interface ThemeMastery {
  themeId: string;

  totalAnswers: number;
  correctAnswers: number;

  accuracy: number;

  status: MasteryStatus;
}
