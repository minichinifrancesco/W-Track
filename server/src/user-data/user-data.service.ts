import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

type AppDataPayload = {
  workouts?: unknown;
  exercises?: unknown;
  history?: unknown;
  badges?: unknown;
};

type SettingsPayload = {
  weightUnit?: unknown;
  themeMode?: unknown;
  defaultRestTime?: unknown;
  showExerciseNotes?: unknown;
  restTimerHaptic?: unknown;
  restTimerSound?: unknown;
};

type ClientRecord = Record<string, unknown>;

const BADGE_DEFINITIONS = [
  {
    code: 'PR_WEIGHT',
    name: 'PR Peso Massimo',
    description: 'Nuovo peso massimo assoluto registrato su un esercizio.',
    icon: 'barbell',
    category: 'Personal Record',
  },
  {
    code: 'PR_REPS',
    name: 'PR Ripetizioni',
    description: 'Nuovo massimo di ripetizioni in una serie.',
    icon: 'repeat',
    category: 'Personal Record',
  },
  {
    code: 'PR_VOLUME',
    name: 'PR Volume Totale',
    description: 'Nuovo volume totale migliore per un esercizio in una sessione.',
    icon: 'trending-up',
    category: 'Personal Record',
  },
];

@Injectable()
export class UserDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getData(authUser: AuthUser) {
    await this.ensureBadgeDefinitions();

