import type { Theme } from "@/types/theme";
import type { ThemeMastery } from "@/types/themeMastery";

export const getRecommendedThemes = (
  themes: Theme[],
  mastery: ThemeMastery[],
): Theme[] => {
  const masteryMap = new Map(mastery.map((item) => [item.themeId, item]));

  return themes
    .filter((theme) => theme.isActive)
    .filter((theme) => {
      const currentMastery = masteryMap.get(theme.id);

      if (currentMastery?.status === "mastered") {
        return false;
      }

      const prerequisitesCompleted = theme.prerequisites.every(
        (prerequisiteId) => {
          const prerequisiteMastery = masteryMap.get(prerequisiteId);

          return prerequisiteMastery?.status === "mastered";
        },
      );

      return prerequisitesCompleted;
    })
    .sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }

      return a.order - b.order;
    });
};
