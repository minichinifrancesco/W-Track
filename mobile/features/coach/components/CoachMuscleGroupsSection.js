import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import CoachMuscleGroupCard from './CoachMuscleGroupCard';
import CoachShowMoreButton from './CoachShowMoreButton';
import { getCoachMutedTextStyle } from '../styles/coachUi';

const STATUS_ORDER = {
    none: 0,
    low: 1,
    ok: 2,
    high: 3
};

const MUSCLE_GROUP_PREVIEW_LIMIT = 4;

export default function CoachMuscleGroupsSection({ summary, colors, styles }) {
    const groups = useMemo(() => {
        const items = summary?.muscleGroups || [];

        return [...items].sort((left, right) => {
            const leftOrder = STATUS_ORDER[left.status] ?? 99;
            const rightOrder = STATUS_ORDER[right.status] ?? 99;

            if(leftOrder !== rightOrder) return leftOrder - rightOrder;

            return right.sets - left.sets;
        });
    }, [summary]);

    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        setExpanded(false);
    }, [summary?.period?.start]);

    const hasHiddenGroups = groups.length > MUSCLE_GROUP_PREVIEW_LIMIT;
    const visibleGroups = expanded ? groups : groups.slice(0, MUSCLE_GROUP_PREVIEW_LIMIT);

    if(groups.length === 0) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Gruppi Muscolari</Text>

            <Text 
                style={[
                    getCoachMutedTextStyle(colors),
                    {
                        marginTop: 6,
                        marginBottom: 2,
                    },
                ]}
            >
                Copertura muscolare del periodo selezionato
            </Text>

            {visibleGroups.map((group) => (
                <CoachMuscleGroupCard
                    key={group.name}
                    group={group}
                    colors={colors}
                />
            ))}

            {hasHiddenGroups ? (
                <CoachShowMoreButton
                    colors={colors}
                    expanded={expanded}
                    onPress={() => setExpanded((current) => !current)}
                />
            ) : null}
        </View>
    );
}