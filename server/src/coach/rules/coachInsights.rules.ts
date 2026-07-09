import {
    CoachBadgeSummaryDto,
    CoachInsightDto,
    CoachMuscleGroupDto,
    CoachTotalsDto,
} from '../dto/weeklyCoachSummary.dto';

export function buildCoachInsights(totals: CoachTotalsDto, previousTotals: CoachTotalsDto, muscleGroups: CoachMuscleGroupDto[], badges: CoachBadgeSummaryDto) : CoachInsightDto[] {
    const insights: CoachInsightDto[] = [];

    if(totals.sessions === 0) {
        insights.push({
            type: 'no_sessions',
            severity: 'warning',
            title: 'Nessun allenamento questa settimana',
            message: 'Non hai ancora registrato sessioni in questo periodo',
            relatedMuscleGroup: null,
        });
    }

    if(totals.sessions >= 3) {
        insights.push({
            type: 'consistency',
            severity: 'success',
            title: 'Buona costanza',
            message: `Hai completato ${totals.sessions} allenamenti questa settimana.`,
            relatedMuscleGroup: null,
        });
    }

    const lowGroups = muscleGroups.filter((group) => group.status === 'low');
    for(const group of lowGroups.slice(0,2)){
        insights.push({
            type: 'undertrained',
            severity: 'warning',
            title: `${group.name} poco allenato`,
            message: `Hai completato solo ${group.sets} serie per ${group.name}`,
            relatedMuscleGroup: group.name
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