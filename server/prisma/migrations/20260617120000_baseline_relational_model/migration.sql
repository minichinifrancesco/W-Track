-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "data_nascita" DATETIME NOT NULL,
    "genere" TEXT NOT NULL DEFAULT 'NON_SPECIFICATO',
    "peso" REAL,
    "altezza_cm" REAL,
    "data_registrazione" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "tema" TEXT NOT NULL DEFAULT 'system',
    "preferred_load_unit" TEXT NOT NULL DEFAULT 'KG',
    "tempo_recupero_default_secondi" INTEGER NOT NULL DEFAULT 60,
    "rest_timer_sound" BOOLEAN NOT NULL DEFAULT true,
    "rest_timer_haptic" BOOLEAN NOT NULL DEFAULT true,
    "note_esercizi_abilitate" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "gruppo_muscolare" TEXT NOT NULL,
    "tipo_attrezzatura" TEXT NOT NULL DEFAULT 'ALTRO',
    "tipo_tracciamento" TEXT NOT NULL,
    "origine" TEXT NOT NULL DEFAULT 'BASE',
    "user_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "attiva" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "workout_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_plan_exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_plan_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "ordine" INTEGER NOT NULL,
    "note" TEXT,
    "tempo_recupero_secondi" INTEGER NOT NULL DEFAULT 60,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "workout_plan_exercises_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_plan_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "planned_sets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_plan_exercise_id" INTEGER NOT NULL,
    "numero_serie" INTEGER NOT NULL,
    "carico_target" REAL,
    "ripetizioni_target" INTEGER,
    "durata_target_secondi" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "planned_sets_workout_plan_exercise_id_fkey" FOREIGN KEY ("workout_plan_exercise_id") REFERENCES "workout_plan_exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "workout_plan_id" INTEGER,
    "nome_snapshot" TEXT NOT NULL,
    "ora_inizio" DATETIME NOT NULL,
    "ora_fine" DATETIME,
    "durata_secondi" INTEGER NOT NULL DEFAULT 0,
    "completato" BOOLEAN NOT NULL DEFAULT false,
    "note_generali" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workouts_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_id" INTEGER NOT NULL,
    "exercise_id" INTEGER,
    "nome_snapshot" TEXT NOT NULL,
    "gruppo_muscolare_snapshot" TEXT NOT NULL,
    "tipo_tracciamento_snapshot" TEXT NOT NULL,
    "ordine" INTEGER NOT NULL,
    "note" TEXT,
    "tempo_recupero_secondi" INTEGER NOT NULL DEFAULT 60,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "executed_sets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_exercise_id" INTEGER NOT NULL,
    "numero_serie" INTEGER NOT NULL,
    "carico" REAL,
    "ripetizioni" INTEGER,
    "durata_secondi" INTEGER,
    "completata" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "executed_sets_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "badge_definitions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codice" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "icona" TEXT,
    "categoria" TEXT
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "badge_definition_id" INTEGER NOT NULL,
    "exercise_id" INTEGER,
    "workout_id" INTEGER,
    "workout_exercise_id" INTEGER,
    "executed_set_id" INTEGER,
    "valore" REAL,
    "ottenuto_il" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_badges_badge_definition_id_fkey" FOREIGN KEY ("badge_definition_id") REFERENCES "badge_definitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_badges_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_badges_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_badges_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_badges_executed_set_id_fkey" FOREIGN KEY ("executed_set_id") REFERENCES "executed_sets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercises_user_id" ON "exercises"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercises_origine" ON "exercises"("origine");

-- CreateIndex
CREATE INDEX "idx_exercises_gruppo_muscolare" ON "exercises"("gruppo_muscolare");

-- CreateIndex
CREATE INDEX "idx_exercises_tipo_attrezzatura" ON "exercises"("tipo_attrezzatura");

-- CreateIndex
CREATE INDEX "idx_workout_plans_user_id" ON "workout_plans"("user_id");

-- CreateIndex
CREATE INDEX "idx_workout_plans_user_attiva" ON "workout_plans"("user_id", "attiva");

-- CreateIndex
CREATE INDEX "idx_workout_plan_exercises_plan_id" ON "workout_plan_exercises"("workout_plan_id");

-- CreateIndex
CREATE INDEX "idx_workout_plan_exercises_exercise_id" ON "workout_plan_exercises"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_plan_exercises_workout_plan_id_ordine_key" ON "workout_plan_exercises"("workout_plan_id", "ordine");

-- CreateIndex
CREATE INDEX "idx_planned_sets_plan_exercise_id" ON "planned_sets"("workout_plan_exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "planned_sets_workout_plan_exercise_id_numero_serie_key" ON "planned_sets"("workout_plan_exercise_id", "numero_serie");

-- CreateIndex
CREATE INDEX "idx_workouts_user_id" ON "workouts"("user_id");

-- CreateIndex
CREATE INDEX "idx_workouts_plan_id" ON "workouts"("workout_plan_id");

-- CreateIndex
CREATE INDEX "idx_workouts_ora_inizio" ON "workouts"("ora_inizio");

-- CreateIndex
CREATE INDEX "idx_workouts_user_ora_inizio" ON "workouts"("user_id", "ora_inizio");

-- CreateIndex
CREATE INDEX "idx_workout_exercises_workout_id" ON "workout_exercises"("workout_id");

-- CreateIndex
CREATE INDEX "idx_workout_exercises_exercise_id" ON "workout_exercises"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_exercises_workout_id_ordine_key" ON "workout_exercises"("workout_id", "ordine");

-- CreateIndex
CREATE INDEX "idx_executed_sets_workout_exercise_id" ON "executed_sets"("workout_exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "executed_sets_workout_exercise_id_numero_serie_key" ON "executed_sets"("workout_exercise_id", "numero_serie");

-- CreateIndex
CREATE UNIQUE INDEX "badge_definitions_codice_key" ON "badge_definitions"("codice");

-- CreateIndex
CREATE INDEX "idx_user_badges_user_id" ON "user_badges"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_definition_id" ON "user_badges"("badge_definition_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_exercise_id" ON "user_badges"("exercise_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_workout_id" ON "user_badges"("workout_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_workout_exercise_id" ON "user_badges"("workout_exercise_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_executed_set_id" ON "user_badges"("executed_set_id");

-- CreateIndex
CREATE INDEX "idx_user_badges_ottenuto_il" ON "user_badges"("ottenuto_il");

-- CreateIndex
CREATE INDEX "idx_user_badges_user_ottenuto_il" ON "user_badges"("user_id", "ottenuto_il");
