import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Question } from "@/types/question";

interface PracticeSessionStore {
  sessionId: string | null;

  questions: Question[];
  currentIndex: number;

  selectedAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean | null;

  correctAnswersCount: number;

  startedAt: number | null;
  currentQuestionStartedAt: number | null;

  hasHydrated: boolean;

  setQuestions: (questions: Question[]) => void;

  setSessionId: (sessionId: string) => void;

  setAnswerResult: (answer: string, isCorrect: boolean) => void;

  incrementCorrectAnswers: () => void;

  goToNextQuestion: () => void;

  clearSession: () => void;

  setHasHydrated: (value: boolean) => void;
}

const initialSession = {
  sessionId: null,

  questions: [],
  currentIndex: 0,

  selectedAnswer: "",
  isAnswered: false,
  isCorrect: null,

  correctAnswersCount: 0,

  startedAt: null,
  currentQuestionStartedAt: null,
};

export const usePracticeSessionStore = create<PracticeSessionStore>()(
  persist(
    (set) => ({
      ...initialSession,

      hasHydrated: false,

      setQuestions: (questions) =>
        set((state) => ({
          ...initialSession,

          sessionId: state.sessionId,

          questions,

          startedAt: Date.now(),
          currentQuestionStartedAt: Date.now(),
        })),

      setSessionId: (sessionId) => set({ sessionId }),

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

          currentQuestionStartedAt: Date.now(),
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
        sessionId: state.sessionId,

        questions: state.questions,
        currentIndex: state.currentIndex,

        selectedAnswer: state.selectedAnswer,

        isAnswered: state.isAnswered,

        isCorrect: state.isCorrect,

        correctAnswersCount: state.correctAnswersCount,

        startedAt: state.startedAt,

        currentQuestionStartedAt: state.currentQuestionStartedAt,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
