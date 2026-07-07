import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AchievementModule } from './achievement/achievement.module';
import { AuthModule } from './auth/auth.module';
import { ChallengeModule } from './challenge/challenge.module';
import { DailyJournalModule } from './daily-journal/daily-journal.module';
import { DailyTaskModule } from './daily-task/daily-task.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LearningModule } from './learning/learning.module';
import { MonthlyReviewModule } from './monthly-review/monthly-review.module';
import { UsersModule } from './users/users.module';
import { WeeklyReviewModule } from './weekly-review/weekly-review.module';
import { WorkLogModule } from './work-log/work-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    DailyJournalModule,
    DailyTaskModule,
    WorkLogModule,
    LearningModule,
    FeedbackModule,
    AchievementModule,
    ChallengeModule,
    WeeklyReviewModule,
    MonthlyReviewModule,
  ],
})
export class AppModule {}

