import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpsertJournalDto } from './dto/daily-journal.dto';

@Injectable()
export class DailyJournalService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findOne(userId: string, dateStr: string) {
    const date = this.normalizeDate(dateStr);
    return this.prisma.dailyJournal.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }

  async upsert(userId: string, dto: UpsertJournalDto) {
    const date = this.normalizeDate(dto.date);
    return this.prisma.dailyJournal.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        reflection: dto.reflection,
        summary: dto.summary,
        notes: dto.notes,
      },
      create: {
        userId,
        date,
        reflection: dto.reflection,
        summary: dto.summary,
        notes: dto.notes,
      },
    });
  }
}
