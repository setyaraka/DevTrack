import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateLearningDto, UpdateLearningDto } from './dto/learning.dto';
import { LearningService } from './learning.service';

@ApiTags('learnings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('learnings')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get()
  async getLearnings(@CurrentUser() user: AuthenticatedUser) {
    return this.learningService.findAll(user.sub);
  }

  @Post()
  async createLearning(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLearningDto,
  ) {
    return this.learningService.create(user.sub, dto);
  }

  @Patch(':id')
  async updateLearning(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLearningDto,
  ) {
    return this.learningService.update(user.sub, id, dto);
  }

  @Delete(':id')
  async deleteLearning(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.learningService.delete(user.sub, id);
  }
}
