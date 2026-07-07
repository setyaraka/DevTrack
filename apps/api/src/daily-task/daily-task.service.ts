import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/daily-task.dto';

@Injectable()
export class DailyTaskService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(userId: string, dateStr: string) {
    const date = this.normalizeDate(dateStr);
    return this.prisma.dailyTask.findMany({
      where: {
        userId,
        date,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async create(userId: string, dto: CreateTaskDto) {
    const date = this.normalizeDate(dto.date);
    const dueDate = dto.dueDate ? this.normalizeDate(dto.dueDate) : null;

    // Find matching journal
    const journal = await this.prisma.dailyJournal.findUnique({
      where: {
        userId_date: { userId, date },
      },
    });

    // Get max order
    const maxOrderTask = await this.prisma.dailyTask.findFirst({
      where: { userId, date },
      orderBy: { order: 'desc' },
    });
    const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

    return this.prisma.dailyTask.create({
      data: {
        title: dto.title,
        priority: dto.priority || 'MEDIUM',
        date,
        dueDate,
        order: nextOrder,
        userId,
        journalId: journal ? journal.id : null,
      },
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.dailyTask.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.completed !== undefined) data.completed = dto.completed;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.dueDate !== undefined) {
      data.dueDate = dto.dueDate ? this.normalizeDate(dto.dueDate) : null;
    }

    return this.prisma.dailyTask.update({
      where: { id: taskId },
      data,
    });
  }

  async delete(userId: string, taskId: string) {
    const task = await this.prisma.dailyTask.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.dailyTask.delete({
      where: { id: taskId },
    });
    return { success: true };
  }

  async rollover(userId: string, targetDateStr: string) {
    const targetDate = this.normalizeDate(targetDateStr);

    // Find the most recent date before targetDate that has incomplete tasks
    const lastActiveTask = await this.prisma.dailyTask.findFirst({
      where: {
        userId,
        date: {
          lt: targetDate,
        },
        completed: false,
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (!lastActiveTask) {
      return { rolledOverCount: 0 };
    }

    const sourceDate = lastActiveTask.date;

    // Get all incomplete tasks on that sourceDate
    const incompleteTasks = await this.prisma.dailyTask.findMany({
      where: {
        userId,
        date: sourceDate,
        completed: false,
      },
    });

    if (incompleteTasks.length === 0) {
      return { rolledOverCount: 0 };
    }

    // Check if any of these have already been rolled over to targetDate
    const existingRollovers = await this.prisma.dailyTask.findMany({
      where: {
        userId,
        date: targetDate,
        rolledOverFromId: {
          in: incompleteTasks.map((t) => t.id),
        },
      },
      select: {
        rolledOverFromId: true,
      },
    });

    const alreadyRolledOverIds = new Set(
      existingRollovers
        .map((r) => r.rolledOverFromId)
        .filter((id): id is string => id !== null)
    );

    const tasksToRollover = incompleteTasks.filter(
      (t) => !alreadyRolledOverIds.has(t.id)
    );

    if (tasksToRollover.length === 0) {
      return { rolledOverCount: 0 };
    }

    // Find target journal if exists
    const targetJournal = await this.prisma.dailyJournal.findUnique({
      where: {
        userId_date: { userId, date: targetDate },
      },
    });

    // Get current max order on targetDate
    const maxOrderTask = await this.prisma.dailyTask.findFirst({
      where: { userId, date: targetDate },
      orderBy: { order: 'desc' },
    });
    let nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const createdTasks = [];
    for (const task of tasksToRollover) {
      const newTask = await this.prisma.dailyTask.create({
        data: {
          title: task.title,
          priority: task.priority,
          date: targetDate,
          dueDate: task.dueDate,
          order: nextOrder++,
          userId,
          rolledOverFromId: task.id,
          journalId: targetJournal ? targetJournal.id : null,
        },
      });
      createdTasks.push(newTask);
    }

    return {
      rolledOverCount: createdTasks.length,
      tasks: createdTasks,
    };
  }
}
