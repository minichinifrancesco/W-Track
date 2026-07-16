import React from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from 'react-native';
import BottomNav from "../components/BottomNav";
import { logoCompact } from "../constants";
import { useEffectiveDark } from "../context/SettingsContext";
import { getStyles, getThemeColors } from "../styles/styles";
import CoachSummaryMetrics from "../features/coach/components/CoachSummaryMetrics";
import CoachWeekNavigator from "../features/coach/components/CoachWeekNavigator";
import CoachComparisonCard from "../features/coach/components/CoachComparisonCard";
import CoachInsightsSection from "../features/coach/components/CoachInsightsSection";
import CoachMuscleGroupsSection from "../features/coach/components/CoachMuscleGroupsSection";
import CoachWeekDayStrip from "../features/coach/components/CoachWeekDayStrip";
import { useWeeklyCoachSummary } from "../features/coach/hooks/useWeeklyCoachSummary";

export default function CoachScreen ({ authToken, currentScreen, setCurrentScreen }) {
    const isDarkMode = useEffectiveDark();
    const styles = getStyles(isDarkMode);
    const colors = getThemeColors(isDarkMode);

    const {
        summary,
        loading,
        refreshing,
        error,
        isCurrentWeek,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        refresh
    } = useWeeklyCoachSummary(authToken);

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
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
                }
            >
                <CoachWeekNavigator 
                    styles={styles}
                    isCurrentWeek={isCurrentWeek}
                    onPreviousWeek={goToPreviousWeek}
                    onCurrentWeek={goToCurrentWeek}
                    onNextWeek={goToNextWeek}
                />

                {loading ? (
                    <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                        <ActivityIndicator color={ colors.primary } />

                        <Text style={{ marginTop: 8, color: colors.textMuted }}>
                            Caricamento coach . . .
                        </Text>
                    </View>
                ) : null}

                {!loading && error ? (
                    <View style={styles.workoutCard}>
                        <Text style={styles.sectionTitle}>Errore</Text>

                        <Text style={{ color: colors.textMuted, marginTop: 8 }}>
                            {error}
                        </Text>
                    </View>
                ) : null}

                {!loading && !error ? (
                    <>
                        <CoachSummaryMetrics
                            summary={summary}
                            colors={colors}
                            styles={styles}
                        />

                        <CoachWeekDayStrip
                            summary={summary}
                            colors={colors}
                            styles={styles}
                        />

                        <CoachComparisonCard 
                            summary={summary}
                            colors={colors}
                            styles={styles}
                        />

                        <CoachInsightsSection 
                            summary={summary}
                            colors={colors}
                            styles={styles}
                        />

                        <CoachMuscleGroupsSection 
                            summary={summary}
                            colors={colors}
                            styles={styles}
                        />
                    </>
                ) : null}
            </ScrollView>

            <BottomNav 
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
            />
        </SafeAreaView>
    );
}