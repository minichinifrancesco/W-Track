import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import BottomNav from '../components/BottomNav';
import { logoCompact } from '../constants';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';
import { getWeeklyCoachSummary } from '../services/api';
import { Ionicons } from "@expo/vector-icons";

const WEEK_STEP_DAYS = 7;

function startOfWeek(dateValue) {
    const date = new Date(dateValue);
    const day = (date.getDay() + 6) % 7;

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - day);

    return date;
}

function addDays(dateValue, amount) {
    const date = new Date(dateValue);
    date.setDate(date.getDate() + amount);
    return date;
}

function toLocalDateKey(dateValue) {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDuration(seconds = 0) {
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if(hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function formatNumber(value = 0) {
    return Math.round(Number(value || 0)).toLocaleString('it-IT');
}

function CoachMetricCard({ metric, colors}) {
    return (
        <View style={{ width: '48%', backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, minHeight: 92 }}>
            <Ionicons name={metric.icon} size={20} color={colors.primary} />
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>{metric.label}</Text>
            <Text style={{ color:colors.textDark, fontSize: 22, fontWeight: '700', marginTop:4 }}>{metric.value}</Text>
        </View>
    );
}

export default function CoachScreen({ authToken, currentScreen, setCurrentScreen}){
    const isDarkMode = useEffectiveDark();
    const styles = getStyles(isDarkMode);
    const C = getThemeColors(isDarkMode);

    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const loadSummary = useCallback(async () => {
        if(!authToken) {
            setError('Sessione non valida. Effettua di nuovo il login.');
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            setError('');
            const data = await getWeeklyCoachSummary(authToken, toLocalDateKey(weekStart));
            setSummary(data);
        } catch(err) {
            setError(err.message || 'Errore caricamento dashboard Coach.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [authToken, weekStart]);

    useEffect(() => {
        setLoading(true);
        loadSummary();
    }, [loadSummary]);

    const goToPreviousWeek = () => {
        if(loading || refreshing) return;
        setWeekStart((current) => addDays(current, -WEEK_STEP_DAYS));
    };

    const goToNextWeek = () => {
        if(loading || refreshing) return;
        setWeekStart((current) => addDays(current, WEEK_STEP_DAYS));
    };

    const refresh = () => {
        setRefreshing(true);
        loadSummary();
    };

    const metrics = useMemo(() => {
        if(!summary) return [];

        return[
            {
                label: 'Sessioni',
                value: summary.totals.sessions,
                icon: 'barbell-outline',
            },
            {
                label: 'Durata',
                value: formatDuration(summary.totals.durationSeconds),
                icon: 'time-outline',
            },
            {
                label: 'Serie',
                value: summary.totals.completedSets,
                icon: 'checkmark-circle-outline',
            },
            {
                label: 'Volume',
                value: formatNumber(summary.totals.volume),
                icon: 'trending-up-outline',
            }
        ];
    }, [summary]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image source={logoCompact} style={styles.logoSmall} />
                    <View>
                        <Text style={styles.headerTitle}>Coach</Text>
                        <Text style={styles.headerSubtitle}>
                            {summary?.period?.label || 'Dashboard settimanale'}
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <TouchableOpacity onPress={goToPreviousWeek} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Settimana prima</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToNextWeek} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Settimana dopo</Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style= {{ paddingVertical: 32, alignItems: 'center'}}>
                        <ActivityIndicator color={C.primary} />
                        <Text style={{ marginTop: 8, color: C.textMuted}}>Caricamento Coach...</Text>
                    </View>
                )}

                {!loading && error ? (
                    <View style={styles.workoutCard}>
                        <Text style={styles.sectionTitle}>Errore</Text>
                        <Text style={{ color: C.textMuted, marginTop: 8 }}>{error}</Text>
                    </View>
                ) : null}

                {!loading && !error && summary ? (
                    <View style={styles.workoutCard}>
                        <Text style={styles.sectionTitle}>Riepilogo</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                            {
                                metrics.map((metric) => (
                                    <CoachMetricCard key={metric.label} metric={metric} colors={C} />
                                ))
                            }
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        </SafeAreaView>
    );
}