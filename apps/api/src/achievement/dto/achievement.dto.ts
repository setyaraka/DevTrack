import { AchievementCategory } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  situation: string;

  @IsString()
  @IsNotEmpty()
  task: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  result: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsEnum(AchievementCategory)
  @IsNotEmpty()
  category: AchievementCategory;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class UpdateAchievementDto {
  @IsString()
  @IsOptional()
  situation?: string;

  @IsString()
  @IsOptional()
  task?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsEnum(AchievementCategory)
  @IsOptional()
  category?: AchievementCategory;

  @IsDateString()
  @IsOptional()
  date?: string;
}
