import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CoachBadgeRow from './CoachBadgeRow';

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

            {visibleItems.map((badge) => (
                <CoachBadgeRow
                    key={badge.id}
                    badge={badge}
                    colors={colors}
                />
            ))}

            {hasHiddenItems ? (
                <TouchableOpacity
                    onPress={() => setExpanded((current) => !current)}
                    activeOpacity={0.8}
                    style={{
                        marginTop: 10,
                        paddingVertical: 10,
                        alignItems: 'center',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.inputBg,
                    }}
                >
                    <Text
                        style={{
                            color: colors.primary,
                            fontSize: 13,
                            fontWeight: '700',
                        }}
                    >
                        {expanded ? 'Mostra meno' : 'Mostra di più'}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}