import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, AuthService],
})
export class CompanyModule {}
