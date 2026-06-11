const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const prismaDir = __dirname;
const dbPath = path.join(prismaDir, 'dev.db');
const exercisesPath = path.join(prismaDir, 'base-exercises.json');

const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

if (!Array.isArray(exercises) || exercises.length === 0) {
  throw new Error('base-exercises.json must contain at least one exercise');
}

const db = new Database(dbPath);

const seed = db.transaction(() => {
  const ids = exercises.map((exercise) => exercise.id);
  const placeholders = ids.map(() => '?').join(', ');

  db.prepare(
    `DELETE FROM exercises
     WHERE type = 'BASE'
       AND id NOT IN (${placeholders})`,
  ).run(...ids);

  const upsert = db.prepare(`
    INSERT INTO exercises (
      id,
      name,
      description,
      muscleGroup,
      subcategory,
      trackingType,
      type,
      createdAt,
      updatedAt
    )
    VALUES (
      @id,
      @name,
      @description,
      @muscleGroup,
      @subcategory,
      @trackingType,
      'BASE',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      muscleGroup = excluded.muscleGroup,
      subcategory = excluded.subcategory,
      trackingType = excluded.trackingType,
      type = 'BASE',
      updatedAt = CURRENT_TIMESTAMP
  `);

  for (const exercise of exercises) {
    upsert.run({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      subcategory: exercise.subcategory,
      trackingType: exercise.trackingType || 'weight_reps',
    });
  }

  const hasSequence = db
    .prepare(
      `SELECT 1 AS ok
       FROM sqlite_master
       WHERE type = 'table' AND name = 'sqlite_sequence'`,
    )
    .get();

  if (hasSequence) {
    const sequence = db.prepare('SELECT MAX(id) AS value FROM exercises').get().value || 0;
    const updated = db
      .prepare("UPDATE sqlite_sequence SET seq = ? WHERE name = 'exercises'")
      .run(sequence);

    if (updated.changes === 0) {
      db.prepare('INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)').run(
        'exercises',
        sequence,
      );
    }
  }
});

seed();

const count = db.prepare("SELECT COUNT(*) AS count FROM exercises WHERE type = 'BASE'").get().count;
console.log(`Seeded ${count} base exercises`);

db.close();
