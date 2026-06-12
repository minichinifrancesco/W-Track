export const PROGRESS_METRICS = [
  { id: 'maxWeight', label: 'Peso max', unit: 'kg', color: '#2563eb' },
  { id: 'bestSet', label: 'Migliore serie', unit: 'kg x rep', color: '#16a34a' },
  { id: 'volume', label: 'Volume', unit: 'kg', color: '#f97316' },
  { id: 'maxReps', label: 'Reps max', unit: 'rep', color: '#9333ea' },
  { id: 'oneRm', label: '1RM stimato', unit: 'kg', color: '#dc2626' },
];

export const PROGRESS_RANGES = [
  { id: '30d', label: '30 giorni', days: 30 },
  { id: '3m', label: '3 mesi', days: 90 },
  { id: '6m', label: '6 mesi', days: 180 },
  { id: '1y', label: '1 anno', days: 365 },
  { id: 'all', label: 'Tutto', days: null },
];

export const BADGE_DEFINITIONS = [
  {
    id: 'PR_WEIGHT',
    name: 'PR Peso Massimo',
    description: 'Nuovo peso massimo assoluto registrato su un esercizio.',
    icon: 'barbell',
    category: 'Personal Record',
  },
  {
    id: 'PR_REPS',
    name: 'PR Ripetizioni',
    description: 'Nuovo massimo di ripetizioni in una serie.',
    icon: 'repeat',
    category: 'Personal Record',
  },
  {
    id: 'PR_VOLUME',
    name: 'PR Volume Totale',
    description: 'Nuovo volume totale migliore per un esercizio in una sessione.',
    icon: 'trending-up',
    category: 'Personal Record',
  },
];

export const getBadgeDefinition = (id) =>
  BADGE_DEFINITIONS.find((badge) => badge.id === id);

export const getExerciseKey = (exercise) => {
  if (!exercise) return '';
  const stableId = exercise.exerciseId ?? exercise.catalogExerciseId ?? exercise.id;
  if (stableId !== undefined && stableId !== null) return String(stableId);
  return normalizeExerciseName(exercise.name);
};

export const normalizeExerciseName = (name = '') =>
  String(name).trim().toLowerCase();

export const exerciseMatches = (historyExercise, targetExercise) => {
  if (!historyExercise || !targetExercise) return false;
  const historyStableId = historyExercise.exerciseId ?? historyExercise.catalogExerciseId;
  const targetStableId = targetExercise.exerciseId ?? targetExercise.catalogExerciseId ?? targetExercise.id;

  if (
    historyStableId !== undefined &&
    historyStableId !== null &&
    targetStableId !== undefined &&
    targetStableId !== null &&
    String(historyStableId) === String(targetStableId)
  ) {
    return true;
  }

  return normalizeExerciseName(historyExercise.name) === normalizeExerciseName(targetExercise.name);
};

export const getCompletedPerformanceSets = (exercise) =>
  (exercise?.setDetails || [])
    .filter((set) => set?.completed)
    .map((set) => ({
      weight: Number(set.weight) || 0,
      reps: Number(set.reps) || 0,
      duration: Number(set.duration) || 0,
      completed: true,
      badges: Array.isArray(set.badges) ? set.badges : [],
    }))
    .filter((set) => set.weight > 0 || set.reps > 0 || set.duration > 0);

export const calculateExerciseStats = (exercise) => {
  const sets = getCompletedPerformanceSets(exercise);
  const weightedSets = sets.filter((set) => set.weight > 0 || set.reps > 0);

  return weightedSets.reduce(
    (stats, set) => {
      const setVolume = set.weight * set.reps;
      const oneRm = set.weight > 0 && set.reps > 0 ? set.weight * (1 + set.reps / 30) : 0;

      return {
        maxWeight: Math.max(stats.maxWeight, set.weight),
        bestSet: Math.max(stats.bestSet, setVolume),
        volume: stats.volume + setVolume,
        maxReps: Math.max(stats.maxReps, set.reps),
        oneRm: Math.max(stats.oneRm, oneRm),
        completedSets: stats.completedSets + 1,
      };
    },
    {
      maxWeight: 0,
      bestSet: 0,
      volume: 0,
      maxReps: 0,
      oneRm: 0,
      completedSets: 0,
    }
  );
};

