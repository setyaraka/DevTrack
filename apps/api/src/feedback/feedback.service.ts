import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(userId: string) {
    return this.prisma.feedback.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateFeedbackDto) {
    const date = this.normalizeDate(dto.date);
    return this.prisma.feedback.create({
      data: {
        reviewer: dto.reviewer,
        feedback: dto.feedback,
        category: dto.category,
        applied: dto.applied ?? false,
        date,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.findFirst({
      where: { id, userId },
    });
    if (!feedback) {
      throw new NotFoundException('Feedback record not found');
    }

    const data: any = {};
    if (dto.reviewer !== undefined) data.reviewer = dto.reviewer;
    if (dto.feedback !== undefined) data.feedback = dto.feedback;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.applied !== undefined) data.applied = dto.applied;
    if (dto.date !== undefined) data.date = this.normalizeDate(dto.date);

    return this.prisma.feedback.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const feedback = await this.prisma.feedback.findFirst({
      where: { id, userId },
    });
    if (!feedback) {
      throw new NotFoundException('Feedback record not found');
    }

    await this.prisma.feedback.delete({
      where: { id },
    });
    return { success: true };
  }
}
