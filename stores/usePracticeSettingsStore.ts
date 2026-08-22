import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PracticeSettings } from "@/types/practice";

interface PracticeSettingsStore extends PracticeSettings {
  setThemeId: (themeId: PracticeSettings["themeId"]) => void;
  setQuestionsCount: (count: number) => void;
  setDifficulty: (difficulty: PracticeSettings["difficulty"]) => void;
  setQuestionType: (questionType: PracticeSettings["questionType"]) => void;
  setShuffleQuestions: (value: boolean) => void;
  setShuffleAnswers: (value: boolean) => void;
  setUltimateMode: (value: boolean) => void;
  resetSettings: () => void;
}

const initialSettings: PracticeSettings = {
  themeId: "all",
  questionsCount: 10,
  difficulty: "all",
  questionType: "all",
  shuffleQuestions: true,
  shuffleAnswers: true,
  ultimateMode: false,
};

export const usePracticeSettingsStore = create<PracticeSettingsStore>()(
  persist(
    (set) => ({
      ...initialSettings,

      setThemeId: (themeId) => set({ themeId }),

      setQuestionsCount: (questionsCount) => set({ questionsCount }),

      setDifficulty: (difficulty) => set({ difficulty }),

      setQuestionType: (questionType) => set({ questionType }),

      setShuffleQuestions: (shuffleQuestions) => set({ shuffleQuestions }),

      setShuffleAnswers: (shuffleAnswers) => set({ shuffleAnswers }),

      setUltimateMode: (ultimateMode) => set({ ultimateMode }),

      resetSettings: () => set(initialSettings),
    }),
    {
      name: "nmt-practice-settings",
    },
  ),
);
