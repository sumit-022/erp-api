import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { CompanyService } from 'src/company/company.service';

@Module({
  providers: [UsersService, AuthService, CompanyService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
