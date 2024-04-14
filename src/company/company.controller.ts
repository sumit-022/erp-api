import { Body, Controller, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthService } from 'src/auth/auth.service';
import { Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user;
      if (user) {
        await this.companyService.create({ ...req.body, ownerId: user.id });
      }
      return res.json({ message: 'Company created successfully' });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  }
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.id;
    const companyId = req.params.id;
    try {
      await this.companyService.remove(companyId, userId);
      res.status(200).send('Company deleted');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  @Delete('deleteAll')
  async deleteAll(@Req() req: Request, @Res() res: Response) {
    const magicWord = req.body.magicWord;
    try {
      await this.companyService.removeAll(magicWord);
      res.status(200).send('All companies deleted');
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
