import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { UpdateProfileDto, UpdateAppearanceDto, UpdateWorkPreferencesDto, UpdatePasswordDto } from './dto/settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getSettings(user.sub);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(user.sub, dto);
  }

  @Patch('appearance')
  async updateAppearance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAppearanceDto,
  ) {
    return this.settingsService.updateAppearance(user.sub, dto);
  }

  @Patch('work-preferences')
  async updateWorkPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateWorkPreferencesDto,
  ) {
    return this.settingsService.updateWorkPreferences(user.sub, dto);
  }

  @Patch('password')
  async updatePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.settingsService.updatePassword(user.sub, dto);
  }
}
