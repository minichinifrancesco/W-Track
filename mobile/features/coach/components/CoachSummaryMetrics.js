import React, { useMemo } from "react";
import { Text, View } from 'react-native';
import { formatDuration, formatVolume } from "../utils/coachFormatter";
import CoachMetricCard from "./CoachMetricCard";

export default function CoachSummaryMetrics({ summary, colors, styles, formatOptions }) {
    const metrics = useMemo(() => {
        if(!summary) return [];

        return [
            {
                label: 'Sessioni',
                value: summary.totals.sessions,
                icon: 'barbell-outline',
            },
            {
                label: 'Durata',
                value: formatDuration(summary.totals.durationSeconds),
                icon: 'time-outline',
            },
            {
                label: 'Serie',
                value: summary.totals.completedSets,
                icon: 'checkmark-circle-outline',
            },
            {
                label: 'Volume',
                value: formatVolume(summary.totals.volume, formatOptions),
                icon: 'trending-up-outline',
            },
        ];
    }, [summary, formatOptions]);

    if(!summary) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Riepilogo</Text>

            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginTop: 12,
                }}
            >
                {metrics.map((metric) => (
                    <CoachMetricCard key={metric.label} metric={metric} colors={colors} />
                ))}
            </View>
        </View>
    );
}