import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const TIMED_TYPES = new Set(['timed', 'time', 'plank', 'cardio']);

const sanitizeFileName = (value = 'scheda') => {
  const cleaned = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  return cleaned || 'scheda';
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getWorkoutFileName = (workout, extension) =>
  `${sanitizeFileName(workout?.name)}.${extension}`;

const getExerciseSets = (exercise) => {
  if (Array.isArray(exercise.setDetails) && exercise.setDetails.length > 0) {
    return exercise.setDetails;
  }

  const count = Number(exercise.sets) || 1;
  return Array.from({ length: count }, () => ({
    weight: exercise.weight || 0,
    reps: exercise.reps || 0,
    duration: exercise.duration || 0,
  }));
};

const isTimedExercise = (exercise) => TIMED_TYPES.has(exercise?.type);
const getDurationValue = (exercise, setDetail) =>
  setDetail.duration ?? exercise.duration ?? 0;
const formatMinutes = (value) => `${value || 0} min`;

const formatSetText = (exercise, setDetail, index) => {
  if (isTimedExercise(exercise)) {
    return `Serie ${index + 1}: ${formatMinutes(getDurationValue(exercise, setDetail))}`;
  }

  const reps = setDetail.reps ?? exercise.reps ?? 0;
  const weight = setDetail.weight ?? exercise.weight ?? 0;
  return `Serie ${index + 1}: ${reps} reps @ ${weight}kg`;
};

export const buildWorkoutText = (workout) => {
  const exercises = workout?.exercises || [];
  const lines = [
    `Scheda: ${workout?.name || 'Senza nome'}`,
    `Esercizi: ${exercises.length}`,
    '',
  ];

  if (exercises.length === 0) {
    lines.push('Nessun esercizio presente.');
    return lines.join('\n');
  }

  exercises.forEach((exercise, exerciseIndex) => {
    lines.push(`${exerciseIndex + 1}. ${exercise.name || 'Esercizio senza nome'}`);

    if (exercise.muscleGroup) {
      lines.push(`Gruppo muscolare: ${exercise.muscleGroup}`);
    }

    getExerciseSets(exercise).forEach((setDetail, setIndex) => {
      lines.push(`- ${formatSetText(exercise, setDetail, setIndex)}`);
    });

    if (exercise.restTime) {
      lines.push(`Recupero: ${exercise.restTime}s`);
    }

    if (exercise.note) {
      lines.push(`Note: ${exercise.note}`);
    }

    lines.push('');
  });

  return lines.join('\n').trimEnd();
};

const buildSetRowsHtml = (exercise) =>
  getExerciseSets(exercise)
    .map((setDetail, setIndex) => {
      const details = isTimedExercise(exercise)
        ? formatMinutes(getDurationValue(exercise, setDetail))
        : `${setDetail.reps ?? exercise.reps ?? 0} reps @ ${setDetail.weight ?? exercise.weight ?? 0}kg`;

      return `
        <tr>
          <td>${setIndex + 1}</td>
          <td>${escapeHtml(details)}</td>
        </tr>
      `;
    })
    .join('');

const buildWorkoutHtml = (workout) => {
  const exercises = workout?.exercises || [];
  const exerciseBlocks = exercises.length
    ? exercises
        .map(
          (exercise, index) => `
            <section class="exercise">
              <h2>${index + 1}. ${escapeHtml(exercise.name || 'Esercizio senza nome')}</h2>
              ${
                exercise.muscleGroup
                  ? `<p class="muted">Gruppo muscolare: ${escapeHtml(exercise.muscleGroup)}</p>`
                  : ''
              }
              <table>
                <thead>
                  <tr>
                    <th>Serie</th>
                    <th>Dettagli</th>
                  </tr>
                </thead>
                <tbody>
                  ${buildSetRowsHtml(exercise)}
                </tbody>
              </table>
              ${
                exercise.restTime
                  ? `<p class="muted">Recupero: ${escapeHtml(exercise.restTime)}s</p>`
                  : ''
              }
              ${exercise.note ? `<p class="note">Note: ${escapeHtml(exercise.note)}</p>` : ''}
            </section>
          `
        )
        .join('')
    : '<p class="empty">Nessun esercizio presente.</p>';

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.45;
            margin: 32px;
          }
          h1 {
            color: #15803d;
            font-size: 28px;
            margin: 0 0 4px;
          }
          h2 {
            font-size: 18px;
            margin: 0 0 8px;
          }
          .muted {
            color: #475569;
            margin: 0 0 10px;
          }
          .exercise {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            margin-top: 18px;
            padding: 16px;
          }
          table {
            border-collapse: collapse;
            margin-bottom: 10px;
            width: 100%;
          }
          th,
          td {
            border-bottom: 1px solid #e2e8f0;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f8fafc;
            color: #334155;
            font-size: 12px;
            text-transform: uppercase;
          }
          .note {
            background: #f0fdf4;
            border-left: 4px solid #86B749;
            margin: 10px 0 0;
            padding: 8px 10px;
          }
          .empty {
            color: #64748b;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(workout?.name || 'Scheda senza nome')}</h1>
        <p class="muted">${exercises.length} esercizi</p>
        ${exerciseBlocks}
      </body>
    </html>
  `;
};

const downloadTextOnWeb = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const shareFile = async (uri, options) => {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    return uri;
  }

  await Sharing.shareAsync(uri, options);
  return uri;
};

export const exportWorkoutAsText = async (workout) => {
  const content = buildWorkoutText(workout);
  const fileName = getWorkoutFileName(workout, 'txt');

  if (Platform.OS === 'web') {
    downloadTextOnWeb(content, fileName);
    return null;
  }

  const directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  const uri = `${directory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return shareFile(uri, {
    dialogTitle: 'Scarica scheda in testo',
    mimeType: 'text/plain',
    UTI: 'public.plain-text',
  });
};

export const exportWorkoutAsPdf = async (workout) => {
  const html = buildWorkoutHtml(workout);

  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return null;
  }

  const fileName = getWorkoutFileName(workout, 'pdf');
  const { uri } = await Print.printToFileAsync({ html });
  const directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  const targetUri = `${directory}${fileName}`;

  await FileSystem.copyAsync({ from: uri, to: targetUri });

  return shareFile(targetUri, {
    dialogTitle: 'Condividi scheda in PDF',
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
  });
};
