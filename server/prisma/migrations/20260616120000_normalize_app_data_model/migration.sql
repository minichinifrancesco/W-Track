PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "_migrate_users" AS
SELECT
  "id",
  "email",
  "password" AS "password_hash",
  "name" AS "nome",
  COALESCE("surname", '') AS "cognome",
  COALESCE("birthDate", '1970-01-01 00:00:00') AS "data_nascita",
  "weightKg" AS "peso",
  "heightCm" AS "altezza_cm",
  COALESCE("registrationDate", CURRENT_TIMESTAMP) AS "data_registrazione",
  COALESCE("createdAt", CURRENT_TIMESTAMP) AS "created_at",
  COALESCE("updatedAt", CURRENT_TIMESTAMP) AS "updated_at"
FROM "users";

CREATE TABLE "_migrate_exercises" AS
SELECT
  "id",
  "name" AS "nome",
  "description" AS "descrizione",
  "muscleGroup" AS "gruppo_muscolare",
  CASE "subcategory"
    WHEN 'Macchinari' THEN 'MACCHINARI'
    WHEN 'Corpo libero' THEN 'CORPO_LIBERO'
    WHEN 'Pesi liberi' THEN 'PESI_LIBERI'
    WHEN 'Con pesi' THEN 'CON_PESI'
    WHEN 'Cavi' THEN 'CAVI'
    WHEN 'Cardio machine' THEN 'CARDIO_MACHINE'
    ELSE 'ALTRO'
  END AS "tipo_attrezzatura",
  CASE "trackingType"
    WHEN 'weight_reps' THEN 'WEIGHT_REPS'
    WHEN 'reps' THEN 'REPS'
    WHEN 'timed' THEN 'TIMED'
    ELSE 'WEIGHT_REPS'
  END AS "tipo_tracciamento",
  "type" AS "origine",
  "userId" AS "user_id",
  COALESCE("createdAt", CURRENT_TIMESTAMP) AS "created_at",
  COALESCE("updatedAt", CURRENT_TIMESTAMP) AS "updated_at"
FROM "exercises";

DROP TABLE IF EXISTS "executed_sets";
DROP TABLE IF EXISTS "workouts";
DROP TABLE IF EXISTS "workout_plan_exercises";
DROP TABLE IF EXISTS "workout_plans";
DROP TABLE IF EXISTS "user_app_data";
DROP TABLE IF EXISTS "exercises";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "cognome" TEXT NOT NULL,
  "data_nascita" DATETIME NOT NULL,
  "peso" REAL,
  "altezza_cm" REAL,
  "data_registrazione" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ("peso" IS NULL OR "peso" >= 0),
  CHECK ("altezza_cm" IS NULL OR "altezza_cm" >= 0)
);

CREATE TABLE "user_settings" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL UNIQUE,
  "tema" TEXT NOT NULL DEFAULT 'system',
  "preferred_load_unit" TEXT NOT NULL DEFAULT 'KG',
  "tempo_recupero_default_secondi" INTEGER NOT NULL DEFAULT 60,
  "rest_timer_sound" BOOLEAN NOT NULL DEFAULT 1,
  "rest_timer_haptic" BOOLEAN NOT NULL DEFAULT 1,
  "note_esercizi_abilitate" BOOLEAN NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ("tema" IN ('light', 'dark', 'system')),
  CHECK ("preferred_load_unit" IN ('KG', 'LBS')),
  CHECK ("tempo_recupero_default_secondi" >= 0),
  CHECK ("rest_timer_sound" IN (0, 1)),
  CHECK ("rest_timer_haptic" IN (0, 1)),
  CHECK ("note_esercizi_abilitate" IN (0, 1))
);

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
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ("tipo_attrezzatura" IN ('MACCHINARI', 'CORPO_LIBERO', 'PESI_LIBERI', 'CON_PESI', 'CAVI', 'CARDIO_MACHINE', 'ALTRO')),
  CHECK ("tipo_tracciamento" IN ('WEIGHT_REPS', 'REPS', 'TIMED')),
  CHECK ("origine" IN ('BASE', 'CUSTOM')),
  CHECK (("origine" = 'BASE' AND "user_id" IS NULL) OR ("origine" = 'CUSTOM' AND "user_id" IS NOT NULL))
);

