import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(userId: string) {
    return this.prisma.achievement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateAchievementDto) {
    const date = this.normalizeDate(dto.date);
    return this.prisma.achievement.create({
      data: {
        situation: dto.situation,
        task: dto.task,
        action: dto.action,
        result: dto.result,
        impact: dto.impact,
        category: dto.category,
        date,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findFirst({
      where: { id, userId },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const data: any = {};
    if (dto.situation !== undefined) data.situation = dto.situation;
    if (dto.task !== undefined) data.task = dto.task;
    if (dto.action !== undefined) data.action = dto.action;
    if (dto.result !== undefined) data.result = dto.result;
    if (dto.impact !== undefined) data.impact = dto.impact;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.date !== undefined) data.date = this.normalizeDate(dto.date);

    return this.prisma.achievement.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const achievement = await this.prisma.achievement.findFirst({
      where: { id, userId },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    await this.prisma.achievement.delete({
      where: { id },
    });
    return { success: true };
  }
}
