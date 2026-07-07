import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { GetMonthlyReviewQueryDto, UpsertMonthlyReviewDto } from './dto/monthly-review.dto';
import { MonthlyReviewService } from './monthly-review.service';

@ApiTags('monthly-reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monthly-reviews')
export class MonthlyReviewController {
  constructor(private readonly monthlyReviewService: MonthlyReviewService) {}

  @Get()
  async getMonthlyReview(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetMonthlyReviewQueryDto,
  ) {
    const review = await this.monthlyReviewService.findOne(user.sub, query.monthStart);
    return review || { summary: '', reflection: '', managerFeedback: '', personalNotes: '' };
  }

  @Post()
  async upsertMonthlyReview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertMonthlyReviewDto,
  ) {
    return this.monthlyReviewService.upsert(user.sub, dto);
  }
}
