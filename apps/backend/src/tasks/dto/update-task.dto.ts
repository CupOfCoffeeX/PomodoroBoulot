import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, Min } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
