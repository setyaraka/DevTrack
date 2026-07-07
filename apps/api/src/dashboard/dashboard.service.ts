import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const [
      totalTasks,
      completedTasks,
      bugsSolved,
      featuresDelivered,
      improvements,
      documentationCreated,
      learningTopics,
      achievements,
      challenges,
      feedbackReceived,
    ] = await Promise.all([
      this.prisma.dailyTask.count({ where: { userId } }),
      this.prisma.dailyTask.count({ where: { userId, completed: true } }),
      this.prisma.workLog.count({ where: { userId, category: 'BUG' } }),
      this.prisma.workLog.count({ where: { userId, category: 'FEATURE' } }),
      this.prisma.workLog.count({ where: { userId, category: 'IMPROVEMENT' } }),
      this.prisma.workLog.count({ where: { userId, category: 'DOCUMENTATION' } }),
      this.prisma.learning.count({ where: { userId } }),
      this.prisma.achievement.count({ where: { userId } }),
      this.prisma.challenge.count({ where: { userId } }),
      this.prisma.feedback.count({ where: { userId } }),
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 1. Weekly Productivity: completed vs total tasks for the last 7 days
    const weeklyDataRaw = await this.prisma.dailyTask.groupBy({
      by: ['date', 'completed'],
      where: {
        userId,
        date: { gte: sevenDaysAgo },
      },
      _count: true,
    });

    const weeklyProductivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
      
      const matchTotal = weeklyDataRaw
        .filter((w) => w.date.getTime() === d.getTime())
        .reduce((sum, curr) => sum + curr._count, 0);

      const matchCompleted = weeklyDataRaw
        .filter((w) => w.date.getTime() === d.getTime() && w.completed === true)
        .reduce((sum, curr) => sum + curr._count, 0);

      weeklyProductivity.push({
        day: dayLabel,
        completed: matchCompleted,
        total: matchTotal,
      });
    }

    // 2. Category Distribution: Work log counts by category
    const workLogsGrouped = await this.prisma.workLog.groupBy({
      by: ['category'],
      where: { userId },
      _count: true,
    });

    const categoryDistribution = workLogsGrouped.map((item) => ({
      category: item.category,
      count: item._count,
    }));

    // 3. Task Completion Trend: Last 15 days completion rate trend
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);
    fifteenDaysAgo.setUTCHours(0, 0, 0, 0);

    const trendDataRaw = await this.prisma.dailyTask.groupBy({
      by: ['date', 'completed'],
      where: {
        userId,
        date: { gte: fifteenDaysAgo },
      },
      _count: true,
    });

    const taskCompletionTrend = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setUTCHours(0, 0, 0, 0);

      const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      const matchTotal = trendDataRaw
        .filter((t) => t.date.getTime() === d.getTime())
        .reduce((sum, curr) => sum + curr._count, 0);

      const matchCompleted = trendDataRaw
        .filter((t) => t.date.getTime() === d.getTime() && t.completed === true)
        .reduce((sum, curr) => sum + curr._count, 0);

      taskCompletionTrend.push({
        date: dateLabel,
        completed: matchCompleted,
        total: matchTotal,
      });
    }

    // 4. Learning Progress: Learnings by understandingLevel
    const learningGrouped = await this.prisma.learning.groupBy({
      by: ['understandingLevel'],
      where: { userId },
      _count: true,
    });

    const learningProgress = learningGrouped.map((item) => ({
      level: `Level ${item.understandingLevel}`,
      count: item._count,
    }));

    return {
      userId,
      cards: {
        totalTasks,
        completedTasks,
        completionRate: `${completionRate}%`,
        bugsSolved,
        featuresDelivered,
        improvements,
        documentationCreated,
        learningTopics,
        achievements,
        challenges,
        feedbackReceived,
      },
      charts: {
        weeklyProductivity,
        categoryDistribution,
        taskCompletionTrend,
        learningProgress,
      },
    };
  }
}
