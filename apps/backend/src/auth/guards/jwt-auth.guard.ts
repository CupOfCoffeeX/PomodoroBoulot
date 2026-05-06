import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
    const token = this.extractToken(request.headers['authorization']);
    if (!token) throw new UnauthorizedException('Token manquant');
    try {
      request.user = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
    return true;
  }

  private extractToken(authorization?: string): string | null {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
