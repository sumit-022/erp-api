import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { CompanyService } from 'src/company/company.service';
import { Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private companyService: CompanyService,
  ) {}

  @Post('usernameExists')
  async usernameExists(@Req() req, @Res() res) {
    try {
      const username = req.body.username;
      const exists = await this.usersService.usernameExists(username);
      res.status(200).send(exists);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('companies')
  async getCompanies(@Req() req: Request, @Res() res: Response) {
    const query = req.query;

    const page = query.page ? parseInt(query.page as string) : 1;
    const limit = query.size ? parseInt(query.size as string) : 10;
    const ord = query.ord === 'desc' ? query.ord : 'asc';
    const cursor = query.cursor ? query.cursor : undefined;

    try {
      const user = req.user;
      if (user) {
        const companies = await this.companyService.getCompanies(user.id, {
          page,
          limit,
          ord,
          cursor,
        });
        return res.json(companies);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  @Post('deleteAll')
  async deleteAll(@Req() req, @Res() res) {
    const magicWord = req.body.magicWord;
    try {
      await this.usersService.removeAll(magicWord);
      res.status(200).send('All users deleted');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
