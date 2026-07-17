import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import CoachBadgeRow from './CoachBadgeRow';

export default function CoachBadgesSection({ summary, colors, styles }) {
    const badges = summary?.badges;

    const items = useMemo(() => {
        if(!Array.isArray(badges?.items)) return [];

        return badges.items;
    }, [badges]);

    if(!badges || badges.earned <= 0 || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Badge settimanali</Text>

            <Text 
                style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 8,
                }}
            >
                {badges.earned === 1
                    ? '1 nuovo badge ottenuto'
                    : `${badges.earned} nuovi badge ottenuti`}
            </Text>

            {items.map((badge) => (
                <CoachBadgeRow
                    key={badge.id}
                    badge={badge}
                    colors={colors}
                />
            ))}
        </View>
    );
}