CREATE TABLE "workout_plans" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "nome" TEXT NOT NULL,
  "descrizione" TEXT,
  "attiva" BOOLEAN NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ("attiva" IN (0, 1))
);

CREATE TABLE "workout_plan_exercises" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "workout_plan_id" INTEGER NOT NULL,
  "exercise_id" INTEGER NOT NULL,
  "ordine" INTEGER NOT NULL,
  "note" TEXT,
  "tempo_recupero_secondi" INTEGER NOT NULL DEFAULT 60,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_plan_exercises_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workout_plan_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK ("ordine" > 0),
  CHECK ("tempo_recupero_secondi" >= 0),
  UNIQUE ("workout_plan_id", "ordine")
);

CREATE TABLE "planned_sets" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "workout_plan_exercise_id" INTEGER NOT NULL,
  "numero_serie" INTEGER NOT NULL,
  "carico_target" REAL,
  "ripetizioni_target" INTEGER,
  "durata_target_secondi" INTEGER,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "planned_sets_workout_plan_exercise_id_fkey" FOREIGN KEY ("workout_plan_exercise_id") REFERENCES "workout_plan_exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ("numero_serie" > 0),
  CHECK ("carico_target" IS NULL OR "carico_target" >= 0),
  CHECK ("ripetizioni_target" IS NULL OR "ripetizioni_target" >= 0),
  CHECK ("durata_target_secondi" IS NULL OR "durata_target_secondi" >= 0),
  UNIQUE ("workout_plan_exercise_id", "numero_serie")
);

CREATE TABLE "workouts" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "workout_plan_id" INTEGER,
  "nome_snapshot" TEXT NOT NULL,
  "ora_inizio" DATETIME NOT NULL,
  "ora_fine" DATETIME,
  "durata_secondi" INTEGER NOT NULL DEFAULT 0,
  "completato" BOOLEAN NOT NULL DEFAULT 0,
  "note_generali" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workouts_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK ("durata_secondi" >= 0),
  CHECK ("completato" IN (0, 1)),
  CHECK ("ora_fine" IS NULL OR "ora_fine" >= "ora_inizio")
);

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
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK ("tipo_tracciamento_snapshot" IN ('WEIGHT_REPS', 'REPS', 'TIMED')),
  CHECK ("ordine" > 0),
  CHECK ("tempo_recupero_secondi" >= 0),
  UNIQUE ("workout_id", "ordine")
);

CREATE TABLE "executed_sets" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "workout_exercise_id" INTEGER NOT NULL,
  "numero_serie" INTEGER NOT NULL,
  "carico" REAL,
  "ripetizioni" INTEGER,
  "durata_secondi" INTEGER,
  "completata" BOOLEAN NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "executed_sets_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ("numero_serie" > 0),
  CHECK ("carico" IS NULL OR "carico" >= 0),
  CHECK ("ripetizioni" IS NULL OR "ripetizioni" >= 0),
  CHECK ("durata_secondi" IS NULL OR "durata_secondi" >= 0),
  CHECK ("completata" IN (0, 1)),
  UNIQUE ("workout_exercise_id", "numero_serie")
);

CREATE TABLE "badge_definitions" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "codice" TEXT NOT NULL UNIQUE,
  "nome" TEXT NOT NULL,
  "descrizione" TEXT,
  "icona" TEXT,
  "categoria" TEXT
);

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
  CONSTRAINT "user_badges_executed_set_id_fkey" FOREIGN KEY ("executed_set_id") REFERENCES "executed_sets" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK ("valore" IS NULL OR "valore" >= 0)
);

INSERT INTO "users" ("id", "email", "password_hash", "nome", "cognome", "data_nascita", "peso", "altezza_cm", "data_registrazione", "created_at", "updated_at")
SELECT "id", "email", "password_hash", "nome", "cognome", "data_nascita", "peso", "altezza_cm", "data_registrazione", "created_at", "updated_at"
FROM "_migrate_users";

