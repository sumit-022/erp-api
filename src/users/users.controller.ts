import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Res, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
