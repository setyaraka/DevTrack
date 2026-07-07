import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpsertMonthlyReviewDto } from './dto/monthly-review.dto';

@Injectable()
export class MonthlyReviewService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findOne(userId: string, monthStartStr: string) {
    const monthStart = this.normalizeDate(monthStartStr);
    return this.prisma.monthlyReview.findUnique({
      where: {
        userId_monthStart: {
          userId,
          monthStart,
        },
      },
    });
  }

  async upsert(userId: string, dto: UpsertMonthlyReviewDto) {
    const monthStart = this.normalizeDate(dto.monthStart);
    return this.prisma.monthlyReview.upsert({
      where: {
        userId_monthStart: {
          userId,
          monthStart,
        },
      },
      update: {
        summary: dto.summary,
        reflection: dto.reflection,
        managerFeedback: dto.managerFeedback,
        personalNotes: dto.personalNotes,
      },
      create: {
        userId,
        monthStart,
        summary: dto.summary,
        reflection: dto.reflection,
        managerFeedback: dto.managerFeedback,
        personalNotes: dto.personalNotes,
      },
    });
  }
}
