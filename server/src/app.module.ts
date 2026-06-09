import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserDataModule } from './user-data/user-data.module';

@Module({
  imports: [AuthModule, UserDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
