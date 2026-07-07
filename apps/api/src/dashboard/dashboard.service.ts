import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getOverview(userId: string) {
    return {
      userId,
      cards: {
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        bugsSolved: 0,
        featuresDelivered: 0,
        improvements: 0,
        documentationCreated: 0,
        learningTopics: 0,
        achievements: 0,
        challenges: 0,
        feedbackReceived: 0,
      },
      charts: {
        weeklyProductivity: [],
        monthlyProductivity: [],
        taskCompletionTrend: [],
        learningProgress: [],
        categoryDistribution: [],
      },
    };
  }
}
