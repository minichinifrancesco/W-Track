import { BadRequestException } from "@nestjs/common";
import { CoachPeriod } from "../types/coachQueryRows.types";

export function getWeekPeriod(weekStart?: string) : CoachPeriod {
    const baseDate = weekStart ? new Date(`${weekStart}T00:00:00`) : new Date();

    if (Number.isNaN(baseDate.getTime())) {
        throw new BadRequestException('weekStart non valido');
    }

    const day = baseDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + diffToMonday);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return { start, end};
}

export function getPreviousPeriod(period: CoachPeriod) : CoachPeriod {
    const start = new Date(period.start);
    start.setDate(start.getDate() - 7);

    const end = new Date(period.end);
    end.setDate(end.getDate() - 7);

    return { start, end };
}