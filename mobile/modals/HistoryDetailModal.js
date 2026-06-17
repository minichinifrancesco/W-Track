import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';
import { getBadgeDefinition } from '../utils/progress';

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

const getBadgeLabel = (definition, compact) => {
  if (!compact) return definition.name || 'PR';
  if (definition.id === 'PR_WEIGHT') return 'Peso';
  if (definition.id === 'PR_REPS') return 'Reps';
  if (definition.id === 'PR_VOLUME') return 'Volume';
  return 'PR';
};

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
        key={badge.id || `${badge.definitionId}-${badge.value}`}
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
          marginLeft: compact ? 6 : 0,
          marginRight: compact ? 0 : 5,
          marginTop: compact ? 0 : 4,
        }}
      >
        <Ionicons name={definition.icon || 'trophy'} size={compact ? 11 : 13} color={isDarkMode ? '#bbf7d0' : '#15803d'} />
        <Text style={{ fontSize: compact ? 10 : 11, fontWeight: '800', color: isDarkMode ? '#bbf7d0' : '#15803d' }}>
          {getBadgeLabel(definition, compact)}
        </Text>
      </View>
    );
  };

  const getExerciseSummaryBadges = (exercise) => {
    const setBadgeIds = new Set(
      (exercise.setDetails || []).flatMap((set) =>
        (set.badges || []).map((badge) => badge.id).filter(Boolean),
      ),
    );

    return (exercise.prBadges || []).filter(
      (badge) => !badge.id || !setBadgeIds.has(badge.id),
    );
  };

  return (
    <Modal visible={showHistoryDetailModal} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <View style={[styles.modalContentLarge, { height: '86%' }]}>
          <ScrollView
            style={{ alignSelf: 'stretch', flex: 1, marginBottom: 10 }}
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{ paddingBottom: 18 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator>
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
                blurOnSubmit
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {(selectedHistoryRecord.exercises || []).map((ex) => {
              const exerciseBadges = getExerciseSummaryBadges(ex);

              return (
                <View key={ex.id} style={styles.viewExerciseItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={styles.viewExerciseName}>
                      {ex.name} ({ex.muscleGroup})
                    </Text>
                    {exerciseBadges.length > 0 ? (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 4 }}>
                        {exerciseBadges.map((badge) => renderBadgeChip(badge))}
                      </View>
                    ) : null}
                  </View>

                  {(ex.setDetails || []).map((sd, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: 4,
                      }}>
                      <Text style={styles.viewExerciseDetails}>
                        Serie {idx + 1}: {formatSetDetail(ex, sd)}{' '}
                        {sd.completed ? '✓' : ''}
                      </Text>
                      {(sd.badges || []).map((badge) =>
                        renderBadgeChip(badge, true),
                      )}
                    </View>
                  ))}

                  {ex.note ? (
                    <View style={{ marginTop: 6, padding: 6, backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Nota esercizio:</Text>
                      <Text style={{ fontSize: 12, color: isDarkMode ? '#f8fafc' : '#0f172a', fontStyle: 'italic', marginTop: 2 }}>{ex.note}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              Keyboard.dismiss();
              setShowHistoryDetailModal(false);
            }}>
            <Text style={styles.primaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
