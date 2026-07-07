import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WeeklyReviewController } from './weekly-review.controller';
import { WeeklyReviewService } from './weekly-review.service';

@Module({
  imports: [AuthModule],
  controllers: [WeeklyReviewController],
  providers: [WeeklyReviewService],
  exports: [WeeklyReviewService],
})
export class WeeklyReviewModule {}
