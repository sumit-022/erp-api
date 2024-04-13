import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRegisterDto } from './dto/register.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CompanyRegisterDto) {
    return this.prisma.company.create({
      data: {
        address: data.address,
        name: data.name,
        ownerId: data.ownerId,
        companyType: data.companyType,
        contact: data.contact,
        email: data.email,
        website: data.website,
        gstin: data.gstin,
        logo: data.logo,
      },
    });
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

  async removeAll(magicWord: string) {
    if (magicWord == 'rapchik') {
      return this.prisma.company.deleteMany();
    } else {
      throw new Error('Incorrect Magic Word');
    }
  }
}
