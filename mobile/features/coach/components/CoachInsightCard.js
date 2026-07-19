import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCoachInnerCardStyle, getCoachMutedTextStyle } from '../styles/coachUi';

function getInsightTheme(severity, colors) {
    switch(severity){
        case 'success':
            return {
                icon: 'checkmark-circle-outline',
                color: colors.primary,
                backgroundColor: colors.accentGreenBg,
                borderColor: colors.accentGreenBorder,
            };

        case 'warning':
            return {
                icon: 'alert-circle-outline',
                color: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                borderColor: '#f59e0b',
            };

        case 'danger':
            return {
                icon: 'warning-outline',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.14)',
                borderColor: '#ef4444',
            };
        
        case 'info':
        default:
            return {
                icon: 'information-circle-outline',
                color: colors.textMuted,
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
            };
    }
}

export default function CoachInsightCard({ insight, colors }) {
    const theme = getInsightTheme(insight.severity, colors);

    return (
        <View style={getCoachInnerCardStyle(colors, theme.borderColor, theme.backgroundColor)}>
            <View 
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 10,
                }}
            >
                <Ionicons name={theme.icon} size={20} color={theme.color} />

                <View style={{ flex: 1 }}>
                    <Text 
                        style={{
                            color: colors.textDark,
                            fontSize: 14,
                            fontWeight: '700',
                        }}
                    >
                        {insight.title}
                    </Text>

                    <Text 
                        style={[
                            getCoachMutedTextStyle(colors),
                            { marginTop: 4},
                        ]}
                    >
                        {insight.message}
                    </Text>

                    {insight.relatedMuscleGroup ? (
                        <Text 
                            style={{
                                color: theme.color,
                                fontSize: 12,
                                fontWeight: '700',
                                marginTop: 8,
                            }}
                        >
                            {insight.relatedMuscleGroup}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
}