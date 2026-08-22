import type { Theme } from "@/types/theme";
import type { ThemeMastery } from "@/types/themeMastery";

export const canAccessTheme = (
  theme: Theme,
  mastery: ThemeMastery[],
): boolean => {
  if (theme.prerequisites.length === 0) {
    return true;
  }

  const masteryMap = new Map(
    mastery.map((item) => [item.themeId, item.status]),
  );

  return theme.prerequisites.every(
    (prerequisiteId) => masteryMap.get(prerequisiteId) === "mastered",
  );
};
