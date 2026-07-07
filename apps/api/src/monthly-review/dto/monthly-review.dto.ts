import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertMonthlyReviewDto {
  @IsDateString()
  @IsNotEmpty()
  monthStart: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  reflection?: string;

  @IsString()
  @IsOptional()
  managerFeedback?: string;

  @IsString()
  @IsOptional()
  personalNotes?: string;
}

export class GetMonthlyReviewQueryDto {
  @IsDateString()
  @IsNotEmpty()
  monthStart: string;
}
