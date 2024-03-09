import {
  Controller,
  Body,
  Post,
  ForbiddenException,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    try {
      const data = await this.authService.register(dto);
      res.cookie('token', data.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 * 1000,
      });
      return res.json({ message: 'User registered successfully' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        } else {
          throw new ForbiddenException('Something went wrong');
        }
      }
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(dto);
      res.cookie('token', data.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 * 1000,
      });
      return res.json({ message: 'User logged in successfully' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Invalid email or password');
        } else {
          throw new ForbiddenException('Something went wrong');
        }
      }
    }
  }

  @Post('vaidate')
  async validate(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.validateAccessToken(
        req.cookies.token,
      );
      return res.json({ data });
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
