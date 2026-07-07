import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpsertWeeklyReviewDto } from './dto/weekly-review.dto';

@Injectable()
export class WeeklyReviewService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findOne(userId: string, weekStartStr: string) {
    const weekStart = this.normalizeDate(weekStartStr);
    return this.prisma.weeklyReview.findUnique({
      where: {
        userId_weekStart: {
          userId,
          weekStart,
        },
      },
    });
  }

  async upsert(userId: string, dto: UpsertWeeklyReviewDto) {
    const weekStart = this.normalizeDate(dto.weekStart);
    return this.prisma.weeklyReview.upsert({
      where: {
        userId_weekStart: {
          userId,
          weekStart,
        },
      },
      update: {
        biggestWin: dto.biggestWin,
        biggestChallenge: dto.biggestChallenge,
        lessonsLearned: dto.lessonsLearned,
        nextWeekGoals: dto.nextWeekGoals,
      },
      create: {
        userId,
        weekStart,
        biggestWin: dto.biggestWin,
        biggestChallenge: dto.biggestChallenge,
        lessonsLearned: dto.lessonsLearned,
        nextWeekGoals: dto.nextWeekGoals,
      },
    });
  }
}
