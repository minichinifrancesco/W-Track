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