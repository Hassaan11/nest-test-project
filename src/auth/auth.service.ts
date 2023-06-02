import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private Prisma: PrismaService) {}
  signup(body) {
    return 'Signup';
  }
  signin() {
    return 'Signin';
  }
}
