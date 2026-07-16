import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { buildCoachWeekDays } from '../utils/coachWeekDays';

export default function CoachWeekDayStrip({ summary, colors, styles }) {
    const weekDays = useMemo(() => buildCoachWeekDays(summary), [summary]);

    if(weekDays.length === 0) return null;

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Distribuzione settimana</Text>

            <Text
                style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 12,
                }}
            >
                Giorni in cui hai registrato allenamenti
            </Text>

            <View 
                style={{
                    flexDirection: 'row',
                    gap: 6,
                }}
            >
                {weekDays.map((day) => (
                    <View
                        key={day.date}
                        style={{
                            flex: 1,
                            minHeight: 82,
                            borderWidth: 1,
                            borderColor: day.active ? colors.primary : colors.border,
                            backgroundColor: day.active ? colors.accentGreenBg : colors.inputBg,
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text 
                            style={{
                                color: day.active ? colors.primary : colors.textMuted,
                                fontSize: 11,
                                fontWeight: '700',
                            }}
                        >
                            {day.label}
                        </Text>

                        <Text 
                            style={{
                                color: colors.textDark,
                                fontSize: 16,
                                fontWeight: '800',
                                marginTop: 4,
                            }}
                        >
                            {day.sessions > 0 ? day.sessions : '-'}
                        </Text>

                        {day.active ? (
                            <Text 
                                style={{
                                    color: colors.textMuted,
                                    fontSize: 10,
                                    marginTop: 3,
                                    textAlign:'center',
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                            >
                                {day.completedSets} serie 
                            </Text>
                        ) : (
                            <Text 
                                style={{
                                    color: colors.textMuted,
                                    fontSize: 10,
                                    marginTop: 3,
                                    textAlign: 'center'
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                            >
                                riposo
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}