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

const trackingTypeMap = {
  weight_reps: 'WEIGHT_REPS',
  reps: 'REPS',
  timed: 'TIMED',
};

const equipmentTypeMap = {
  Macchinari: 'MACCHINARI',
  'Corpo libero': 'CORPO_LIBERO',
  'Pesi liberi': 'PESI_LIBERI',
  'Con pesi': 'CON_PESI',
  Cavi: 'CAVI',
};

const seed = db.transaction(() => {
  const ids = exercises.map((exercise) => exercise.id);
  const placeholders = ids.map(() => '?').join(', ');

  db.prepare(
    `DELETE FROM exercises
     WHERE origine = 'BASE'
       AND id NOT IN (${placeholders})`,
  ).run(...ids);

  const upsert = db.prepare(`
    INSERT INTO exercises (
      id,
      nome,
      descrizione,
      gruppo_muscolare,
      tipo_attrezzatura,
      tipo_tracciamento,
      origine,
      created_at,
      updated_at
    )
    VALUES (
      @id,
      @name,
      @description,
      @muscleGroup,
      @equipmentType,
      @trackingType,
      'BASE',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      nome = excluded.nome,
      descrizione = excluded.descrizione,
      gruppo_muscolare = excluded.gruppo_muscolare,
      tipo_attrezzatura = excluded.tipo_attrezzatura,
      tipo_tracciamento = excluded.tipo_tracciamento,
      origine = 'BASE',
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const exercise of exercises) {
    const trackingType = trackingTypeMap[exercise.trackingType] || 'WEIGHT_REPS';
    const equipmentType = equipmentTypeMap[exercise.equipmentType] || 'ALTRO';

    upsert.run({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      equipmentType,
      trackingType,
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

const count = db.prepare("SELECT COUNT(*) AS count FROM exercises WHERE origine = 'BASE'").get().count;
console.log(`Seeded ${count} base exercises`);

db.close();
