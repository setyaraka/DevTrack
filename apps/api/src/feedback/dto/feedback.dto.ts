import { FeedbackCategory } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  reviewer: string;

  @IsString()
  @IsNotEmpty()
  feedback: string;

  @IsEnum(FeedbackCategory)
  @IsNotEmpty()
  category: FeedbackCategory;

  @IsBoolean()
  @IsOptional()
  applied?: boolean;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class UpdateFeedbackDto {
  @IsString()
  @IsOptional()
  reviewer?: string;

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsEnum(FeedbackCategory)
  @IsOptional()
  category?: FeedbackCategory;

  @IsBoolean()
  @IsOptional()
  applied?: boolean;

  @IsDateString()
  @IsOptional()
  date?: string;
}
