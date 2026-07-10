import {
    CoachBadgeSummaryDto,
    CoachInsightDto,
    CoachMuscleGroupDto,
    CoachTotalsDto,
} from '../dto/weeklyCoachSummary.dto';

const formatDaysSince = (dateValue: string | null) : number | null => {
    if(!dateValue) return null;

    const date = new Date(dateValue);
    if(Number.isNaN(date.getTime())) return null;

    const diffMs = Date.now() - date.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 *24));

    return Math.max(days, 0);
}

const buildMissingMuscleGroupMessage = (group: CoachMuscleGroupDto) : string => {
    const daySince = formatDaysSince(group.lastTrainedAt);

    if(daySince === null){
        return `Non hai mai allenato ${group.name}. Inseriscilo nel prossimo allenamento.`;
    }

    if(daySince === 0){
        return `Questa settimana non hai completato serie per ${group.name}, ma risulta allenato oggi. Controlla se hai salvato correttamente la sessione.`;
    }

    if(daySince === 1){
        return `Questa settimana non hai completato serie per ${group.name}. Ultima volta: ieri.`;
    }

    return `Questa settimana non hai completato serie per ${group.name}. Ultima volta: ${daySince} giorni fa.`;
}

export function buildCoachInsights(totals: CoachTotalsDto, previousTotals: CoachTotalsDto, muscleGroups: CoachMuscleGroupDto[], badges: CoachBadgeSummaryDto) : CoachInsightDto[] {
    const insights: CoachInsightDto[] = [];

    if(totals.sessions === 0){
        insights.push({
            type: 'no_sessions',
            severity: 'warning',
            title: 'Nessun allenamento questa settimana',
            message: 'Non hai ancora registrato sessioni in questo periodo.',
            relatedMuscleGroup: null,
        });

        return insights;
    }

    const missingGroups = muscleGroups.filter((group) => group.status === 'none');
    for(const group of missingGroups.slice(0, 3)){
        insights.push({
            type: 'not_trained',
            severity: 'danger',
            title: `${group.name} non allenato`,
            message: buildMissingMuscleGroupMessage(group),
            relatedMuscleGroup: group.name,
        });
    }

    const lowGroups = muscleGroups.filter((group) => group.status === 'low');
    for(const group of lowGroups.slice(0, 2)){
        insights.push({
            type: 'undertrained',
            severity: 'warning',
            title: `${group.name} poco allenato`,
            message: `Hai completato solo ${group.sets} serie per ${group.name}. Potrebbe valere la pena richiamarlo nei prossimi allenamenti.`,
            relatedMuscleGroup: group.name,
        });
    }

    if(totals.sessions >= 3){
        insights.push({
            type: 'consistency',
            severity: 'success',
            title: 'Buona costanza',
            message: `Hai completato ${totals.sessions} allenamenti questa settimana.`,
            relatedMuscleGroup: null,
        });
    }

    if(totals.volume > previousTotals.volume && previousTotals.volume > 0){
        insights.push({
            type: 'volume_up',
            severity: 'success',
            title: 'Volume in crescita',
            message: 'Hai aumentato il volume totale rispetto alla settimana precedente.',
            relatedMuscleGroup: null,
        });
    }

    if(badges.earned > 0){
        insights.push({
            type: 'badges_earned',
            severity: 'success',
            title: 'Nuovi record',
            message: `Hai ottenuto ${badges.earned} badge in questa settimana.`,
            relatedMuscleGroup: null,
        });
    }

    return insights;
}