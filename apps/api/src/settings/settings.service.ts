import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto, UpdateAppearanceDto, UpdateWorkPreferencesDto, UpdatePasswordDto } from './dto/settings.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateSettings(userId: string) {
    let settings = await this.prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          userId,
          theme: 'SYSTEM',
          sidebarMode: 'EXPANDED',
          workingDays: JSON.stringify(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
          autoTaskRollover: false,
          rolloverTime: '00:00',
          timezone: 'UTC',
        },
      });
    }

    return settings;
  }

  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const settings = await this.getOrCreateSettings(userId);

    // Safely parse workingDays JSON
    let workingDays: string[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    try {
      if (typeof settings.workingDays === 'string') {
        workingDays = JSON.parse(settings.workingDays);
      } else if (Array.isArray(settings.workingDays)) {
        workingDays = settings.workingDays as string[];
      }
    } catch {
      // fallback
    }

    return {
      profile: {
        avatarUrl: user.avatarUrl || '',
        name: user.name,
        email: user.email,
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        timezone: settings.timezone,
      },
      appearance: {
        theme: settings.theme,
        sidebarMode: settings.sidebarMode,
      },
      workPreferences: {
        workingDays,
        autoTaskRollover: settings.autoTaskRollover,
        rolloverTime: settings.rolloverTime,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatarUrl: dto.avatarUrl || null,
        company: dto.company || null,
        jobTitle: dto.jobTitle || null,
      },
    });

    const settings = await this.getOrCreateSettings(userId);
    await this.prisma.settings.update({
      where: { id: settings.id },
      data: { timezone: dto.timezone },
    });

    return this.getSettings(userId);
  }

  async updateAppearance(userId: string, dto: UpdateAppearanceDto) {
    const settings = await this.getOrCreateSettings(userId);
    await this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        theme: dto.theme,
        sidebarMode: dto.sidebarMode,
      },
    });

    return this.getSettings(userId);
  }

  async updateWorkPreferences(userId: string, dto: UpdateWorkPreferencesDto) {
    const settings = await this.getOrCreateSettings(userId);
    await this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        workingDays: dto.workingDays,
        autoTaskRollover: dto.autoTaskRollover,
        rolloverTime: dto.rolloverTime,
      },
    });

    return this.getSettings(userId);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }
}
