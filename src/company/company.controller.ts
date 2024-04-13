import { Body, Controller, Req, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthService } from 'src/auth/auth.service';
import { Post } from '@nestjs/common';
import { CompanyRegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      console.log({ tok: req.cookies });
      const user = await this.authService.validateAccessToken(
        req.cookies.token,
      );
      if (user) {
        await this.companyService.create({ ...req.body, ownerId: user.id });
      }
      return res.json({ message: 'Company created successfully' });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  }
}
