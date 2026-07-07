import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkLogController } from './work-log.controller';
import { WorkLogService } from './work-log.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkLogController],
  providers: [WorkLogService],
  exports: [WorkLogService],
})
export class WorkLogModule {}
