import React from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';

export default function HomeScreen({
  workouts,
  formatDate,
  handleLogout,
  startWorkout,
  deleteWorkout,
  setSelectedWorkout,
  setShowViewWorkout,
  openTemplateEditor,
  setShowCreateWorkout,
  currentScreen,
  setCurrentScreen,
}) {
  const isDarkMode = useColorScheme() === 'dark';
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
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Esci</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Le mie schede</Text>
          <TouchableOpacity
            style={styles.chipOutline}
            onPress={() => setShowCreateWorkout(true)}>
            <Text style={styles.chipOutlineText}>+ Nuova scheda</Text>
          </TouchableOpacity>
        </View>

        {workouts.map((workout) => (
          <View key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.exerciseCount}>
                  {workout.exercises.length} esercizi
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteHeaderButton}
                onPress={() => deleteWorkout(workout.id)}>
                <Text style={styles.deleteHeaderButtonText}>Elimina</Text>
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
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateWorkout(true)}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
