import {
    CoachMuscleGroupDto,
    CoachNextFocusDto,
    CoachNextFocusGroupDto,
} from '../dto/weeklyCoachSummary.dto';

const NEXT_FOCUS_LIMIT = 3;

const STATUS_PRIORITY = {
    none: 0,
    low: 1,
    ok: 2,
    high: 3,
};

function getLastTrainedScore(value: string | null) : number {
    if(!value) return Number.NEGATIVE_INFINITY;

    const time = new Date(value).getTime();

    if(Number.isNaN(time)) return Number.POSITIVE_INFINITY;

    return time;
}

function formatGroupList(groups: CoachNextFocusGroupDto[]) : string {
    const names = groups.map((group) => group.name);

    if(names.length === 1) return names[0];
    if(names.length === 2) return `${names[0]} e ${names[1]}`;

    return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
}

function getFocusReason(group: CoachMuscleGroupDto) : string {
    if(group.status === 'none') {
        return group.lastTrainedAt
            ? 'Non allenato questa settimana'
            : 'Mai allenato';
    }

    return `Solo ${group.sets} serie questa settimana`;
}

export function buildCoachNextFocus(muscleGroups: CoachMuscleGroupDto[]) : CoachNextFocusDto {
    const groups = muscleGroups
        .filter((group) => group.status === 'none' || group.status === 'low')
        .sort((left, right) => {
            const leftPriority = STATUS_PRIORITY[left.status] ?? 99;
            const rightPriority = STATUS_PRIORITY[right.status] ?? 99;

            if(leftPriority !== rightPriority) return leftPriority - rightPriority;

            const leftLastTrained = getLastTrainedScore(left.lastTrainedAt);
            const rightLastTrained = getLastTrainedScore(right.lastTrainedAt);

            if(leftLastTrained !== rightLastTrained) {
                return leftLastTrained - rightLastTrained;
            }

            if(left.sets !== right.sets) return left.sets - right.sets;

            return left.name.localeCompare(right.name);
        })
        .slice(0, NEXT_FOCUS_LIMIT)
        .map((group) => ({
            name: group.name,
            status: group.status,
            sets: group.sets,
            lastTrainedAt: group.lastTrainedAt,
            reason: getFocusReason(group),
        }));

    if(groups.length === 0) {
        return {
            title: 'Copertura equilibrata',
            message: 'La copertura muscolare della settimana è equilibrata. Mantieni questa distribuzione.',
            groups,
        };
    }

    return {
        title: 'Prossimo focus consigliato',
        message: `Nel prossimo allenamento dai priorità a: ${formatGroupList(groups)}.`,
        groups,
    };
}