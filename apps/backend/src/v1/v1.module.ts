import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthV1Controller } from './auth/auth-v1.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthV1Controller],
})
export class V1Module {}