    const [plans, workouts, badges] = await Promise.all([
      this.prisma.workoutPlan.findMany({
        where: { userId: authUser.userId },
        include: {
          exercises: {
            include: {
              exercise: true,
              plannedSets: { orderBy: { setNumber: 'asc' } },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.workout.findMany({
        where: { userId: authUser.userId },
        include: {
          exercises: {
            include: {
              exercise: true,
              executedSets: {
                include: {
                  badges: { include: { badgeDefinition: true } },
                },
                orderBy: { setNumber: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.userBadge.findMany({
        where: { userId: authUser.userId },
        include: {
          badgeDefinition: true,
          exercise: true,
        },
        orderBy: { earnedAt: 'desc' },
      }),
    ]);

    return {
      workouts: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        active: plan.active,
        isNew: false,
        exercises: plan.exercises.map((item) => {
          const setDetails = item.plannedSets.map((set) => ({
            weight: set.targetLoad || 0,
            reps: set.targetReps || 0,
            duration: set.targetDuration || 0,
            completed: false,
          }));
          const first = setDetails[0] || {};
          const type = this.toClientTrackingType(item.exercise.trackingType);
          return {
            id: item.id,
            exerciseId: item.exerciseId,
            name: item.exercise.name,
            muscleGroup: item.exercise.muscleGroup,
            equipmentType: this.toClientEquipmentType(
              item.exercise.equipmentType,
            ),
            type,
            note: item.note || '',
            restTime: item.restSeconds,
            sets: setDetails.length,
            weight: type === 'weight_reps' ? first.weight || 0 : 0,
            reps: type === 'timed' ? 0 : first.reps || 0,
            duration: type === 'timed' ? first.duration || 0 : 0,
            setDetails,
          };
        }),
      })),
      exercises: [],
      history: workouts.map((workout) => ({
        id: workout.id,
        workoutId: workout.planId,
        name: workout.nameSnapshot,
        startTime: workout.startedAt,
        endTime: workout.endedAt,
        date: workout.startedAt,
        durationSeconds: workout.durationSeconds,
        generalNote: workout.generalNote || '',
        exercises: workout.exercises.map((item) => {
          const type = this.toClientTrackingType(item.trackingTypeSnapshot);
          const setDetails = item.executedSets.map((set) => ({
            weight: set.load || 0,
            reps: set.reps || 0,
            duration: set.durationSeconds || 0,
            completed: set.completed,
            badges: set.badges.map((badge) =>
              this.toClientBadge(badge, item.exercise?.name || item.nameSnapshot),
            ),
          }));
          const first = setDetails[0] || {};
          return {
            id: item.id,
            exerciseId: item.exerciseId,
            name: item.nameSnapshot,
            muscleGroup: item.muscleGroupSnapshot,
            equipmentType: item.exercise?.equipmentType
              ? this.toClientEquipmentType(item.exercise.equipmentType)
              : 'Altro',
            type,
            note: item.note || '',
            restTime: item.restSeconds,
            sets: setDetails.length,
            weight: type === 'weight_reps' ? first.weight || 0 : 0,
            reps: type === 'timed' ? 0 : first.reps || 0,
            duration: type === 'timed' ? first.duration || 0 : 0,
            setDetails,
          };
        }),
      })),
      badges: badges.map((badge) =>
        this.toClientBadge(badge, badge.exercise?.name || 'Esercizio'),
      ),
    };
  }

  async saveData(authUser: AuthUser, payload: AppDataPayload) {
    const plans = this.readArray(payload.workouts, 'workouts');
    const history = this.readArray(payload.history, 'history');
    const badges = this.readArray(payload.badges, 'badges');

    await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        BADGE_DEFINITIONS.map((definition) =>
          tx.badgeDefinition.upsert({
            where: { code: definition.code },
            create: definition,
            update: definition,
          }),
        ),
      );

      await tx.userBadge.deleteMany({ where: { userId: authUser.userId } });
      await tx.workout.deleteMany({ where: { userId: authUser.userId } });
      const incomingPlanIds = plans
        .map((item) => this.safeIntId(this.asRecord(item).id))
        .filter((id): id is number => id !== undefined);
      if (incomingPlanIds.length > 0) {
        await tx.workoutPlan.deleteMany({
          where: { userId: authUser.userId, id: { in: incomingPlanIds } },
        });
      }
      await tx.workoutPlan.deleteMany({
        where: { userId: authUser.userId, active: true },
      });

      const planIdMap = new Map<string, number>();
      for (const item of plans) {
        const plan = this.asRecord(item);
        const created = await tx.workoutPlan.create({
          data: {
            ...(this.safeIntId(plan.id) ? { id: this.safeIntId(plan.id) } : {}),
            userId: authUser.userId,
            name: this.requiredText(plan.name, 'Nome scheda'),
            description: this.optionalText(plan.description),
            active: plan.active === false ? false : true,
            exercises: {
              create: this.readArray(plan.exercises, 'workout.exercises').flatMap(
                (exercise, index) => {
                  const record = this.asRecord(exercise);
                  const exerciseId = this.safeIntId(
                    record.exerciseId ?? record.catalogExerciseId,
                  );
                  if (!exerciseId) return [];
                  const sets = this.toSetDetails(record);
                  return [
                    {
                      exerciseId,
                      order: index + 1,
                      note: this.optionalText(record.note),
                      restSeconds: this.nonNegativeInt(record.restTime, 60),
                      plannedSets: {
                        create: sets.map((set, setIndex) => ({
                          setNumber: setIndex + 1,
                          targetLoad: this.nonNegativeNumber(set.weight, 0),
                          targetReps: this.nonNegativeInt(set.reps, 0),
                          targetDuration: this.nonNegativeInt(set.duration, 0),
                        })),
                      },
                    },
                  ];
                },
              ),
            },
          },
        });
        if (plan.id !== undefined && plan.id !== null) {
          planIdMap.set(String(plan.id), created.id);
        }
      }

      const workoutIdMap = new Map<string, number>();
      const workoutExerciseIdMap = new Map<string, number>();
      const executedSetIdMap = new Map<string, number>();
      const createdBadgeKeys = new Set<string>();

      for (const item of history) {
        const record = this.asRecord(item);
        const originalWorkoutId = record.id;
        const planId =
          record.workoutId !== undefined && record.workoutId !== null
            ? planIdMap.get(String(record.workoutId)) ||
              this.safeIntId(record.workoutId)
            : null;
        const workout = await tx.workout.create({
          data: {
            ...(this.safeIntId(record.id) ? { id: this.safeIntId(record.id) } : {}),
            userId: authUser.userId,
            planId,
            nameSnapshot: this.requiredText(record.name, 'Nome workout'),
            startedAt: this.toDate(record.startTime ?? record.date),
            endedAt: this.toNullableDate(record.endTime),
            durationSeconds: this.nonNegativeInt(record.durationSeconds, 0),
            completed: true,
            generalNote: this.optionalText(record.generalNote),
          },
        });
        if (originalWorkoutId !== undefined && originalWorkoutId !== null) {
          workoutIdMap.set(String(originalWorkoutId), workout.id);
        }

        for (const [exerciseIndex, exercise] of this.readArray(
          record.exercises,
          'history.exercises',
        ).entries()) {
          const exerciseRecord = this.asRecord(exercise);
          const originalWorkoutExerciseId = exerciseRecord.id;
          const workoutExercise = await tx.workoutExercise.create({
            data: {
              workoutId: workout.id,
              exerciseId: this.safeIntId(
                exerciseRecord.exerciseId ?? exerciseRecord.catalogExerciseId,
              ),
              nameSnapshot: this.requiredText(
                exerciseRecord.name,
                'Nome esercizio storico',
              ),
              muscleGroupSnapshot: this.requiredText(
                exerciseRecord.muscleGroup,
                'Gruppo muscolare storico',
              ),
              trackingTypeSnapshot: this.toDbTrackingType(exerciseRecord.type),
              order: exerciseIndex + 1,
              note: this.optionalText(exerciseRecord.note),
              restSeconds: this.nonNegativeInt(exerciseRecord.restTime, 60),
            },
          });
          if (
            originalWorkoutExerciseId !== undefined &&
            originalWorkoutExerciseId !== null
          ) {
            workoutExerciseIdMap.set(
              String(originalWorkoutExerciseId),
              workoutExercise.id,
            );
          }

          for (const [setIndex, set] of this.toSetDetails(
            exerciseRecord,
          ).entries()) {
            const setRecord = this.asRecord(set);
            const executedSet = await tx.executedSet.create({
              data: {
                workoutExerciseId: workoutExercise.id,
                setNumber: setIndex + 1,
                load: this.nonNegativeNumber(setRecord.weight, 0),
                reps: this.nonNegativeInt(setRecord.reps, 0),
                durationSeconds: this.nonNegativeInt(setRecord.duration, 0),
                completed: Boolean(setRecord.completed),
              },
            });
            executedSetIdMap.set(
              `${workoutExercise.id}:${setIndex}`,
              executedSet.id,
            );

            for (const badgeItem of this.readArray(
              setRecord.badges,
              'set.badges',
            )) {
              const badge = this.asRecord(badgeItem);
              const definitionId = this.requiredText(
                badge.definitionId,
                'Definizione badge',
              );
              const value = this.nonNegativeNumber(badge.value, 0);
              const earnedAt = this.toDate(
                badge.earnedAt ?? record.date ?? record.startTime,
              );
              const exerciseId =
                this.safeIntId(badge.exerciseKey) ||
                this.safeIntId(
                  exerciseRecord.exerciseId ?? exerciseRecord.catalogExerciseId,
                );
              const badgeKey = this.badgeKey(
                definitionId,
                exerciseId,
                workout.id,
                value,
                earnedAt,
              );
              if (createdBadgeKeys.has(badgeKey)) continue;

              const definition = await tx.badgeDefinition.upsert({
                where: { code: definitionId },
                create: {
                  code: definitionId,
                  name: this.requiredText(badge.name, 'Nome badge'),
                  description: this.optionalText(badge.description),
                  icon: this.optionalText(badge.icon),
                  category: this.optionalText(badge.category),
                },
                update: {},
              });

              await tx.userBadge.create({
                data: {
                  userId: authUser.userId,
                  badgeDefinitionId: definition.id,
                  exerciseId,
                  workoutId: workout.id,
                  workoutExerciseId: workoutExercise.id,
                  executedSetId: executedSet.id,
                  value,
                  earnedAt,
                },
              });
              createdBadgeKeys.add(badgeKey);
            }
          }
        }
      }

      for (const item of badges) {
        const badge = this.asRecord(item);
        const definitionId = this.requiredText(
          badge.definitionId,
          'Definizione badge',
        );
        const definition = await tx.badgeDefinition.upsert({
          where: { code: definitionId },
          create: {
            code: definitionId,
            name: this.requiredText(badge.name, 'Nome badge'),
            description: this.optionalText(badge.description),
            icon: this.optionalText(badge.icon),
            category: this.optionalText(badge.category),
          },
          update: {},
        });

        const workoutId =
          badge.workoutRecordId !== undefined && badge.workoutRecordId !== null
            ? workoutIdMap.get(String(badge.workoutRecordId)) ?? null
            : null;
        const exerciseId = this.safeIntId(badge.exerciseKey);
        const value = this.nonNegativeNumber(badge.value, 0);
        const earnedAt = this.toDate(badge.earnedAt);
        const badgeKey = this.badgeKey(
          definitionId,
          exerciseId,
          workoutId,
          value,
          earnedAt,
        );
        if (createdBadgeKeys.has(badgeKey)) continue;

        await tx.userBadge.create({
          data: {
            userId: authUser.userId,
            badgeDefinitionId: definition.id,
            exerciseId,
            workoutId,
            value,
            earnedAt,
          },
        });
        createdBadgeKeys.add(badgeKey);
      }
    });

    return this.getData(authUser);
  }

  async createWorkoutPlan(authUser: AuthUser, payload: unknown) {
    await this.persistWorkoutPlan(authUser, payload);
    return this.getData(authUser);
  }

  async updateWorkoutPlan(authUser: AuthUser, planId: string, payload: unknown) {
    const id = this.requiredRouteId(planId, 'Scheda');
    await this.persistWorkoutPlan(authUser, payload, id);
    return this.getData(authUser);
  }

  async archiveWorkoutPlan(authUser: AuthUser, planId: string) {
    const id = this.requiredRouteId(planId, 'Scheda');
    const result = await this.prisma.workoutPlan.updateMany({
      where: { id, userId: authUser.userId },
      data: { active: false },
    });

    if (result.count === 0) {
      throw new NotFoundException('Scheda non trovata');
    }

    return this.getData(authUser);
  }

  async createWorkoutRecord(authUser: AuthUser, payload: unknown) {
    const record = this.asRecord(payload);
    await this.ensureBadgeDefinitions();

    await this.prisma.$transaction(async (tx) => {
      const planId = this.safeIntId(record.workoutId);
      if (planId) {
        const plan = await tx.workoutPlan.findFirst({
          where: { id: planId, userId: authUser.userId },
        });
        if (!plan) throw new BadRequestException('Scheda non valida');
      }

      const workout = await tx.workout.create({
        data: {
          userId: authUser.userId,
          planId: planId || null,
          nameSnapshot: this.requiredText(record.name, 'Nome workout'),
          startedAt: this.toDate(record.startTime ?? record.date),
          endedAt: this.toNullableDate(record.endTime) || new Date(),
          durationSeconds: this.nonNegativeInt(record.durationSeconds, 0),
          completed: true,
          generalNote: this.optionalText(record.generalNote),
        },
      });
      const createdBadgeKeys = new Set<string>();

      for (const [exerciseIndex, exercise] of this.readArray(
        record.exercises,
        'workout.exercises',
      ).entries()) {
        const exerciseRecord = this.asRecord(exercise);
        const exerciseId = this.safeIntId(
          exerciseRecord.exerciseId ?? exerciseRecord.catalogExerciseId,
        );
        if (exerciseId) {
          const existingExercise = await tx.exercise.findFirst({
            where: {
              id: exerciseId,
              OR: [
                { source: 'BASE' },
                { source: 'CUSTOM', userId: authUser.userId },
              ],
            },
          });
          if (!existingExercise) {
            throw new BadRequestException('Esercizio non valido');
          }
        }

        const workoutExercise = await tx.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exerciseId || null,
            nameSnapshot: this.requiredText(
              exerciseRecord.name,
              'Nome esercizio storico',
            ),
            muscleGroupSnapshot: this.requiredText(
              exerciseRecord.muscleGroup,
              'Gruppo muscolare storico',
            ),
            trackingTypeSnapshot: this.toDbTrackingType(exerciseRecord.type),
            order: exerciseIndex + 1,
            note: this.optionalText(exerciseRecord.note),
            restSeconds: this.nonNegativeInt(exerciseRecord.restTime, 60),
          },
        });

        for (const [setIndex, set] of this.toSetDetails(
          exerciseRecord,
        ).entries()) {
          const setRecord = this.asRecord(set);
          const executedSet = await tx.executedSet.create({
            data: {
              workoutExerciseId: workoutExercise.id,
              setNumber: setIndex + 1,
              load: this.nonNegativeNumber(setRecord.weight, 0),
              reps: this.nonNegativeInt(setRecord.reps, 0),
              durationSeconds: this.nonNegativeInt(setRecord.duration, 0),
              completed: Boolean(setRecord.completed),
            },
          });

          for (const badgeItem of this.readArray(
            setRecord.badges,
            'set.badges',
          )) {
            const badge = this.asRecord(badgeItem);
            const definitionId = this.requiredText(
              badge.definitionId,
              'Definizione badge',
            );
            const exerciseBadgeId =
              this.safeIntId(badge.exerciseKey) || exerciseId || undefined;
            const value = this.nonNegativeNumber(badge.value, 0);
            const earnedAt = this.toDate(badge.earnedAt ?? record.date);
            const badgeKey = this.badgeKey(
              definitionId,
              exerciseBadgeId,
              workout.id,
              value,
              earnedAt,
            );
            if (createdBadgeKeys.has(badgeKey)) continue;

            const definition = await tx.badgeDefinition.upsert({
              where: { code: definitionId },
              create: {
                code: definitionId,
                name: this.requiredText(badge.name, 'Nome badge'),
                description: this.optionalText(badge.description),
                icon: this.optionalText(badge.icon),
                category: this.optionalText(badge.category),
              },
              update: {},
            });

            await tx.userBadge.create({
              data: {
                userId: authUser.userId,
                badgeDefinitionId: definition.id,
                exerciseId: exerciseBadgeId || null,
                workoutId: workout.id,
                workoutExerciseId: workoutExercise.id,
                executedSetId: executedSet.id,
                value,
                earnedAt,
              },
            });
            createdBadgeKeys.add(badgeKey);
          }
        }
      }

      for (const badgeItem of this.readArray(record.prBadges, 'workout.badges')) {
        const badge = this.asRecord(badgeItem);
        const definitionId = this.requiredText(
          badge.definitionId,
          'Definizione badge',
        );
        const exerciseId = this.safeIntId(badge.exerciseKey);
        const value = this.nonNegativeNumber(badge.value, 0);
        const earnedAt = this.toDate(badge.earnedAt ?? record.date);
        const badgeKey = this.badgeKey(
          definitionId,
          exerciseId,
          workout.id,
          value,
          earnedAt,
        );
        if (createdBadgeKeys.has(badgeKey)) continue;

        const definition = await tx.badgeDefinition.upsert({
          where: { code: definitionId },
          create: {
            code: definitionId,
            name: this.requiredText(badge.name, 'Nome badge'),
            description: this.optionalText(badge.description),
            icon: this.optionalText(badge.icon),
            category: this.optionalText(badge.category),
          },
          update: {},
        });

        await tx.userBadge.create({
          data: {
            userId: authUser.userId,
            badgeDefinitionId: definition.id,
            exerciseId: exerciseId || null,
            workoutId: workout.id,
            value,
            earnedAt,
          },
        });
        createdBadgeKeys.add(badgeKey);
      }
    });

    return this.getData(authUser);
  }

  async updateWorkoutNotes(
    authUser: AuthUser,
    workoutId: string,
    payload: { generalNote?: unknown },
  ) {
    const id = this.requiredRouteId(workoutId, 'Workout');
    const result = await this.prisma.workout.updateMany({
      where: { id, userId: authUser.userId },
      data: { generalNote: this.optionalText(payload.generalNote) },
    });

    if (result.count === 0) {
      throw new NotFoundException('Workout non trovato');
    }

    return this.getData(authUser);
  }

  async getSettings(authUser: AuthUser) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId: authUser.userId },
      create: { userId: authUser.userId },
      update: {},
    });

    return this.toClientSettings(settings);
  }

  async saveSettings(authUser: AuthUser, payload: SettingsPayload) {
    const data: {
      preferredLoadUnit?: string;
      theme?: string;
      defaultRestSeconds?: number;
      exerciseNotesEnabled?: boolean;
      restTimerHaptic?: boolean;
      restTimerSound?: boolean;
    } = {};

    if (payload.weightUnit !== undefined) {
      data.preferredLoadUnit =
        String(payload.weightUnit).toLowerCase() === 'lbs' ? 'LBS' : 'KG';
    }
    if (payload.themeMode !== undefined) {
      const theme = String(payload.themeMode);
      data.theme = theme === 'dark' || theme === 'light' ? theme : 'system';
    }
    if (payload.defaultRestTime !== undefined) {
      data.defaultRestSeconds = this.nonNegativeInt(payload.defaultRestTime, 60);
    }
    if (payload.showExerciseNotes !== undefined) {
      data.exerciseNotesEnabled = Boolean(payload.showExerciseNotes);
    }
    if (payload.restTimerHaptic !== undefined) {
      data.restTimerHaptic = Boolean(payload.restTimerHaptic);
    }
    if (payload.restTimerSound !== undefined) {
      data.restTimerSound = Boolean(payload.restTimerSound);
    }

    const settings = await this.prisma.userSettings.upsert({
      where: { userId: authUser.userId },
      create: {
        userId: authUser.userId,
        ...data,
      },
      update: data,
    });

    return this.toClientSettings(settings);
  }

  private async ensureBadgeDefinitions() {
    await Promise.all(
      BADGE_DEFINITIONS.map((definition) =>
        this.prisma.badgeDefinition.upsert({
          where: { code: definition.code },
          create: definition,
          update: definition,
        }),
      ),
    );
  }

  private async persistWorkoutPlan(
    authUser: AuthUser,
    payload: unknown,
    planId?: number,
  ) {
    const plan = this.asRecord(payload);
    const exercises = this.readArray(plan.exercises, 'workout.exercises');
    const name = this.requiredText(plan.name, 'Nome scheda');
    const description = this.optionalText(plan.description);
    const active = plan.active === false ? false : true;

    await this.prisma.$transaction(async (tx) => {
      let targetPlanId = planId;

      if (targetPlanId) {
        const existing = await tx.workoutPlan.findFirst({
          where: { id: targetPlanId, userId: authUser.userId },
        });
        if (!existing) throw new NotFoundException('Scheda non trovata');

        await tx.workoutPlan.update({
          where: { id: targetPlanId },
          data: { name, description, active },
        });
        await tx.workoutPlanExercise.deleteMany({
          where: { planId: targetPlanId },
        });
      } else {
        const created = await tx.workoutPlan.create({
          data: {
            userId: authUser.userId,
            name,
            description,
            active,
          },
        });
        targetPlanId = created.id;
      }

      for (const [exerciseIndex, exercise] of exercises.entries()) {
        const record = this.asRecord(exercise);
        const exerciseId = this.safeIntId(
          record.exerciseId ?? record.catalogExerciseId,
        );
        if (!exerciseId) {
          throw new BadRequestException('Esercizio scheda non valido');
        }

        const existingExercise = await tx.exercise.findFirst({
          where: {
            id: exerciseId,
            OR: [
              { source: 'BASE' },
              { source: 'CUSTOM', userId: authUser.userId },
            ],
          },
        });
        if (!existingExercise) {
          throw new BadRequestException('Esercizio scheda non valido');
        }

        const planExercise = await tx.workoutPlanExercise.create({
          data: {
            planId: targetPlanId,
            exerciseId,
            order: exerciseIndex + 1,
            note: this.optionalText(record.note),
            restSeconds: this.nonNegativeInt(record.restTime, 60),
          },
        });

        for (const [setIndex, set] of this.toSetDetails(record).entries()) {
          const setRecord = this.asRecord(set);
          await tx.plannedSet.create({
            data: {
              planExerciseId: planExercise.id,
              setNumber: setIndex + 1,
              targetLoad: this.nonNegativeNumber(setRecord.weight, 0),
              targetReps: this.nonNegativeInt(setRecord.reps, 0),
              targetDuration: this.nonNegativeInt(setRecord.duration, 0),
            },
          });
        }
      }
    });
  }

  private toClientBadge(
    badge: {
      id: number;
      value: number | null;
      earnedAt: Date;
      exerciseId?: number | null;
      workoutId?: number | null;
      badgeDefinition: {
        code: string;
        name: string;
        description: string | null;
        icon: string | null;
        category: string | null;
      };
    },
    exerciseName: string,
  ) {
    return {
      id: String(badge.id),
      definitionId: badge.badgeDefinition.code,
      name: badge.badgeDefinition.name,
      description: badge.badgeDefinition.description || '',
      icon: badge.badgeDefinition.icon || 'trophy',
      category: badge.badgeDefinition.category || 'Personal Record',
      earnedAt: badge.earnedAt,
      exerciseKey: badge.exerciseId ? String(badge.exerciseId) : '',
      exerciseName,
      workoutRecordId: badge.workoutId,
      value: badge.value || 0,
    };
  }

  private toClientSettings(settings: {
    theme: string;
    preferredLoadUnit: string;
    defaultRestSeconds: number;
    exerciseNotesEnabled: boolean;
    restTimerHaptic: boolean;
    restTimerSound: boolean;
  }) {
    return {
      weightUnit:
        settings.preferredLoadUnit === 'LBS' ? ('lbs' as const) : ('kg' as const),
      themeMode:
        settings.theme === 'dark' || settings.theme === 'light'
          ? settings.theme
          : 'auto',
      defaultRestTime: settings.defaultRestSeconds,
      showExerciseNotes: settings.exerciseNotesEnabled,
      restTimerHaptic: settings.restTimerHaptic,
      restTimerSound: settings.restTimerSound,
    };
  }

  private toSetDetails(exercise: ClientRecord) {
    const sets = this.readArray(exercise.setDetails, 'setDetails');
    if (sets.length > 0) return sets.map((item) => this.asRecord(item));

    const count = this.nonNegativeInt(exercise.sets, 1);
    return Array.from({ length: Math.max(count, 1) }, () => ({
      weight: exercise.weight || 0,
      reps: exercise.reps || 0,
      duration: exercise.duration || 0,
      completed: false,
    }));
  }

  private readArray(value: unknown, fieldName: string): unknown[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
      throw new BadRequestException(`${fieldName} deve essere un array`);
    }
    return value;
  }

  private asRecord(value: unknown): ClientRecord {
    return typeof value === 'object' && value !== null
      ? (value as ClientRecord)
      : {};
  }

  private requiredText(value: unknown, fieldName: string): string {
    const normalized = String(value ?? '').trim();
    if (!normalized) throw new BadRequestException(`${fieldName} obbligatorio`);
    return normalized;
  }

  private optionalText(value: unknown): string | null {
    const normalized = String(value ?? '').trim();
    return normalized || null;
  }

  private safeIntId(value: unknown): number | undefined {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 2147483647) {
      return undefined;
    }
    return parsed;
  }

  private requiredRouteId(value: unknown, fieldName: string): number {
    const parsed = this.safeIntId(value);
    if (!parsed) throw new BadRequestException(`${fieldName} non valida`);
    return parsed;
  }

  private nonNegativeNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  private nonNegativeInt(value: unknown, fallback: number): number {
    const parsed = parseInt(String(value ?? ''), 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  private toDate(value: unknown): Date {
    const date = new Date(String(value || Date.now()));
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  private toNullableDate(value: unknown): Date | null {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private toDbTrackingType(value: unknown): string {
    if (value === 'reps' || value === 'REPS') return 'REPS';
    if (value === 'timed' || value === 'TIMED') return 'TIMED';
    return 'WEIGHT_REPS';
  }

  private toClientTrackingType(value: string): string {
    if (value === 'REPS') return 'reps';
    if (value === 'TIMED') return 'timed';
    return 'weight_reps';
  }

  private toClientEquipmentType(value: string): string {
    if (value === 'MACCHINARI') return 'Macchinari';
    if (value === 'CORPO_LIBERO') return 'Corpo libero';
    if (value === 'PESI_LIBERI') return 'Pesi liberi';
    if (value === 'CON_PESI') return 'Con pesi';
    if (value === 'CAVI') return 'Cavi';
    if (value === 'CARDIO_MACHINE') return 'Cardio machine';
    return 'Altro';
  }

  private badgeKey(
    definitionId: string,
    exerciseId: number | undefined,
    workoutId: number | null,
    value: number,
    earnedAt: Date,
  ) {
    return [
      definitionId,
      exerciseId || '',
      workoutId || '',
      value,
      earnedAt.toISOString(),
    ].join('|');
  }
}
