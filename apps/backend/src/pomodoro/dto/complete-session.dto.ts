import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CompleteSessionDto {
  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}
