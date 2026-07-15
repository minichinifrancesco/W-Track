import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import CoachInsightCard from './CoachInsightCard';

const SEVERITY_ORDER = {
    danger: 0,
    warning: 1,
    success: 2,
    info: 3,
};

export default function CoachInsightsSection({ summary, colors, styles }) {
    const insights = useMemo(() => {
        const items = summary?.insights || [];

        return [...items].sort((left, right) => {
            const leftOrder = SEVERITY_ORDER[left.severity] ?? 99;
            const rightOrder = SEVERITY_ORDER[right.severity] ?? 99;

            return leftOrder - rightOrder; 
        });
    }, [summary]);

    if(insights.length === 0) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Consigli del Coach</Text>

            <Text 
                style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 2,
                }}
            >
                Indicazioni generate dal riepilogo del periodo
            </Text>

            {insights.map((insight, index) => (
                <CoachInsightCard
                    key={`${insight.type}-${insight.relatedMuscleGroup || index}`}
                    insight={insight}
                    colors= {colors}
                />
            ))}
        </View>
    );
}