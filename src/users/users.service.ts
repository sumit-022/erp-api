import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: RegisterDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      select: {
        password: false,
      },
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async removeAll(magicWord: string) {
    if (magicWord === 'please') {
      await this.prisma.company.deleteMany();
      return await this.prisma.user.deleteMany();
    } else {
      throw new Error('Magic word is incorrect');
    }
  }

  async usernameExists(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return !!user;
  }
}
