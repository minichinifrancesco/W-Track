import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import {
    formatSignedDuration,
    formatSignedNumber,
    formatSignedPercent,
    formatSignedVolume
} from '../utils/coachFormatter';
import CoachComparisonRow from './CoachComparisonRow';

export default function CoachComparisonCard({ summary, colors, styles }) {
    const rows = useMemo(() => {
        if(!summary?.comparison) return [];

        const comparison = summary.comparison;

        return [
            {
                label: 'Sessioni',
                value: formatSignedNumber(comparison.sessionsDelta),
                rawValue: comparison.sessionsDelta,
            },
            {
                label: 'Durata',
                value: formatSignedDuration(comparison.durationSecondsDelta),
                rawValue: comparison.durationSecondsDelta,
            },
            {
                label: 'Serie completate',
                value: formatSignedNumber(comparison.completedSetsDelta),
                rawValue: comparison.completedSetsDelta,
            },
            {
                label: 'Volume',
                value: formatSignedVolume(comparison.volumeDelta),
                rawValue: comparison.volumeDelta,
            },
            {
                label: 'Variazione volume',
                value: formatSignedPercent(comparison.volumeDeltaPercent),
                rawValue: comparison.volumeDeltaPercent,
            },
        ];
    }, [summary]);

    if(!summary?.comparison) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Confronto settimana precedente</Text>

            <Text 
                style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 8,
                }}
            >
                Differenza rispetto al periodo precedente
            </Text>

            {rows.map((row) => (
                <CoachComparisonRow
                    key={row.label}
                    label={row.label}
                    value={row.value}
                    rawValue={row.rawValue}
                    colors={colors}
                />
            ))}
        </View>
    );
}