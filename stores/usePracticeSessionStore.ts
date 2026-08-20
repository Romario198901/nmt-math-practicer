import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Question } from "@/types/question";

interface PracticeSessionStore {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswersCount: number;
  startedAt: number | null;
  hasHydrated: boolean;

  setQuestions: (questions: Question[]) => void;

  setAnswerResult: (answer: string, isCorrect: boolean) => void;

  incrementCorrectAnswers: () => void;
  goToNextQuestion: () => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

const initialSession = {
  questions: [],
  currentIndex: 0,
  selectedAnswer: "",
  isAnswered: false,
  isCorrect: null,
  correctAnswersCount: 0,
  startedAt: null,
};

export const usePracticeSessionStore = create<PracticeSessionStore>()(
  persist(
    (set) => ({
      ...initialSession,

      hasHydrated: false,

      setQuestions: (questions) =>
        set({
          ...initialSession,
          questions,
          startedAt: Date.now(),
        }),

      setAnswerResult: (selectedAnswer, isCorrect) =>
        set({
          selectedAnswer,
          isCorrect,
          isAnswered: true,
        }),

      incrementCorrectAnswers: () =>
        set((state) => ({
          correctAnswersCount: state.correctAnswersCount + 1,
        })),

      goToNextQuestion: () =>
        set((state) => ({
          currentIndex: state.currentIndex + 1,
          selectedAnswer: "",
          isAnswered: false,
          isCorrect: null,
        })),

      clearSession: () =>
        set({
          ...initialSession,
        }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "nmt-practice-session",

      partialize: (state) => ({
        questions: state.questions,
        currentIndex: state.currentIndex,
        selectedAnswer: state.selectedAnswer,
        isAnswered: state.isAnswered,
        isCorrect: state.isCorrect,
        correctAnswersCount: state.correctAnswersCount,
        startedAt: state.startedAt,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
