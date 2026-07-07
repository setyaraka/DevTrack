import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DailyJournalController } from './daily-journal.controller';
import { DailyJournalService } from './daily-journal.service';

@Module({
  imports: [AuthModule],
  controllers: [DailyJournalController],
  providers: [DailyJournalService],
  exports: [DailyJournalService],
})
export class DailyJournalModule {}
