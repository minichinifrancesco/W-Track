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