export function formatDuration(seconds = 0) {
    const safeSeconds = Number(seconds || 0);
    const totalMinutes = Math.floor(safeSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if(hours > 0) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
}

export function formatNumber(value = 0) {
    return Math.round(Number(value || 0)).toLocaleString('it-IT');
}

export function formatSignedNumber(value = 0) {
    const number = Math.round(Number(value || 0));

    if(number > 0) return `+${number.toLocaleString('it-IT')}`;
    return number.toLocaleString('it-IT');
}

export function formatSignedPercent(value = 0) {
    const number = Number(value || 0);
    const rounded = Math.round(number *10) / 10;
    const formatted = rounded.toLocaleString('it-IT');

    if(rounded > 0) return `+${formatted}%`;
    return `${formatted}%`;
}

export function formatSignedDuration(seconds = 0) {
    const value = Number(seconds || 0);
    const absSeconds = Math.abs(value);
    const totalMinutes = Math.floor(absSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const prefix = value > 0 ? '+' : value < 0 ? '-' : '';

    if(hours > 0) return `${prefix}${hours}h ${minutes}m`;
    return `${prefix}${minutes}m`;
}

export function formatLastTrainedAt(value) {
    if(!value) return 'Mai allenato';

    const date = new Date(value);
    if(Number.isNaN(date.getTime())) return 'Data non disponibile';

    const diffMs = Date.now() - date.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if(days <= 0) return 'Oggi';
    if(days === 1) return 'Ieri';

    return `${days} giorni fa`;
}

export function formatSetCount(value = 0) {
    const count = Number(value || 0);

    if(count === 1) return '1 serie';

    return `${count} serie`;
}

export function formatExerciseCount(value = 0) {
    const count = Number(value || 0);

    if(count === 1) return '1 esercizio';

    return `${count} esercizi`;
}

export function formatVolume(value = 0) {
    return `${formatNumber(value)} kg x rep`;
}

export function formatSignedVolume(value = 0) {
    return `${formatSignedNumber(value)} kg x rep`;
}

export function formatWeight(value = 0) {
    return `${formatNumber(value)} kg`;
}

export function formatReps(value = 0) {
    const count = Number(value || 0);

    if(count === 1) return '1 rep';

    return `${formatNumber(count)} reps`;
}

export function formatBadgeValue(value, code) {
    if(value === null || value === undefined) return null;

    const safeCode = String(code || '').toUpperCase();

    if(safeCode.includes('VOLUME')) return formatVolume(value);
    if(safeCode.includes('PESO') || safeCode.includes('WEIGHT')) return formatWeight(value);
    if(safeCode.includes('REP')) return formatReps(value);

    return formatNumber(value);
}