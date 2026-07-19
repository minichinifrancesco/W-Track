import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import CoachBadgeRow from './CoachBadgeRow';
import CoachShowMoreButton from './CoachShowMoreButton';
import { getCoachMutedTextStyle } from '../styles/coachUi';

const BADGES_PREVIEW_LIMIT = 4;

export default function CoachBadgesSection({ summary, colors, styles }) {
    const badges = summary?.badges;

    const items = useMemo(() => {
        if(!Array.isArray(badges?.items)) return [];

        return badges.items;
    }, [badges]);

    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        setExpanded(false);
    }, [summary?.period?.start]);
    
    const hasHiddenItems = items.length > BADGES_PREVIEW_LIMIT;
    const visibleItems = expanded ? items : items.slice(0, BADGES_PREVIEW_LIMIT);

    if(!badges || badges.earned <= 0 || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Badge settimanali</Text>

            <Text 
                style={[
                    getCoachMutedTextStyle(colors),
                    {
                        marginTop: 6,
                        marginBottom: 8,
                    },
                ]}
            >
                {badges.earned === 1
                    ? '1 nuovo badge ottenuto'
                    : `${badges.earned} nuovi badge ottenuti`}
            </Text>

            {visibleItems.map((badge, index) => (
                <CoachBadgeRow
                    key={badge.id}
                    badge={badge}
                    colors={colors}
                    isLast={index === visibleItems.length - 1}
                />
            ))}

            {hasHiddenItems ? (
                <CoachShowMoreButton
                    colors={colors}
                    expanded={expanded}
                    onPress={() => setExpanded((current) => !current)}
                />
            ) : null}
        </View>
    );
}