export const WEEK_STEP_DAYS = 7;

export function startOfWeek(dateValue = new Date()) {
    const date = new Date(dateValue);
    const day = (date.getDay() + 6) % 7;

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - day);

    return date;
}

export function addDays(dateValue, amount) {
    const date = new Date(dateValue);
    date.setDate(date.getDate() + amount);

    return date;
}

export function toLocalDateKey(dateValue) {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function isSameWeekStart(left, right) {
    return toLocalDateKey(startOfWeek(left)) === toLocalDateKey(startOfWeek(right));
}