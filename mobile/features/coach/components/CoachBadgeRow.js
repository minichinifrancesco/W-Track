import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from '../utils/coachFormatter';

function getBadgeIcon(code) {
    const safeCode = String(code || '').toUpperCase();

    if(safeCode.includes('VOLUME')) return 'trending-up-outline';
    if(safeCode.includes('PESO') || safeCode.includes('WEIGHT')) return 'barbell-outline';
    if(safeCode.includes('REP')) return 'repeat-outline';

    return 'ribbon-outline';
}

function formatBadgeDetail(badge) {
    const parts = [];

    if(badge.exerciseName) {
        parts.push(badge.exerciseName);
    }

    if(badge.value !== null && badge.value !== undefined) {
        parts.push(formatNumber(badge.value));
    }
    
    return parts.length > 0 ? parts.join(' · ') : 'Badge generale';
}

export default function CoachBadgeRow({ badge, colors }) {
    return (
        <View 
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            }}
        >
            <View 
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.accentGreenBg,
                    borderWidth: 1,
                    borderColor: colors.accentGreenBorder,
                }}
            >
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
                    numberOfLines={1}
                >
                    {formatBadgeDetail(badge)}
                </Text>
            </View>
        </View>
    );
}