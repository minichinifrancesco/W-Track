import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';

export default function HistoryDetailModal({
  showHistoryDetailModal,
  setShowHistoryDetailModal,
  selectedHistoryRecord,
  formatWorkoutTime,
  updateHistoryGeneralNote,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  
  // Local state for immediate responsiveness
  const [localNote, setLocalNote] = useState('');

  useEffect(() => {
    if (selectedHistoryRecord) {
      setLocalNote(selectedHistoryRecord.generalNote || '');
    }
  }, [selectedHistoryRecord]);

  if (!selectedHistoryRecord) return null;

  const handleNoteChange = (text) => {
    setLocalNote(text);
    if (updateHistoryGeneralNote) {
      updateHistoryGeneralNote(selectedHistoryRecord.id, text);
    }
  };

  return (
    <Modal visible={showHistoryDetailModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Riepilogo sessione</Text>
          <Text style={styles.historyName}>{selectedHistoryRecord.name}</Text>
          <Text style={styles.historyDate}>
            {new Date(selectedHistoryRecord.date).toLocaleString('it-IT')}
          </Text>
          <Text style={[styles.historyDuration, { marginBottom: 12 }]}>
            Durata:{' '}
            {formatWorkoutTime(selectedHistoryRecord.durationSeconds || 0)}
          </Text>

          {/* Nota Generale Workout */}
          <View style={{ marginBottom: 14, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569', marginBottom: 4 }}>Nota generale workout:</Text>
            <TextInput
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                borderWidth: 1,
                borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                minHeight: 50,
                textAlignVertical: 'top',
              }}
              placeholder="Aggiungi una nota generale su questa sessione di allenamento (es. sensazioni generali, focus...)"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              value={localNote}
              onChangeText={handleNoteChange}
              multiline
            />
          </View>

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

                {ex.note ? (
                  <View style={{ marginTop: 6, padding: 6, backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Nota esercizio:</Text>
                    <Text style={{ fontSize: 12, color: isDarkMode ? '#f8fafc' : '#0f172a', fontStyle: 'italic', marginTop: 2 }}>{ex.note}</Text>
                  </View>
                ) : null}
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
