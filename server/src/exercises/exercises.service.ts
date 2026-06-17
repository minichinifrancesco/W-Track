import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

const TRACKING_TYPES = new Set(['WEIGHT_REPS', 'REPS', 'TIMED']);
const EQUIPMENT_TYPES = new Set([
  'MACCHINARI',
  'CORPO_LIBERO',
  'PESI_LIBERI',
  'CON_PESI',
  'CAVI',
  'CARDIO_MACHINE',
  'ALTRO',
]);

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
      equipmentType?: string | null;
      type?: string;
      description?: string | null;
    },
  ) {
    const name = this.normalizeRequired(body.name, 'Nome esercizio');
    const muscleGroup = this.normalizeRequired(
      body.muscleGroup,
      'Gruppo muscolare',
    );
    const equipmentType = this.normalizeEquipmentType(body.equipmentType);
    const trackingType = this.normalizeTrackingType(body.type);
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
        equipmentType,
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

  async updateCustom(
    authUser: AuthUser,
    exerciseId: number,
    body: {
      name?: string;
    },
  ) {
    const name = this.normalizeRequired(body.name, 'Nome esercizio');

    const existingExercise = await this.prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        userId: authUser.userId,
        source: 'CUSTOM',
      },
    });

    if (!existingExercise) {
      throw new NotFoundException('Esercizio personalizzato non trovato');
    }

    const duplicate = await this.prisma.exercise.findFirst({
      where: {
        id: { not: exerciseId },
        userId: authUser.userId,
        source: 'CUSTOM',
        name,
        muscleGroup: existingExercise.muscleGroup,
      },
    });

    if (duplicate) {
      throw new ConflictException('Esercizio personalizzato gia esistente');
    }

    const exercise = await this.prisma.exercise.update({
      where: { id: exerciseId },
      data: { name },
    });

    return this.toClientExercise(exercise);
  }

  private toClientExercise(exercise: {
    id: number;
    name: string;
    muscleGroup: string;
    equipmentType: string;
    trackingType: string;
    description: string | null;
    source: 'BASE' | 'CUSTOM';
  }) {
    return {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipmentType: this.toClientEquipmentType(exercise.equipmentType),
      type: this.toClientTrackingType(exercise.trackingType),
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
    const dbValue =
      normalized === 'reps'
        ? 'REPS'
        : normalized === 'timed'
          ? 'TIMED'
          : normalized === 'WEIGHT_REPS' ||
              normalized === 'REPS' ||
              normalized === 'TIMED'
            ? normalized
            : 'WEIGHT_REPS';
    if (!TRACKING_TYPES.has(dbValue)) {
      throw new BadRequestException('Tipologia esercizio non valida');
    }
    return dbValue;
  }

  private normalizeEquipmentType(value: string | null | undefined) {
    const normalized = (value ?? 'ALTRO').trim();
    const dbValue =
      normalized === 'Macchinari' || normalized === 'MACCHINARI'
        ? 'MACCHINARI'
        : normalized === 'Corpo libero' || normalized === 'CORPO_LIBERO'
          ? 'CORPO_LIBERO'
          : normalized === 'Pesi liberi' || normalized === 'PESI_LIBERI'
            ? 'PESI_LIBERI'
            : normalized === 'Con pesi' || normalized === 'CON_PESI'
              ? 'CON_PESI'
              : normalized === 'Cavi' || normalized === 'CAVI'
                ? 'CAVI'
                : normalized === 'Cardio machine' ||
                    normalized === 'CARDIO_MACHINE'
                  ? 'CARDIO_MACHINE'
                  : 'ALTRO';

    if (!EQUIPMENT_TYPES.has(dbValue)) {
      throw new BadRequestException('Tipo attrezzatura non valido');
    }
    return dbValue;
  }

  private toClientTrackingType(value: string) {
    if (value === 'REPS') return 'reps';
    if (value === 'TIMED') return 'timed';
    return 'weight_reps';
  }

  private toClientEquipmentType(value: string) {
    if (value === 'MACCHINARI') return 'Macchinari';
    if (value === 'CORPO_LIBERO') return 'Corpo libero';
    if (value === 'PESI_LIBERI') return 'Pesi liberi';
    if (value === 'CON_PESI') return 'Con pesi';
    if (value === 'CAVI') return 'Cavi';
    if (value === 'CARDIO_MACHINE') return 'Cardio machine';
    return 'Altro';
  }
}
