import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;
}

export class UpdateAppearanceDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['LIGHT', 'DARK', 'SYSTEM'])
  theme: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['EXPANDED', 'COLLAPSED'])
  sidebarMode: string;
}

export class UpdateWorkPreferencesDto {
  @IsArray()
  @IsString({ each: true })
  workingDays: string[];

  @IsBoolean()
  autoTaskRollover: boolean;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Rollover time must be in HH:MM format' })
  rolloverTime: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50, { message: 'New password must be between 6 and 50 characters' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
