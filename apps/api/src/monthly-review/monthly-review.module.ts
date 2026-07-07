import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonthlyReviewController } from './monthly-review.controller';
import { MonthlyReviewService } from './monthly-review.service';

@Module({
  imports: [AuthModule],
  controllers: [MonthlyReviewController],
  providers: [MonthlyReviewService],
  exports: [MonthlyReviewService],
})
export class MonthlyReviewModule {}
