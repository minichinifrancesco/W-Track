import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { UserDataService } from './user-data.service';

@UseGuards(AuthGuard)
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  createPlan(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    return this.userDataService.createWorkoutPlan(request.user, body);
  }

  @Patch(':id')
  updatePlan(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.userDataService.updateWorkoutPlan(request.user, id, body);
  }

  @Patch(':id/archive')
  archivePlan(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.userDataService.archiveWorkoutPlan(request.user, id);
  }
}
