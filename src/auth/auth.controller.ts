import { Controller, Body, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(dto);
    res.cookie('token', data.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    return res.json({
      message: 'User registered successfully',
      user: data.user,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    res.cookie('token', data.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    return res.json({
      message: 'User logged in successfully',
      user: data.user,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'User logged out successfully' });
  }

  @Post('validate')
  async validate(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.validateAccessToken(req.cookies.token);
    return res.json({ data });
  }
}
