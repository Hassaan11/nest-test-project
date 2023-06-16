import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  // useGuard will protect route to check if user is authenticated or not
  @UseGuards(JWTGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log({
      user,
    });
    return user;
  }
}
