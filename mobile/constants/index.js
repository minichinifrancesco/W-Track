export const logoFull = require('../assets/logo.png');
export const logoCompact = require('../assets/logo.png');

export const COLORS = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  // Light theme defaults (will be overridden dynamically in styles)
  background: '#f9fafb',
  card: '#ffffff',
  textDark: '#111827',
  textMuted: '#6b7280',
  border: '#e5e7eb',
};

// Exercise types:
// 'weight_reps' = Peso + Ripetizioni (es. panca piana)
// 'reps'        = Solo Ripetizioni (es. flessioni)
// 'timed'       = A Tempo in minuti (es. plank, cardio)

export const getAvailableMuscleGroups = (allExercises = []) => {
  const groups = new Set();
  allExercises.forEach((ex) => groups.add(ex.muscleGroup));
  return Array.from(groups);
};
