import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkLogDto, UpdateWorkLogDto } from './dto/work-log.dto';

@Injectable()
export class WorkLogService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(userId: string) {
    return this.prisma.workLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateWorkLogDto) {
    const date = this.normalizeDate(dto.date);
    return this.prisma.workLog.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        date,
        impact: dto.impact,
        relatedPr: dto.relatedPr,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateWorkLogDto) {
    const workLog = await this.prisma.workLog.findFirst({
      where: { id, userId },
    });
    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.date !== undefined) data.date = this.normalizeDate(dto.date);
    if (dto.impact !== undefined) data.impact = dto.impact;
    if (dto.relatedPr !== undefined) data.relatedPr = dto.relatedPr;

    return this.prisma.workLog.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const workLog = await this.prisma.workLog.findFirst({
      where: { id, userId },
    });
    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    await this.prisma.workLog.delete({
      where: { id },
    });
    return { success: true };
  }
}
