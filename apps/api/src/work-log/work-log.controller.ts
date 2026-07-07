import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateWorkLogDto, UpdateWorkLogDto } from './dto/work-log.dto';
import { WorkLogService } from './work-log.service';

@ApiTags('work-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('work-logs')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Get()
  async getWorkLogs(@CurrentUser() user: AuthenticatedUser) {
    return this.workLogService.findAll(user.sub);
  }

  @Post()
  async createWorkLog(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkLogDto,
  ) {
    return this.workLogService.create(user.sub, dto);
  }

  @Patch(':id')
  async updateWorkLog(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWorkLogDto,
  ) {
    return this.workLogService.update(user.sub, id, dto);
  }

  @Delete(':id')
  async deleteWorkLog(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.workLogService.delete(user.sub, id);
  }
}