INSERT INTO "user_settings" ("user_id")
SELECT "id" FROM "users";

INSERT INTO "exercises" ("id", "nome", "descrizione", "gruppo_muscolare", "tipo_attrezzatura", "tipo_tracciamento", "origine", "user_id", "created_at", "updated_at")
SELECT "id", "nome", "descrizione", "gruppo_muscolare", "tipo_attrezzatura", "tipo_tracciamento", "origine", "user_id", "created_at", "updated_at"
FROM "_migrate_exercises"
WHERE ("origine" = 'BASE' AND "user_id" IS NULL) OR ("origine" = 'CUSTOM' AND "user_id" IS NOT NULL);

INSERT INTO "badge_definitions" ("codice", "nome", "descrizione", "icona", "categoria") VALUES
  ('PR_WEIGHT', 'PR Peso Massimo', 'Nuovo peso massimo assoluto registrato su un esercizio.', 'barbell', 'Personal Record'),
  ('PR_REPS', 'PR Ripetizioni', 'Nuovo massimo di ripetizioni in una serie.', 'repeat', 'Personal Record'),
  ('PR_VOLUME', 'PR Volume Totale', 'Nuovo volume totale migliore per un esercizio in una sessione.', 'trending-up', 'Personal Record');

DROP TABLE "_migrate_users";
DROP TABLE "_migrate_exercises";

CREATE INDEX "idx_exercises_user_id" ON "exercises" ("user_id");
CREATE INDEX "idx_exercises_origine" ON "exercises" ("origine");
CREATE INDEX "idx_exercises_gruppo_muscolare" ON "exercises" ("gruppo_muscolare");
CREATE INDEX "idx_exercises_tipo_attrezzatura" ON "exercises" ("tipo_attrezzatura");
CREATE UNIQUE INDEX "idx_unique_custom_exercise_per_user" ON "exercises" ("user_id", "nome", "gruppo_muscolare") WHERE "origine" = 'CUSTOM';
CREATE INDEX "idx_workout_plans_user_id" ON "workout_plans" ("user_id");
CREATE INDEX "idx_workout_plans_user_attiva" ON "workout_plans" ("user_id", "attiva");
CREATE INDEX "idx_workout_plan_exercises_plan_id" ON "workout_plan_exercises" ("workout_plan_id");
CREATE INDEX "idx_workout_plan_exercises_exercise_id" ON "workout_plan_exercises" ("exercise_id");
CREATE INDEX "idx_planned_sets_plan_exercise_id" ON "planned_sets" ("workout_plan_exercise_id");
CREATE INDEX "idx_workouts_user_id" ON "workouts" ("user_id");
CREATE INDEX "idx_workouts_plan_id" ON "workouts" ("workout_plan_id");
CREATE INDEX "idx_workouts_ora_inizio" ON "workouts" ("ora_inizio");
CREATE INDEX "idx_workouts_user_ora_inizio" ON "workouts" ("user_id", "ora_inizio");
CREATE INDEX "idx_workout_exercises_workout_id" ON "workout_exercises" ("workout_id");
CREATE INDEX "idx_workout_exercises_exercise_id" ON "workout_exercises" ("exercise_id");
CREATE INDEX "idx_executed_sets_workout_exercise_id" ON "executed_sets" ("workout_exercise_id");
CREATE INDEX "idx_user_badges_user_id" ON "user_badges" ("user_id");
CREATE INDEX "idx_user_badges_definition_id" ON "user_badges" ("badge_definition_id");
CREATE INDEX "idx_user_badges_exercise_id" ON "user_badges" ("exercise_id");
CREATE INDEX "idx_user_badges_workout_id" ON "user_badges" ("workout_id");
CREATE INDEX "idx_user_badges_workout_exercise_id" ON "user_badges" ("workout_exercise_id");
CREATE INDEX "idx_user_badges_executed_set_id" ON "user_badges" ("executed_set_id");
CREATE INDEX "idx_user_badges_ottenuto_il" ON "user_badges" ("ottenuto_il");
CREATE INDEX "idx_user_badges_user_ottenuto_il" ON "user_badges" ("user_id", "ottenuto_il");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
