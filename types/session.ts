export type SessionStatus = "planned" | "in-progress" | "completed";

export interface Session {
  id: string;

  userId: string;

  themeIds: string[];

  startedAt: number;

  finishedAt: number | null;

  plannedTasksCount: number;

  completedTasksCount: number;

  correctAnswersCount: number;

  accuracy: number | null;

  totalTime: number | null;

  averageTime: number | null;

  status: SessionStatus;
}
