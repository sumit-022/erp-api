import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRegisterDto } from './dto/register.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CompanyRegisterDto) {
    const alreadyExists = await this.prisma.company.findUnique({
      where: { email: data.email },
    });
    if (alreadyExists) {
      throw new Error('Company with this email already exists');
    } else {
      return this.prisma.company.create({
        data,
      });
    }
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async getCompanies(
    id: string,
    paginationState: {
      ord: 'desc' | 'asc';
      size: number;
    } & ({ page: number; cursor?: any } | { page?: number; cursor: any }),
  ) {
    const { ord, page, size, cursor } = paginationState;
    const isCursorPagination = cursor !== undefined;
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (size < 1) {
      throw new Error('Size must be greater than 0');
    }
    if (isCursorPagination && page !== undefined) {
      throw new Error('Cursor pagination should not have page');
    }
    if (!isCursorPagination && page === undefined) {
      throw new Error('Page should be provided for page based pagination');
    }

    return this.prisma.company.findMany({
      where: { ownerId: id },
      cursor: isCursorPagination ? { id: cursor } : undefined,
      skip: isCursorPagination ? 0 : (page - 1) * size,
      take: size,
      orderBy: {
        name: ord,
      },
    });
  }

  async removeAll(magicWord: string) {
    if (!magicWord) throw new Error('Magic Word is required');
    if (magicWord == 'rapchik') {
      return this.prisma.company.deleteMany();
    } else {
      throw new Error('Incorrect Magic Word');
    }
  }
}
