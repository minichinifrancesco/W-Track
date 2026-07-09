import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesModule } from './exercises/exercises.module';
import { UserDataModule } from './user-data/user-data.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [AuthModule, ExercisesModule, UserDataModule, CoachModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
