import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertWeeklyReviewDto {
  @IsDateString()
  @IsNotEmpty()
  weekStart: string;

  @IsString()
  @IsOptional()
  biggestWin?: string;

  @IsString()
  @IsOptional()
  biggestChallenge?: string;

  @IsString()
  @IsOptional()
  lessonsLearned?: string;

  @IsString()
  @IsOptional()
  nextWeekGoals?: string;
}

export class GetWeeklyReviewQueryDto {
  @IsDateString()
  @IsNotEmpty()
  weekStart: string;
}
