import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
