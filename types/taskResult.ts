export interface TaskResult {
  id: string;

  userId: string;
  sessionId: string;

  taskId: string;
  themeId: string;

  answer: string;
  isCorrect: boolean;

  responseTime: number;
  answeredAt: number;
}
