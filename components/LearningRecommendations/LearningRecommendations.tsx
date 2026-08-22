"use client";

import type { Theme } from "@/types/theme";
import type { ThemeMastery } from "@/types/themeMastery";

import styles from "./LearningRecommendations.module.css";

interface LearningRecommendationsProps {
  themes: Theme[];
  mastery: ThemeMastery[];
  onSelectTheme: (themeId: string) => void;
}

export default function LearningRecommendations({
  themes,
  mastery,
  onSelectTheme,
}: LearningRecommendationsProps) {
  const masteryMap = new Map(mastery.map((item) => [item.themeId, item]));

  const activeThemes = themes
    .filter((theme) => theme.isActive)
    .sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }

      return a.order - b.order;
    });

  const continueThemes = activeThemes.filter((theme) => {
    const current = masteryMap.get(theme.id);

    return current && current.status !== "mastered";
  });

  const availableNewThemes = activeThemes.filter((theme) => {
    const current = masteryMap.get(theme.id);

    if (current) {
      return false;
    }

    return theme.prerequisites.every(
      (prerequisiteId) => masteryMap.get(prerequisiteId)?.status === "mastered",
    );
  });

  const lockedThemes = activeThemes.filter((theme) => {
    const current = masteryMap.get(theme.id);

    if (current) {
      return false;
    }

    if (theme.prerequisites.length === 0) {
      return false;
    }

    return theme.prerequisites.some(
      (prerequisiteId) => masteryMap.get(prerequisiteId)?.status !== "mastered",
    );
  });

  const continueTheme = continueThemes[0];
  const availableTheme = availableNewThemes[0];
  const lockedTheme = lockedThemes[0];

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Рекомендації</h2>

        <p className={styles.description}>
          Наступні кроки сформовані на основі ваших результатів і залежностей
          між темами.
        </p>
      </div>

      <div className={styles.list}>
        {continueTheme && (
          <article className={styles.card}>
            <div>
              <span className={styles.badge}>Продовжити</span>

              <h3 className={styles.cardTitle}>{continueTheme.title}</h3>

              <p className={styles.cardDescription}>
                Тема ще не засвоєна достатньо впевнено.
              </p>
            </div>

            {masteryMap.get(continueTheme.id) && (
              <div className={styles.progressInfo}>
                <span>
                  {masteryMap.get(continueTheme.id)?.correctAnswers}/
                  {masteryMap.get(continueTheme.id)?.totalAnswers} правильних
                </span>

                <strong>{masteryMap.get(continueTheme.id)?.accuracy}%</strong>
              </div>
            )}

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => onSelectTheme(continueTheme.id)}
            >
              Продовжити тему
            </button>
          </article>
        )}

        {availableTheme && (
          <article className={styles.card}>
            <div>
              <span className={styles.badge}>Нова тема</span>

              <h3 className={styles.cardTitle}>{availableTheme.title}</h3>

              <p className={styles.cardDescription}>
                Усі необхідні попередні теми вже засвоєні.
              </p>
            </div>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => onSelectTheme(availableTheme.id)}
            >
              Почати тему
            </button>
          </article>
        )}

        {lockedTheme && (
          <article className={`${styles.card} ${styles.locked}`}>
            <div>
              <span className={styles.lockedBadge}>Заблоковано</span>

              <h3 className={styles.cardTitle}>{lockedTheme.title}</h3>

              <p className={styles.cardDescription}>
                Спочатку потрібно засвоїти попередні теми.
              </p>
            </div>

            <div className={styles.prerequisites}>
              {lockedTheme.prerequisites.map((prerequisiteId) => {
                const prerequisite = themes.find(
                  (theme) => theme.id === prerequisiteId,
                );

                return prerequisite ? (
                  <span key={prerequisite.id} className={styles.prerequisite}>
                    {prerequisite.title}
                  </span>
                ) : null;
              })}
            </div>
          </article>
        )}

        {!continueTheme && !availableTheme && !lockedTheme && (
          <p className={styles.empty}>Наразі додаткових рекомендацій немає.</p>
        )}
      </div>
    </section>
  );
}
