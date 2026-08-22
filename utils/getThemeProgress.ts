import type { Theme } from "@/types/theme";
import type { MasteryStatus, ThemeMastery } from "@/types/themeMastery";

export interface ThemeProgress {
  theme: Theme;

  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;

  status: MasteryStatus;
}

export const getThemeProgress = (
  themes: Theme[],
  mastery: ThemeMastery[],
): ThemeProgress[] => {
  const masteryMap = new Map(mastery.map((item) => [item.themeId, item]));

  return themes.map((theme) => {
    const current = masteryMap.get(theme.id);

    if (!current) {
      return {
        theme,
        totalAnswers: 0,
        correctAnswers: 0,
        accuracy: 0,
        status: "untested",
      };
    }

    return {
      theme,
      totalAnswers: current.totalAnswers,
      correctAnswers: current.correctAnswers,
      accuracy: current.accuracy,
      status: current.status,
    };
  });
};
