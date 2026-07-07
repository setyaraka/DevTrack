import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertJournalDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  reflection?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class GetJournalQueryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
