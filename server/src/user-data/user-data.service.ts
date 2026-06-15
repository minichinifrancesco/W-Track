import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

type AppDataPayload = {
  workouts?: unknown;
  exercises?: unknown;
  history?: unknown;
};

@Injectable()
export class UserDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getData(authUser: AuthUser) {
    const data = await this.prisma.userAppData.upsert({
      where: { userId: authUser.userId },
      create: {
        userId: authUser.userId,
        workouts: '[]',
        exercises: '[]',
        history: '[]',
      },
      update: {},
    });

    return {
      workouts: this.parseArray(data.workouts),
      exercises: this.parseArray(data.exercises),
      history: this.parseArray(data.history),
    };
  }

  async saveData(authUser: AuthUser, payload: AppDataPayload) {
    const workouts = this.stringifyArray(payload.workouts, 'workouts');
    const exercises = this.stringifyArray(payload.exercises, 'exercises');
    const history = this.stringifyArray(payload.history, 'history');

    const data = await this.prisma.userAppData.upsert({
      where: { userId: authUser.userId },
      create: {
        userId: authUser.userId,
        workouts,
        exercises,
        history,
      },
      update: {
        workouts,
        exercises,
        history,
      },
    });

    return {
      workouts: this.parseArray(data.workouts),
      exercises: this.parseArray(data.exercises),
      history: this.parseArray(data.history),
    };
  }

  private stringifyArray(value: unknown, fieldName: string): string {
    if (!Array.isArray(value)) {
      throw new BadRequestException(`${fieldName} deve essere un array`);
    }
    return JSON.stringify(value);
  }

  private parseArray(value: string): unknown[] {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
