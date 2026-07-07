import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { GetWeeklyReviewQueryDto, UpsertWeeklyReviewDto } from './dto/weekly-review.dto';
import { WeeklyReviewService } from './weekly-review.service';

@ApiTags('weekly-reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weekly-reviews')
export class WeeklyReviewController {
  constructor(private readonly weeklyReviewService: WeeklyReviewService) {}

  @Get()
  async getWeeklyReview(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetWeeklyReviewQueryDto,
  ) {
    const review = await this.weeklyReviewService.findOne(user.sub, query.weekStart);
    return review || { biggestWin: '', biggestChallenge: '', lessonsLearned: '', nextWeekGoals: '' };
  }

  @Post()
  async upsertWeeklyReview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertWeeklyReviewDto,
  ) {
    return this.weeklyReviewService.upsert(user.sub, dto);
  }
}
