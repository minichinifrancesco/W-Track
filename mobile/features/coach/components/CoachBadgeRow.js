import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatBadgeValue, formatBadgeDate } from '../utils/coachFormatter';
import { getCoachIconBubbleStyle, getCoachListRowStyle } from '../styles/coachUi';

function getBadgeIcon(code) {
    const safeCode = String(code || '').toUpperCase();

    if(safeCode.includes('VOLUME')) return 'trending-up-outline';
    if(safeCode.includes('PESO') || safeCode.includes('WEIGHT')) return 'barbell-outline';
    if(safeCode.includes('REP')) return 'repeat-outline';

    return 'ribbon-outline';
}

function formatBadgeDetail(badge, formatOptions) {
    const parts = [];

    if(badge.exerciseName) {
        parts.push(badge.exerciseName);
    }

    if(badge.value !== null && badge.value !== undefined) {
        parts.push(formatBadgeValue(badge.value, badge.code, formatOptions));
    }
    
    return parts.length > 0 ? parts.join(' · ') : 'Badge generale';
}

export default function CoachBadgeRow({ badge, colors, formatOptions, isLast = false, showDate = false }) {
    return (
        <View style={getCoachListRowStyle(colors, isLast)}>
            <View style={getCoachIconBubbleStyle(colors)}>
                <Ionicons 
                    name={getBadgeIcon(badge.code)}
                    size={18}
                    color={colors.primary}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text 
                    style={{
                        color: colors.textDark,
                        fontSize: 14,
                        fontWeight: '700',
                    }}
                >
                    {badge.name}
                </Text>

                <Text 
                    style={{
                        color: colors.textMuted,
                        fontSize: 12,
                        marginTop: 2,
                    }}
                    numberOfLines={2}
                >
                    {showDate
                        ? `${formatBadgeDetail(badge, formatOptions)} · Ottenuto il: ${formatBadgeDate(badge.earnedAt)}`
                        : formatBadgeDetail(badge, formatOptions)}
                </Text>
            </View>
        </View>
    );
}