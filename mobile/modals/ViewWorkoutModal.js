import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';

const isTimedExercise = (type) =>
  type === 'timed' || type === 'time' || type === 'plank' || type === 'cardio';
const isRepsOnlyExercise = (type) => type === 'reps' || type === 'REPS';

const formatSetDetail = (exercise, set) => {
  if (isTimedExercise(exercise.type)) {
    return `${set.duration || 0} min`;
  }
  if (isRepsOnlyExercise(exercise.type)) {
    return `${set.reps || 0} reps`;
  }
  return `${set.reps || 0} reps @ ${set.weight || 0}kg`;
};

const getSetDetails = (exercise) => {
  if (Array.isArray(exercise.setDetails) && exercise.setDetails.length > 0) {
    return exercise.setDetails;
  }

  const count = Number(exercise.sets) || 0;
  return Array.from({ length: count }, () => ({
    weight: exercise.weight || 0,
    reps: exercise.reps || 0,
    duration: exercise.duration || 0,
  }));
};

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

          <ScrollView
            style={{ alignSelf: 'stretch', maxHeight: 420, marginBottom: 10 }}
            contentContainerStyle={{ paddingBottom: 10 }}>
            {selectedWorkout.exercises.length === 0 ? (
              <Text style={styles.emptyText}>Nessun esercizio</Text>
            ) : (
              selectedWorkout.exercises.map((ex) => {
                const setDetails = getSetDetails(ex);
                const timed = isTimedExercise(ex.type);

                return (
                  <View key={ex.id} style={styles.viewExerciseItem}>
                    <Text style={styles.viewExerciseName}>{ex.name}</Text>

                    {setDetails.length === 0 ? (
                      <Text style={styles.viewExerciseDetails}>Nessuna serie pianificata</Text>
                    ) : (
                      setDetails.map((set, index) => (
                        <Text key={index} style={styles.viewExerciseDetails}>
                          Serie {index + 1}: {formatSetDetail(ex, set)}
                        </Text>
                      ))
                    )}

                    {!timed ? (
                      <Text style={[styles.viewExerciseDetails, { marginTop: 4 }]}>
                        Recupero: {ex.restTime || 60}s
                      </Text>
                    ) : null}
                  </View>
                );
              })
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
