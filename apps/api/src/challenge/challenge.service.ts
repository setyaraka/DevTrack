import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto/challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(userId: string) {
    return this.prisma.challenge.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateChallengeDto) {
    const date = this.normalizeDate(dto.date);
    return this.prisma.challenge.create({
      data: {
        problem: dto.problem,
        rootCause: dto.rootCause,
        solution: dto.solution,
        result: dto.result,
        lessonsLearned: dto.lessonsLearned,
        date,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateChallengeDto) {
    const challenge = await this.prisma.challenge.findFirst({
      where: { id, userId },
    });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const data: any = {};
    if (dto.problem !== undefined) data.problem = dto.problem;
    if (dto.rootCause !== undefined) data.rootCause = dto.rootCause;
    if (dto.solution !== undefined) data.solution = dto.solution;
    if (dto.result !== undefined) data.result = dto.result;
    if (dto.lessonsLearned !== undefined) data.lessonsLearned = dto.lessonsLearned;
    if (dto.date !== undefined) data.date = this.normalizeDate(dto.date);

    return this.prisma.challenge.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const challenge = await this.prisma.challenge.findFirst({
      where: { id, userId },
    });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    await this.prisma.challenge.delete({
      where: { id },
    });
    return { success: true };
  }
}