export const buildExerciseProgressData = (history, exercise, rangeId = 'all') => {
  const range = PROGRESS_RANGES.find((item) => item.id === rangeId) || PROGRESS_RANGES[4];
  const cutoff = range.days
    ? new Date(Date.now() - range.days * 24 * 60 * 60 * 1000)
    : null;

  return (history || [])
    .filter((record) => {
      if (!record?.date) return false;
      if (!cutoff) return true;
      return new Date(record.date) >= cutoff;
    })
    .map((record) => {
      const matchedExercises = (record.exercises || []).filter((item) =>
        exerciseMatches(item, exercise)
      );
      if (matchedExercises.length === 0) return null;

      const mergedStats = matchedExercises.reduce(
        (total, item) => {
          const stats = calculateExerciseStats(item);
          return {
            maxWeight: Math.max(total.maxWeight, stats.maxWeight),
            bestSet: Math.max(total.bestSet, stats.bestSet),
            volume: total.volume + stats.volume,
            maxReps: Math.max(total.maxReps, stats.maxReps),
            oneRm: Math.max(total.oneRm, stats.oneRm),
            completedSets: total.completedSets + stats.completedSets,
          };
        },
        {
          maxWeight: 0,
          bestSet: 0,
          volume: 0,
          maxReps: 0,
          oneRm: 0,
          completedSets: 0,
        }
      );

      if (mergedStats.completedSets === 0) return null;

      return {
        id: record.id,
        date: record.date,
        workoutName: record.name,
        durationSeconds: record.durationSeconds || 0,
        exercises: matchedExercises,
        ...mergedStats,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getHistoricalBestForExercise = (history, exercise) => {
  return (history || []).reduce(
    (best, record) => {
      (record.exercises || [])
        .filter((item) => exerciseMatches(item, exercise))
        .forEach((item) => {
          const stats = calculateExerciseStats(item);
          best.maxWeight = Math.max(best.maxWeight, stats.maxWeight);
          best.maxReps = Math.max(best.maxReps, stats.maxReps);
          best.volume = Math.max(best.volume, stats.volume);
        });
      return best;
    },
    { maxWeight: 0, maxReps: 0, volume: 0 }
  );
};

export const detectPersonalRecords = (workoutExercises, previousHistory, recordDate, recordId) => {
  const newBadges = [];

  const exercisesWithBadges = (workoutExercises || []).map((exercise) => {
    const currentStats = calculateExerciseStats(exercise);
    const previousBest = getHistoricalBestForExercise(previousHistory, exercise);
    const exerciseBadges = [];
    const setBadgeTargets = {};

    const addBadge = (definitionId, metricValue, label) => {
      const definition = getBadgeDefinition(definitionId);
      const badge = {
        id: `${definitionId}-${getExerciseKey(exercise)}-${recordId}-${newBadges.length}`,
        definitionId,
        name: definition?.name || label,
        description: definition?.description || label,
        icon: definition?.icon || 'trophy',
        category: definition?.category || 'Personal Record',
        earnedAt: recordDate,
        exerciseKey: getExerciseKey(exercise),
        exerciseName: exercise.name,
        workoutRecordId: recordId,
        value: metricValue,
      };
      newBadges.push(badge);
      exerciseBadges.push(badge);
      return badge;
    };

    if (currentStats.maxWeight > 0 && currentStats.maxWeight > previousBest.maxWeight) {
      const badge = addBadge('PR_WEIGHT', currentStats.maxWeight, 'PR Peso Massimo');
      const targetIndex = (exercise.setDetails || []).findIndex(
        (set) => set?.completed && Number(set.weight) === currentStats.maxWeight
      );
      if (targetIndex >= 0) setBadgeTargets[targetIndex] = [...(setBadgeTargets[targetIndex] || []), badge];
    }

    if (currentStats.maxReps > 0 && currentStats.maxReps > previousBest.maxReps) {
      const badge = addBadge('PR_REPS', currentStats.maxReps, 'PR Ripetizioni');
      const targetIndex = (exercise.setDetails || []).findIndex(
        (set) => set?.completed && Number(set.reps) === currentStats.maxReps
      );
      if (targetIndex >= 0) setBadgeTargets[targetIndex] = [...(setBadgeTargets[targetIndex] || []), badge];
    }

    if (currentStats.volume > 0 && currentStats.volume > previousBest.volume) {
      addBadge('PR_VOLUME', currentStats.volume, 'PR Volume Totale');
    }

    return {
      ...exercise,
      prBadges: [...(exercise.prBadges || []), ...exerciseBadges],
      setDetails: (exercise.setDetails || []).map((set, index) => ({
        ...set,
        badges: [...(set.badges || []), ...(setBadgeTargets[index] || [])],
      })),
    };
  });

  return { exercises: exercisesWithBadges, badges: newBadges };
};

