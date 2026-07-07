import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto/challenge.dto';

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  async getChallenges(@CurrentUser() user: AuthenticatedUser) {
    return this.challengeService.findAll(user.sub);
  }

  @Post()
  async createChallenge(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateChallengeDto,
  ) {
    return this.challengeService.create(user.sub, dto);
  }

  @Patch(':id')
  async updateChallenge(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateChallengeDto,
  ) {
    return this.challengeService.update(user.sub, id, dto);
  }

  @Delete(':id')
  async deleteChallenge(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.challengeService.delete(user.sub, id);
  }
}
