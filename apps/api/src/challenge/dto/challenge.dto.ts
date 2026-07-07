import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  problem: string;

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsString()
  @IsOptional()
  lessonsLearned?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class UpdateChallengeDto {
  @IsString()
  @IsOptional()
  problem?: string;

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsString()
  @IsOptional()
  lessonsLearned?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
