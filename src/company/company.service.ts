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

  async remove(companyId: string, userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new Error('Company not found');
    }
    if (company.ownerId !== userId) {
      throw new Error('You are not authorized to delete this company');
    }
    return this.prisma.company.delete({
      where: { id: companyId },
    });
  }

  async getCompanies(
    id: string,
    paginationState: {
      ord: 'desc' | 'asc';
      limit: number;
    } & ({ page: number; cursor?: any } | { page?: number; cursor: any }),
  ) {
    const { ord, page, limit, cursor } = paginationState;
    const isCursorPagination = cursor !== undefined;
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1) {
      throw new Error('Size must be greater than 0');
    }
    if (isCursorPagination && page !== undefined) {
      throw new Error('Cursor pagination should not have page');
    }
    if (!isCursorPagination && page === undefined) {
      throw new Error('Page should be provided for page based pagination');
    }
    const companies = await this.prisma.company.findMany({
      where: { ownerId: id },
      cursor: isCursorPagination ? { id: cursor } : undefined,
      skip: isCursorPagination ? 0 : (page - 1) * limit,
      take: limit,
      orderBy: {
        name: ord,
      },
    });
    const count = await this.prisma.company.count({
      where: { ownerId: id },
    });
    return {
      companies,
      meta: {
        total: count,
        page: page || 1,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
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
