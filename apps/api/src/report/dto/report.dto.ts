import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  sections: string[];
}
