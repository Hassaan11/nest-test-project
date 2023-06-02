import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// by writting global PrismaService will be available to all modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
