import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SessionType } from '@prisma/client';

export class StartSessionDto {
  @IsOptional()
  @IsEnum(SessionType)
  type?: SessionType;

  @IsOptional()
  @IsString()
  taskId?: string;
}
