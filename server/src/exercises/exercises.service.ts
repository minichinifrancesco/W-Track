import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

const TRACKING_TYPES = new Set(['weight_reps', 'reps', 'timed']);

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(authUser?: AuthUser) {
    const exercises = await this.prisma.exercise.findMany({
      where: {
        OR: [
          { source: 'BASE' },
          ...(authUser
            ? [{ source: 'CUSTOM' as const, userId: authUser.userId }]
            : []),
        ],
      },
      orderBy: [{ id: 'asc' }],
    });

    return exercises.map((exercise) => this.toClientExercise(exercise));
  }

  async createCustom(
    authUser: AuthUser,
    body: {
      name?: string;
      muscleGroup?: string;
      type?: string;
      subcategory?: string | null;
      description?: string | null;
    },
  ) {
    const name = this.normalizeRequired(body.name, 'Nome esercizio');
    const muscleGroup = this.normalizeRequired(
      body.muscleGroup,
      'Gruppo muscolare',
    );
    const trackingType = this.normalizeTrackingType(body.type);
    const subcategory = this.normalizeOptional(body.subcategory);
    const description = this.normalizeOptional(body.description);

    const existing = await this.prisma.exercise.findFirst({
      where: {
        userId: authUser.userId,
        source: 'CUSTOM',
        name,
        muscleGroup,
      },
    });

    if (existing) {
      throw new ConflictException('Esercizio personalizzato gia esistente');
    }

    const exercise = await this.prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        subcategory,
        trackingType,
        description,
        source: 'CUSTOM',
        userId: authUser.userId,
      },
    });

    return this.toClientExercise(exercise);
  }

  async deleteCustom(authUser: AuthUser, exerciseId: number) {
    const result = await this.prisma.exercise.deleteMany({
      where: {
        id: exerciseId,
        userId: authUser.userId,
        source: 'CUSTOM',
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Esercizio personalizzato non trovato');
    }

    return { ok: true };
  }

  private toClientExercise(exercise: {
    id: number;
    name: string;
    muscleGroup: string;
    subcategory: string | null;
    trackingType: string;
    description: string | null;
    source: 'BASE' | 'CUSTOM';
  }) {
    return {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      subcategory: exercise.subcategory,
      type: exercise.trackingType,
      description: exercise.description,
      custom: exercise.source === 'CUSTOM',
    };
  }

  private normalizeRequired(value: string | undefined, fieldName: string) {
    const normalized = (value ?? '').trim();
    if (!normalized) {
      throw new BadRequestException(`${fieldName} obbligatorio`);
    }
    return normalized;
  }

  private normalizeOptional(value: string | null | undefined) {
    const normalized = (value ?? '').trim();
    return normalized || null;
  }

  private normalizeTrackingType(value: string | undefined) {
    const normalized = (value ?? 'weight_reps').trim();
    if (!TRACKING_TYPES.has(normalized)) {
      throw new BadRequestException('Tipologia esercizio non valida');
    }
    return normalized;
  }
}
