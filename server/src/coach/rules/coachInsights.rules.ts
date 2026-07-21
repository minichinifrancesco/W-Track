import {
    CoachInsightDto,
    CoachMuscleGroupDto,
    CoachTotalsDto,
} from '../dto/weeklyCoachSummary.dto';

const GOOD_CONSISTENCY_SESSIONS = 3;
const LIGHT_WEEK_SESSIONS = 1;
const HIGH_FREQUENCY_SESSIONS = 5;

const LOW_AVERAGE_DURATION_SECONDS = 25 * 60;
const HIGH_AVERAGE_DURATION_SECONDS = 90 * 60;

const SIGNIFICANT_VOLUME_DELTA_PERCENT = 10;

function getVolumeDeltaPercent(totals: CoachTotalsDto, previousTotals: CoachTotalsDto) : number {
    if(previousTotals.volume <= 0) {
        return totals.volume > 0 ? 100 : 0;
    }
    return Math.round(((totals.volume - previousTotals.volume) / previousTotals.volume) * 100);
}

function hasPossibleOverload(muscleGroups: CoachMuscleGroupDto[]) : boolean {
    return muscleGroups.some((group) => group.status === 'high');
}

export function buildCoachInsights(totals: CoachTotalsDto, previousTotals: CoachTotalsDto, muscleGroups: CoachMuscleGroupDto[]) : CoachInsightDto[] {
    const insights: CoachInsightDto[] = [];

    if(totals.sessions === 0) {
        insights.push({
            type: 'no_sessions',
            severity: 'warning',
            title: 'Nessun allenamento questa settimana',
            message: 'Non hai ancora registrato sessioni in questo periodo.',
        });

        return insights;
    }

    if(totals.sessions === LIGHT_WEEK_SESSIONS) {
        insights.push({
            type: 'light_week',
            severity: 'warning',
            title: 'Settimana leggera',
            message: 'Hai registrato un solo allenamento nel periodo. Se non era previsto, prova a pianificare una seconda sessione.',
        });
    }

    if(totals.sessions >= GOOD_CONSISTENCY_SESSIONS) {
        insights.push({
            type: 'consistency',
            severity: 'success',
            title: 'Buona costanza',
            message: `Hai completato ${totals.sessions} allenamenti questa settimana.`,
        });
    }

    if(totals.sessions >= HIGH_FREQUENCY_SESSIONS) {
        insights.push({
            type: 'recovery_attention',
            severity: 'info',
            title: 'Occhio al recupero',
            message: 'Hai registrato molte sessioni nel periodo. Assicurati di lasciare spazio a recupero e qualità del sonno.',
        });
    }

    const volumeDeltaPercent = getVolumeDeltaPercent(totals, previousTotals);

    if(previousTotals.volume <= 0 && totals.volume > 0) {
        insights.push({
            type: 'volume_started',
            severity: 'success',
            title: 'Volume registrato',
            message: 'Questa settimana hai registrato volume di allenamento dopo un periodo precedente senza volume.',
        });
    }

    if(previousTotals.volume > 0 && volumeDeltaPercent >= SIGNIFICANT_VOLUME_DELTA_PERCENT) {
        insights.push({
            type: 'volume_up',
            severity: 'success',
            title: 'Volume in crescita',
            message: `Hai aumentato il volume totale del ${volumeDeltaPercent}% rispetto alla settimana precedente.`,
        });
    }

    if(previousTotals.volume > 0 && volumeDeltaPercent <= -SIGNIFICANT_VOLUME_DELTA_PERCENT) {
        insights.push({
            type: 'volume_down',
            severity: 'warning',
            title: 'Volume in calo',
            message: `Il volume totale è sceso del ${Math.abs(volumeDeltaPercent)}% rispetto alla settimana precedente. Se era una settimana di scarico, va bene così.`,
        });
    }

    if(totals.averageDurationSeconds > 0 && totals.averageDurationSeconds < LOW_AVERAGE_DURATION_SECONDS) {
        insights.push({
            type: 'short_sessions',
            severity: 'info',
            title: 'Sessioni brevi',
            message: 'La durata media degli allenamenti è bassa. Può andare bene per richiami rapidi, ma controlla che il lavoro sia sufficiente.',
        });
    }

    if(totals.averageDurationSeconds >= HIGH_AVERAGE_DURATION_SECONDS) {
        insights.push({
            type: 'long_sessions',
            severity: 'warning',
            title: 'Sessioni molto lunghe',
            message: 'La durata media degli allenamenti è alta. Valuta se distribuire meglio il lavoro durante la settimana.',
        });
    }

    if(hasPossibleOverload(muscleGroups) && totals.sessions < GOOD_CONSISTENCY_SESSIONS) {
        insights.push({
            type: 'possible_overload',
            severity: 'info',
            title: 'Carico concentrato',
            message: 'Alcuni gruppi risultano molto allenati in poche sessioni. Potrebbe essere utile distribuire meglio il carico.',
        });
    }

    if(insights.length === 0) {
        insights.push({
            type: 'stable_week',
            severity: 'info',
            title: 'Settimana stabile',
            message: 'Il periodo è in linea con il precedente. Continua a monitorare costanza, qualità e recupero.',
        });
    }

    return insights;
}