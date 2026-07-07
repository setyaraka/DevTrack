import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GenerateReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReportData(userId: string, dto: GenerateReportDto) {
    const start = new Date(dto.startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(dto.endDate);
    end.setUTCHours(23, 59, 59, 999);

    const result: any = {
      startDate: dto.startDate,
      endDate: dto.endDate,
    };

    const promises = [];

    if (dto.sections.includes('tasks')) {
      promises.push(
        this.prisma.dailyTask
          .findMany({
            where: { userId, date: { gte: start, lte: end } },
            orderBy: { date: 'asc' },
          })
          .then((data) => (result.tasks = data)),
      );
    }

    if (dto.sections.includes('workLogs')) {
      promises.push(
        this.prisma.workLog
          .findMany({
            where: { userId, date: { gte: start, lte: end } },
            orderBy: { date: 'asc' },
          })
          .then((data) => (result.workLogs = data)),
      );
    }

    if (dto.sections.includes('learnings')) {
      promises.push(
        this.prisma.learning
          .findMany({
            where: { userId, createdAt: { gte: start, lte: end } },
            orderBy: { createdAt: 'asc' },
          })
          .then((data) => (result.learnings = data)),
      );
    }

    if (dto.sections.includes('achievements')) {
      promises.push(
        this.prisma.achievement
          .findMany({
            where: { userId, date: { gte: start, lte: end } },
            orderBy: { date: 'asc' },
          })
          .then((data) => (result.achievements = data)),
      );
    }

    if (dto.sections.includes('challenges')) {
      promises.push(
        this.prisma.challenge
          .findMany({
            where: { userId, date: { gte: start, lte: end } },
            orderBy: { date: 'asc' },
          })
          .then((data) => (result.challenges = data)),
      );
    }

    if (dto.sections.includes('feedback')) {
      promises.push(
        this.prisma.feedback
          .findMany({
            where: { userId, date: { gte: start, lte: end } },
            orderBy: { date: 'asc' },
          })
          .then((data) => (result.feedback = data)),
      );
    }

    await Promise.all(promises);
    return result;
  }
}
