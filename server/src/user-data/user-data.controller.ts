import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { UserDataService } from './user-data.service';

@UseGuards(AuthGuard)
@Controller('me/data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get()
  getData(@Req() request: AuthenticatedRequest) {
    return this.userDataService.getData(request.user);
  }

  @Put()
  saveData(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      workouts?: unknown;
      exercises?: unknown;
      history?: unknown;
      badges?: unknown;
    },
  ) {
    return this.userDataService.saveData(request.user, body);
  }

  @Get('settings')
  getSettings(@Req() request: AuthenticatedRequest) {
    return this.userDataService.getSettings(request.user);
  }

  @Put('settings')
  saveSettings(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      weightUnit?: unknown;
      themeMode?: unknown;
      defaultRestTime?: unknown;
      showExerciseNotes?: unknown;
      restTimerHaptic?: unknown;
      restTimerSound?: unknown;
    },
  ) {
    return this.userDataService.saveSettings(request.user, body);
  }
}
