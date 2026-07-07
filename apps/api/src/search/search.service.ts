import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(
    userId: string,
    q: string,
    startDateStr?: string,
    endDateStr?: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;
    const searchString = q ? q.trim() : '';

    const dateFilter = (field = 'date') => {
      const filter: any = {};
      if (startDateStr) {
        const start = new Date(startDateStr);
        start.setUTCHours(0, 0, 0, 0);
        filter.gte = start;
      }
      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setUTCHours(23, 59, 59, 999);
        filter.lte = end;
      }
      return Object.keys(filter).length > 0 ? { [field]: filter } : {};
    };

    // Query tasks
    const tasksPromise = this.prisma.dailyTask.findMany({
      where: {
        userId,
        title: { contains: searchString, mode: 'insensitive' },
        ...dateFilter('date'),
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    // Query work logs
    const workLogsPromise = this.prisma.workLog.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchString, mode: 'insensitive' } },
          { description: { contains: searchString, mode: 'insensitive' } },
        ],
        ...dateFilter('date'),
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    // Query learnings (createdDate or createdAt)
    const learningsPromise = this.prisma.learning.findMany({
      where: {
        userId,
        OR: [
          { topic: { contains: searchString, mode: 'insensitive' } },
          { description: { contains: searchString, mode: 'insensitive' } },
        ],
        ...dateFilter('createdAt'),
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Query achievements
    const achievementsPromise = this.prisma.achievement.findMany({
      where: {
        userId,
        OR: [
          { situation: { contains: searchString, mode: 'insensitive' } },
          { task: { contains: searchString, mode: 'insensitive' } },
          { action: { contains: searchString, mode: 'insensitive' } },
          { result: { contains: searchString, mode: 'insensitive' } },
          { impact: { contains: searchString, mode: 'insensitive' } },
        ],
        ...dateFilter('date'),
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    // Query challenges
    const challengesPromise = this.prisma.challenge.findMany({
      where: {
        userId,
        OR: [
          { problem: { contains: searchString, mode: 'insensitive' } },
          { rootCause: { contains: searchString, mode: 'insensitive' } },
          { solution: { contains: searchString, mode: 'insensitive' } },
          { result: { contains: searchString, mode: 'insensitive' } },
        ],
        ...dateFilter('date'),
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    // Query feedback
    const feedbackPromise = this.prisma.feedback.findMany({
      where: {
        userId,
        OR: [
          { reviewer: { contains: searchString, mode: 'insensitive' } },
          { feedback: { contains: searchString, mode: 'insensitive' } },
        ],
        ...dateFilter('date'),
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    const [tasks, workLogs, learnings, achievements, challenges, feedback] = await Promise.all([
      tasksPromise,
      workLogsPromise,
      learningsPromise,
      achievementsPromise,
      challengesPromise,
      feedbackPromise,
    ]);

    return {
      tasks,
      workLogs,
      learnings,
      achievements,
      challenges,
      feedback,
    };
  }
}
