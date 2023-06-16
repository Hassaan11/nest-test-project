import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as Argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await Argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });
      // delete user.hash;
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err.code === 'P2002') {
        // above code is the duplicate error code of prisma
        throw new ForbiddenException('Credientials Taken');
      }
      throw err;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const found = await Argon.verify(user.hash, dto.password);

    if (!found) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const data = {
      sub: id,
      email,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
