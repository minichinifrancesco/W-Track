import React, { useMemo } from 'react';
import { View } from 'react-native';
import CoachMuscleGroupCard from './CoachMuscleGroupCard';

const STATUS_ORDER = {
    none: 0,
    low: 1,
    ok: 2,
    high: 3
};

export default function CoachMuscleGroupsSection({ summary, colors, formatOptions }) {
    const groups = useMemo(() => {
        const items = summary?.muscleGroups || [];

        return [...items].sort((left, right) => {
            const leftOrder = STATUS_ORDER[left.status] ?? 99;
            const rightOrder = STATUS_ORDER[right.status] ?? 99;

            if(leftOrder !== rightOrder) return leftOrder - rightOrder;

            return right.sets - left.sets;
        });
    }, [summary]);

    if(groups.length === 0) return null;

    return (
        <View style={{ paddingTop: 14 }}>
            {groups.map((group) => (
                <CoachMuscleGroupCard
                    key={group.name}
                    group={group}
                    colors={colors}
                    formatOptions={formatOptions}
                />
            ))}
        </View>
    );
}
