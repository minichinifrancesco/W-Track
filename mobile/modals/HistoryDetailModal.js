import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { getStyles } from '../styles/styles';

export default function HistoryDetailModal({
  showHistoryDetailModal,
  setShowHistoryDetailModal,
  selectedHistoryRecord,
  formatWorkoutTime,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  if (!selectedHistoryRecord) return null;

  return (
    <Modal visible={showHistoryDetailModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Riepilogo sessione</Text>
          <Text style={styles.historyName}>{selectedHistoryRecord.name}</Text>
          <Text style={styles.historyDate}>
            {new Date(selectedHistoryRecord.date).toLocaleString('it-IT')}
          </Text>
          <Text style={styles.historyDuration}>
            Durata:{' '}
            {formatWorkoutTime(selectedHistoryRecord.durationSeconds || 0)}
          </Text>

          <ScrollView style={styles.exerciseList}>
            {(selectedHistoryRecord.exercises || []).map((ex) => (
              <View key={ex.id} style={styles.viewExerciseItem}>
                <Text style={styles.viewExerciseName}>
                  {ex.name} ({ex.muscleGroup})
                </Text>

                {(ex.setDetails || []).map((sd, idx) => (
                  <Text key={idx} style={styles.viewExerciseDetails}>
                    Serie {idx + 1}:{' '}
                    {ex.type === 'time' ||
                    ex.type === 'plank' ||
                    ex.type === 'cardio'
                      ? `${sd.duration || 0}s`
                      : `${sd.reps || 0} reps @ ${sd.weight || 0}kg`}{' '}
                    {sd.completed ? '✓' : ''}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowHistoryDetailModal(false)}>
            <Text style={styles.primaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
