import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';

const isTimedExercise = (type) =>
  type === 'timed' || type === 'time' || type === 'plank' || type === 'cardio';

export default function ViewWorkoutModal({
  showViewWorkout,
  setShowViewWorkout,
  selectedWorkout,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  if (!selectedWorkout) return null;

  return (
    <Modal visible={showViewWorkout} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>{selectedWorkout.name}</Text>

          <ScrollView style={styles.exerciseList}>
            {selectedWorkout.exercises.length === 0 ? (
              <Text style={styles.emptyText}>Nessun esercizio</Text>
            ) : (
              selectedWorkout.exercises.map((ex) => (
                <View key={ex.id} style={styles.viewExerciseItem}>
                  <Text style={styles.viewExerciseName}>{ex.name}</Text>

                  {isTimedExercise(ex.type) ? (
                    <Text style={styles.viewExerciseDetails}>
                      {ex.sets} serie × {ex.duration || 0} min
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.viewExerciseDetails}>
                        {ex.sets} serie × {ex.reps} reps @ {ex.weight}kg
                      </Text>
                      <Text style={styles.viewExerciseDetails}>
                        Recupero: {ex.restTime}s
                      </Text>
                    </>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowViewWorkout(false)}>
            <Text style={styles.primaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
