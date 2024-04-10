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
      throw new UnauthorizedException('Account not found');
    }
    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload = { id: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    };
  }

  async register(data: RegisterDto) {
    try {
      const { name, username, email } = data;
      const password = await hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name,
          username,
          email,
          password,
        },
      });
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid data');
    }
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
