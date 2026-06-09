import React from 'react';
import { Modal, View, Text, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { getStyles } from '../styles/styles';

export default function EditHistoryModal({
  showEditHistoryModal,
  setShowEditHistoryModal,
  editingHistoryRecord,
  setEditingHistoryRecord,
  updateHistorySetDetail,
  saveEditedHistory,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  if (!editingHistoryRecord) return null;

  return (
    <Modal visible={showEditHistoryModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Modifica sessione passata</Text>
          <Text style={styles.historyName}>{editingHistoryRecord.name}</Text>

          <ScrollView style={styles.exerciseList}>
            {editingHistoryRecord.exercises.map((ex) => (
              <View key={ex.id} style={styles.viewExerciseItem}>
                <Text style={styles.viewExerciseName}>
                  {ex.name} ({ex.muscleGroup})
                </Text>

                {(ex.setDetails || []).map((sd, idx) => (
                  <View key={idx} style={styles.historyEditSetRow}>
                    <Text style={styles.setCellSerie}>{idx + 1}</Text>

                    {ex.type === 'time' ||
                    ex.type === 'plank' ||
                    ex.type === 'cardio' ? (
                      <TextInput
                        style={styles.historyEditInput}
                        keyboardType="numeric"
                        value={String(sd.duration || 0)}
                        onChangeText={(text) =>
                          updateHistorySetDetail(
                            ex.id,
                            idx,
                            'duration',
                            text
                          )
                        }
                      />
                    ) : (
                      <>
                        <TextInput
                          style={styles.historyEditInput}
                          keyboardType="decimal-pad"
                          value={String(sd.weight || 0)}
                          onChangeText={(text) =>
                            updateHistorySetDetail(
                              ex.id,
                              idx,
                              'weight',
                              text
                            )
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
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => {
                setShowEditHistoryModal(false);
                setEditingHistoryRecord(null);
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
