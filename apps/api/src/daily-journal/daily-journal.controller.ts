import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { DailyJournalService } from './daily-journal.service';
import { GetJournalQueryDto, UpsertJournalDto } from './dto/daily-journal.dto';

@ApiTags('journals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('journals')
export class DailyJournalController {
  constructor(private readonly dailyJournalService: DailyJournalService) {}

  @Get()
  async getJournal(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetJournalQueryDto,
  ) {
    const journal = await this.dailyJournalService.findOne(user.sub, query.date);
    return journal || { reflection: '', summary: '', notes: '' };
  }

  @Post()
  async upsertJournal(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertJournalDto,
  ) {
    return this.dailyJournalService.upsert(user.sub, dto);
  }
}
