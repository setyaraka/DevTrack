import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DailyJournalModule } from './daily-journal/daily-journal.module';
import { DailyTaskModule } from './daily-task/daily-task.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    DailyJournalModule,
    DailyTaskModule,
  ],
})
export class AppModule {}

