import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { DailyTaskService } from './daily-task.service';
import { CreateTaskDto, GetTasksQueryDto, RolloverDto, UpdateTaskDto } from './dto/daily-task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class DailyTaskController {
  constructor(private readonly dailyTaskService: DailyTaskService) {}

  @Get()
  async getTasks(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetTasksQueryDto,
  ) {
    return this.dailyTaskService.findAll(user.sub, query.date);
  }

  @Post()
  async createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTaskDto,
  ) {
    return this.dailyTaskService.create(user.sub, dto);
  }

  @Patch(':id')
  async updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.dailyTaskService.update(user.sub, id, dto);
  }

  @Delete(':id')
  async deleteTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.dailyTaskService.delete(user.sub, id);
  }

  @Post('rollover')
  async rolloverTasks(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RolloverDto,
  ) {
    return this.dailyTaskService.rollover(user.sub, dto.targetDate);
  }
}
