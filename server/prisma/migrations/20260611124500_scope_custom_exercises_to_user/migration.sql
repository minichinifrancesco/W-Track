-- Scope custom exercises to their owner while keeping base catalog exercises global.
DROP INDEX "exercises_name_muscleGroup_key";

ALTER TABLE "exercises" ADD COLUMN "userId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "exercises_type_idx" ON "exercises"("type");
CREATE INDEX "exercises_userId_idx" ON "exercises"("userId");
