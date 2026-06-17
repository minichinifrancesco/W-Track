import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import type { AuthUser } from '../auth/auth.types';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.exercisesService.findAll(this.getOptionalAuthUser(request));
  }

  @UseGuards(AuthGuard)
  @Post()
  createCustom(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      name?: string;
      muscleGroup?: string;
      equipmentType?: string | null;
      type?: string;
      description?: string | null;
    },
  ) {
    return this.exercisesService.createCustom(request.user, body);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateCustom(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string;
    },
  ) {
    return this.exercisesService.updateCustom(request.user, id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteCustom(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.exercisesService.deleteCustom(request.user, id);
  }

  private getOptionalAuthUser(request: Request): AuthUser | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return undefined;
    return this.authService.verifyToken(authHeader.slice(7));
  }
}
