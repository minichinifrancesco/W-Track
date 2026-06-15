-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_executed_sets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNumber" INTEGER NOT NULL,
    "repsDone" INTEGER NOT NULL,
    "weightKg" REAL,
    "notes" TEXT,
    "workoutId" INTEGER NOT NULL,
    "workoutPlanExerciseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "executed_sets_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "executed_sets_workoutPlanExerciseId_fkey" FOREIGN KEY ("workoutPlanExerciseId") REFERENCES "workout_plan_exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_executed_sets" ("createdAt", "id", "notes", "repsDone", "setNumber", "updatedAt", "weightKg", "workoutId", "workoutPlanExerciseId") SELECT "createdAt", "id", "notes", "repsDone", "setNumber", "updatedAt", "weightKg", "workoutId", "workoutPlanExerciseId" FROM "executed_sets";
DROP TABLE "executed_sets";
ALTER TABLE "new_executed_sets" RENAME TO "executed_sets";
CREATE INDEX "executed_sets_workoutId_idx" ON "executed_sets"("workoutId");
CREATE INDEX "executed_sets_workoutPlanExerciseId_idx" ON "executed_sets"("workoutPlanExerciseId");
CREATE TABLE "new_exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "muscleGroup" TEXT NOT NULL,
    "subcategory" TEXT,
    "trackingType" TEXT NOT NULL DEFAULT 'weight_reps',
    "type" TEXT NOT NULL DEFAULT 'BASE',
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("createdAt", "description", "id", "muscleGroup", "name", "subcategory", "trackingType", "type", "updatedAt", "userId") SELECT "createdAt", "description", "id", "muscleGroup", "name", "subcategory", "trackingType", "type", "updatedAt", "userId" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE INDEX "exercises_type_idx" ON "exercises"("type");
CREATE INDEX "exercises_userId_idx" ON "exercises"("userId");
CREATE TABLE "new_user_app_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workouts" TEXT NOT NULL DEFAULT '[]',
    "exercises" TEXT NOT NULL DEFAULT '[]',
    "history" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "user_app_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_app_data" ("createdAt", "exercises", "history", "id", "updatedAt", "userId", "workouts") SELECT "createdAt", "exercises", "history", "id", "updatedAt", "userId", "workouts" FROM "user_app_data";
DROP TABLE "user_app_data";
ALTER TABLE "new_user_app_data" RENAME TO "user_app_data";
CREATE UNIQUE INDEX "user_app_data_userId_key" ON "user_app_data"("userId");
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "age" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT,
    "birthDate" DATETIME,
    "weightKg" REAL,
    "heightCm" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("age", "birthDate", "createdAt", "email", "gender", "heightCm", "id", "name", "password", "registrationDate", "surname", "updatedAt", "weightKg") SELECT "age", "birthDate", "createdAt", "email", "gender", "heightCm", "id", "name", "password", "registrationDate", "surname", "updatedAt", "weightKg" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE TABLE "new_workout_plan_exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "setsNumber" INTEGER NOT NULL,
    "repsNumber" INTEGER NOT NULL,
    "restSeconds" INTEGER NOT NULL DEFAULT 60,
    "workoutPlanId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workout_plan_exercises_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_plan_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workout_plan_exercises" ("createdAt", "exerciseId", "id", "order", "repsNumber", "restSeconds", "setsNumber", "updatedAt", "workoutPlanId") SELECT "createdAt", "exerciseId", "id", "order", "repsNumber", "restSeconds", "setsNumber", "updatedAt", "workoutPlanId" FROM "workout_plan_exercises";
DROP TABLE "workout_plan_exercises";
ALTER TABLE "new_workout_plan_exercises" RENAME TO "workout_plan_exercises";
CREATE INDEX "workout_plan_exercises_workoutPlanId_idx" ON "workout_plan_exercises"("workoutPlanId");
CREATE INDEX "workout_plan_exercises_exerciseId_idx" ON "workout_plan_exercises"("exerciseId");
CREATE TABLE "new_workout_plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "workout_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workout_plans" ("active", "createdAt", "description", "id", "name", "updatedAt", "userId") SELECT "active", "createdAt", "description", "id", "name", "updatedAt", "userId" FROM "workout_plans";
DROP TABLE "workout_plans";
ALTER TABLE "new_workout_plans" RENAME TO "workout_plans";
CREATE INDEX "workout_plans_userId_idx" ON "workout_plans"("userId");
CREATE TABLE "new_workouts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "userId" INTEGER NOT NULL,
    "workoutPlanId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workouts_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workouts" ("completed", "createdAt", "date", "endTime", "id", "notes", "paused", "startTime", "updatedAt", "userId", "workoutPlanId") SELECT "completed", "createdAt", "date", "endTime", "id", "notes", "paused", "startTime", "updatedAt", "userId", "workoutPlanId" FROM "workouts";
DROP TABLE "workouts";
ALTER TABLE "new_workouts" RENAME TO "workouts";
CREATE INDEX "workouts_userId_idx" ON "workouts"("userId");
CREATE INDEX "workouts_workoutPlanId_idx" ON "workouts"("workoutPlanId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
