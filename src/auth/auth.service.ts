import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.identifier,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: RegisterDto) {
    const { name, username, email, gender } = data;
    const password = await hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        username,
        email,
        gender,
        password,
      },
    });
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        ignoreExpiration: false,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
