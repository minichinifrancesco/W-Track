import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserDataController } from './user-data.controller';
import { UserDataService } from './user-data.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UserDataController],
  providers: [UserDataService],
})
export class UserDataModule {}
