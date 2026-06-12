import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';
import { getBadgeDefinition } from '../utils/progress';

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

  const renderBadgeChip = (badge, compact = false) => {
    const definition = getBadgeDefinition(badge.definitionId) || badge;
    return (
      <View
        key={badge.id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          backgroundColor: isDarkMode ? '#14532d' : '#dcfce7',
          borderWidth: 1,
          borderColor: '#86B749',
          borderRadius: 999,
          paddingHorizontal: compact ? 6 : 8,
          paddingVertical: compact ? 2 : 4,
          marginRight: 5,
          marginTop: 4,
        }}
      >
        <Ionicons name={definition.icon || 'trophy'} size={compact ? 11 : 13} color={isDarkMode ? '#bbf7d0' : '#15803d'} />
        <Text style={{ fontSize: compact ? 10 : 11, fontWeight: '800', color: isDarkMode ? '#bbf7d0' : '#15803d' }}>
          {compact ? 'PR' : definition.name || 'PR'}
        </Text>
      </View>
    );
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
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Text style={styles.viewExerciseName}>
                    {ex.name} ({ex.muscleGroup})
                  </Text>
                  {(ex.prBadges || []).length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 4 }}>
                      {(ex.prBadges || []).map((badge) => renderBadgeChip(badge))}
                    </View>
                  ) : null}
                </View>

                {(ex.setDetails || []).map((sd, idx) => (
                  <View key={idx} style={{ marginBottom: 2 }}>
                    <Text style={styles.viewExerciseDetails}>
                      Serie {idx + 1}:{' '}
                      {ex.type === 'time' ||
                      ex.type === 'plank' ||
                      ex.type === 'cardio'
                        ? `${sd.duration || 0}s`
                        : `${sd.reps || 0} reps @ ${sd.weight || 0}kg`}{' '}
                      {sd.completed ? '✓' : ''}
                    </Text>
                    {(sd.badges || []).length > 0 ? (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 4 }}>
                        {(sd.badges || []).map((badge) => renderBadgeChip(badge, true))}
                      </View>
                    ) : null}
                  </View>
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
