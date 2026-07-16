import { addDays, toLocalDateKey } from './coachDate';

const WEEKDAY_LABELS = [
    'Lun',
    'Mar',
    'Mer',
    'Gio',
    'Ven',
    'Sab',
    'Dom'
];

export function buildCoachWeekDays(summary) {
    const periodStart = summary?.period?.start;
    const days = Array.isArray(summary?.days) ? summary.days : null;

    if(!periodStart) return [];

    const start = new Date(periodStart);
    const daysByDate = new Map(days.map((day) => [day.date, day]));

    return WEEKDAY_LABELS.map((label, index) => {
        const date = addDays(start, index);
        const dateKey = toLocalDateKey(date);
        const dayData = daysByDate.get(dateKey);

        return {
            label,
            date: dateKey,
            sessions: dayData?.sessions || 0,
            durationSeconds: dayData?.durationSeconds || 0,
            completedSets: dayData?.completedSets || 0,
            volume: dayData?.volume || 0,
            active: Boolean(dayData)
        };
    });
}