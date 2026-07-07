import { apiClient } from './client';

export interface DashboardStats {
  cards: {
    totalTasks: number;
    completedTasks: number;
    completionRate: string;
    bugsSolved: number;
    featuresDelivered: number;
    improvements: number;
    documentationCreated: number;
    learningTopics: number;
    achievements: number;
    challenges: number;
    feedbackReceived: number;
  };
  charts: {
    weeklyProductivity: Array<{ day: string; completed: number; total: number }>;
    categoryDistribution: Array<{ category: string; count: number }>;
    taskCompletionTrend: Array<{ date: string; completed: number; total: number }>;
    learningProgress: Array<{ level: string; count: number }>;
  };
}

export const dashboardApi = {
  getStats() {
    return apiClient.get<DashboardStats>('/dashboard').then((res) => res.data);
  },
};
