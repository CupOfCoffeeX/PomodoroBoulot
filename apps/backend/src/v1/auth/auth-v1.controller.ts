import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/types';

@Controller('api/v1/auth')
export class AuthV1Controller {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  // Open self-registration — returns token for immediate auto-login
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.registerAndSign(dto.username, dto.password);
  }

  // Admin-only account creation with role selection
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
