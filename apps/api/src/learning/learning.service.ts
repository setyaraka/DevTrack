import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLearningDto, UpdateLearningDto } from './dto/learning.dto';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.learning.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateLearningDto) {
    return this.prisma.learning.create({
      data: {
        topic: dto.topic,
        description: dto.description,
        understandingLevel: dto.understandingLevel,
        tags: dto.tags || [],
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateLearningDto) {
    const learning = await this.prisma.learning.findFirst({
      where: { id, userId },
    });
    if (!learning) {
      throw new NotFoundException('Learning record not found');
    }

    const data: any = {};
    if (dto.topic !== undefined) data.topic = dto.topic;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.understandingLevel !== undefined) data.understandingLevel = dto.understandingLevel;
    if (dto.tags !== undefined) data.tags = dto.tags;

    return this.prisma.learning.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const learning = await this.prisma.learning.findFirst({
      where: { id, userId },
    });
    if (!learning) {
      throw new NotFoundException('Learning record not found');
    }

    await this.prisma.learning.delete({
      where: { id },
    });
    return { success: true };
  }
}
