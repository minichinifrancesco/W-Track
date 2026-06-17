import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { UserDataService } from './user-data.service';

@UseGuards(AuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  createWorkout(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    return this.userDataService.createWorkoutRecord(request.user, body);
  }

  @Patch(':id/notes')
  updateWorkoutNotes(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { generalNote?: unknown },
  ) {
    return this.userDataService.updateWorkoutNotes(request.user, id, body);
  }
}
