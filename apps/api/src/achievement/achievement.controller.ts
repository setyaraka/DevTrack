import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';

@ApiTags('achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  async getAchievements(@CurrentUser() user: AuthenticatedUser) {
    return this.achievementService.findAll(user.sub);
  }

  @Post()
  async createAchievement(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAchievementDto,
  ) {
    return this.achievementService.create(user.sub, dto);
  }

  @Patch(':id')
  async updateAchievement(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAchievementDto,
  ) {
    return this.achievementService.update(user.sub, id, dto);
  }

  @Delete(':id')
  async deleteAchievement(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.achievementService.delete(user.sub, id);
  }
}
