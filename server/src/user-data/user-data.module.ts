import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserDataController } from './user-data.controller';
import { UserDataService } from './user-data.service';
import { WorkoutPlansController } from './workout-plans.controller';
import { WorkoutsController } from './workouts.controller';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UserDataController, WorkoutPlansController, WorkoutsController],
  providers: [UserDataService],
})
export class UserDataModule {}
