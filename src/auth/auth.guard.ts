import {
  UnauthorizedException,
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.cookies.token;
    if (!token) {
      return false;
    }
    try {
      const user = await this.authService.validateAccessToken(token);
      req.user = { id: user.id, email: user.email };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
