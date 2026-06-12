import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

export default function EditHistoryModal({
  showEditHistoryModal,
  setShowEditHistoryModal,
  editingHistoryRecord,
  setEditingHistoryRecord,
  updateHistorySetDetail,
  saveEditedHistory,
  formatWorkoutTime,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const [editingTime, setEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState('');

  if (!editingHistoryRecord) return null;

  // Convert seconds to HH:MM:SS string
  const secondsToHMS = (totalSeconds) => {
    const s = typeof totalSeconds === 'number' ? totalSeconds : 0;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Parse HH:MM:SS or MM:SS to seconds
  const parseHMStoSeconds = (str) => {
    const parts = str.trim().split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  const handleStartTimeEdit = () => {
    setTimeInput(secondsToHMS(editingHistoryRecord.durationSeconds || 0));
    setEditingTime(true);
  };

  const handleSaveTime = () => {
    const newSeconds = parseHMStoSeconds(timeInput);
    setEditingHistoryRecord((prev) => prev ? { ...prev, durationSeconds: newSeconds } : prev);
    setEditingTime(false);
  };

  const displayTime = formatWorkoutTime
    ? formatWorkoutTime(editingHistoryRecord.durationSeconds || 0)
    : secondsToHMS(editingHistoryRecord.durationSeconds || 0);

  return (
    <Modal visible={showEditHistoryModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Modifica sessione passata</Text>
          <Text style={styles.historyName}>{editingHistoryRecord.name}</Text>

          {/* Editable duration */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            gap: 8,
          }}>
            <Text style={{ fontSize: 13, color: '#64748b' }}>⏱ Durata:</Text>
            {editingTime ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TextInput
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#86B749',
                    fontSize: 15,
                    fontWeight: '700',
                    color: '#1e293b',
                    minWidth: 90,
                    textAlign: 'center',
                    paddingVertical: 2,
                  }}
                  value={timeInput}
                  onChangeText={setTimeInput}
                  keyboardType="numbers-and-punctuation"
                  autoFocus
                  placeholder="HH:MM:SS"
                />
                <TouchableOpacity
                  onPress={handleSaveTime}
                  style={{
                    backgroundColor: '#86B749',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingTime(false)}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                  <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handleStartTimeEdit} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>{displayTime}</Text>
                <Ionicons name="create-outline" size={13} color="#86B749" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.exerciseList}>
            {editingHistoryRecord.exercises.map((ex) => (
              <View key={ex.id} style={styles.viewExerciseItem}>
                <Text style={styles.viewExerciseName}>
                  {ex.name} ({ex.muscleGroup})
                </Text>

                {(ex.setDetails || []).map((sd, idx) => (
                  <View key={idx} style={styles.historyEditSetRow}>
                    <Text style={styles.setCellSerie}>{idx + 1}</Text>

                    {ex.type === 'timed' ||
                    ex.type === 'time' ||
                    ex.type === 'plank' ||
                    ex.type === 'cardio' ? (
                      <TextInput
                        style={styles.historyEditInput}
                        keyboardType="numeric"
                        value={String(sd.duration || 0)}
                        onChangeText={(text) =>
                          updateHistorySetDetail(ex.id, idx, 'duration', text)
                        }
                      />
                    ) : (
                      <>
                        <TextInput
                          style={styles.historyEditInput}
                          keyboardType="decimal-pad"
                          value={String(sd.weight || 0)}
                          onChangeText={(text) =>
                            updateHistorySetDetail(ex.id, idx, 'weight', text)
                          }
                        />
                        <TextInput
                          style={styles.historyEditInput}
                          keyboardType="numeric"
                          value={String(sd.reps || 0)}
                          onChangeText={(text) =>
                            updateHistorySetDetail(ex.id, idx, 'reps', text)
                          }
                        />
                      </>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        sd.completed && styles.checkButtonComplete,
                      ]}
                      onPress={() =>
                        updateHistorySetDetail(ex.id, idx, 'completed', null)
                      }>
                      <Text style={styles.checkText}>
                        {sd.completed ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Note per esercizio nello storico */}
                <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569', marginBottom: 4 }}>Note esercizio:</Text>
                  <TextInput
                    style={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                      borderWidth: 1,
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      borderRadius: 6,
                      padding: 6,
                      fontSize: 12,
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      minHeight: 32,
                    }}
                    placeholder="Note su questo esercizio..."
                    placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                    value={ex.note || ''}
                    onChangeText={(val) => {
                      setEditingHistoryRecord((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          exercises: prev.exercises.map((e) =>
                            e.id === ex.id ? { ...e, note: val } : e
                          ),
                        };
                      });
                    }}
                    multiline
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => {
                setShowEditHistoryModal(false);
                setEditingHistoryRecord(null);
                setEditingTime(false);
              }}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={saveEditedHistory}>
              <Text style={styles.primaryButtonText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
