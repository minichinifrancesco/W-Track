import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    getCoachIconBubbleStyle,
    getCoachListRowStyle,
    getCoachMutedTextStyle,
} from '../styles/coachUi';
import CoachMuscleCoverageModal from './CoachMuscleCoverageModal';

function getStatusLabel(status) {
    if(status === 'none') return 'Non allenato';
    if(status === 'low') return 'Poco allenato';

    return 'In equilibrio';
}

function getFocusIcon(status) {
    if(status === 'none') return 'alert-circle-outline';
    if(status === 'low') return 'fitness-outline';

    return 'checkmark-circle-outline';
}

function getFocusTheme(status, colors) {
    if(status === 'none') {
        return {
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.14)',
            borderColor: '#ef4444',
        };
    }

    if(status === 'low') {
        return {
            color: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.14)',
            borderColor: '#f59e0b',
        };
    }

    return {
        color: colors.primary,
        backgroundColor: colors.accentGreenBg,
        borderColor: colors.accentGreenBorder,
    };
}

export default function CoachNextFocusSection({ summary, colors, styles, formatOptions }) {
    const nextFocus = summary?.nextFocus;
    const [coverageVisible, setCoverageVisible] = useState(false);

    if(!nextFocus) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>{nextFocus.title}</Text>

            <Text
                style={[
                    getCoachMutedTextStyle(colors),
                    {
                        marginTop: 6,
                        marginBottom: 8,
                    },
                ]}
            >
                {nextFocus.message}
            </Text>

            {nextFocus.groups.map((group, index) => {
                const theme = getFocusTheme(group.status, colors);

                return (
                    <View
                        key={group.name}
                        style={getCoachListRowStyle(colors, index === nextFocus.groups.length - 1)}
                    >
                        <View
                            style={getCoachIconBubbleStyle(colors, theme.backgroundColor, theme.borderColor)}
                        >
                            <Ionicons
                                name={getFocusIcon(group.status)}
                                size={18}
                                color={theme.color}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: colors.textDark,
                                    fontSize: 14,
                                    fontWeight: '700',
                                }}
                            >
                                {group.name}
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={{
                                    color: colors.textMuted,
                                    fontSize: 12,
                                    marginTop: 2,
                                }}
                            >
                                {getStatusLabel(group.status)} · {group.reason}
                            </Text>
                        </View>
                    </View>
                );
            })}

            <Pressable
                onPress={() => setCoverageVisible(true)}
                style={{
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: colors.accentGreenBorder,
                    backgroundColor: colors.accentGreenBg,
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}
            >
                <Ionicons
                    name="analytics-outline"
                    size={18}
                    color={colors.primary}
                />

                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 13,
                        fontWeight: '800',
                    }}
                >
                    Analizza copertura muscolare
                </Text>
            </Pressable>

            <CoachMuscleCoverageModal
                visible={coverageVisible}
                onClose={() => setCoverageVisible(false)}
                summary={summary}
                colors={colors}
                formatOptions={formatOptions}
            />
        </View>
    );
}
