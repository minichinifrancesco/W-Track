import React from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({
  workouts,
  formatDate,
  startWorkout,
  deleteWorkout,
  setSelectedWorkout,
  setShowViewWorkout,
  openTemplateEditor,
  createWorkout,
  currentScreen,
  setCurrentScreen,
  activeWorkout,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>W-Note</Text>
            <Text style={styles.headerSubtitle}>{formatDate()}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <HelpButton screen="home" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Le mie schede</Text>
          <TouchableOpacity
            style={styles.chipOutline}
            onPress={createWorkout}>
            <Text style={styles.chipOutlineText}>+ Nuova scheda</Text>
          </TouchableOpacity>
        </View>

        {workouts.map((workout) => (
          <Swipeable
            key={workout.id}
            containerStyle={{ marginBottom: 14 }}
            renderRightActions={() => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#ef4444',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  height: '100%',
                  borderRadius: 16,
                  marginLeft: 10,
                }}
                onPress={() => deleteWorkout(workout.id)}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Elimina</Text>
              </TouchableOpacity>
            )}>
            <View style={[styles.workoutCard, { marginBottom: 0 }]}>
              <View style={styles.workoutHeader}>
                <View>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.exerciseCount}>
                    {workout.exercises.length} esercizi
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => { /* Placeholder per esportazione futura */ }}>
                  <Ionicons name="share-outline" size={18} color={isDarkMode ? '#cbd5e1' : '#475569'} />
                </TouchableOpacity>
              </View>

              <View style={styles.workoutActions}>
                <TouchableOpacity
                  style={styles.outlinedSmallButton}
                  onPress={() => {
                    setSelectedWorkout(workout);
                    setShowViewWorkout(true);
                  }}>
                  <Text style={styles.outlinedSmallButtonText}>Dettagli</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.outlinedSmallButton}
                  onPress={() => openTemplateEditor(workout)}>
                  <Text style={styles.outlinedSmallButtonText}>Modifica</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.primarySmallButton}
                onPress={() => startWorkout(workout)}>
                <Text style={styles.primarySmallButtonText}>
                  Inizia workout
                </Text>
              </TouchableOpacity>
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, activeWorkout && { bottom: 185 }]}
        onPress={createWorkout}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
