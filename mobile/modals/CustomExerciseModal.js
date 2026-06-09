import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { getAvailableMuscleGroups } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';

const EXERCISE_TYPES = [
  { key: 'weight_reps', label: 'Peso + Rip.' },
  { key: 'reps',        label: 'Ripetizioni' },
  { key: 'timed',       label: 'A Tempo'     },
];

export default function CustomExerciseModal({
  showCustomExercise,
  setShowCustomExercise,
  customExerciseName,
  setCustomExerciseName,
  customMuscleGroup,
  setCustomMuscleGroup,
  customExerciseType,
  setCustomExerciseType,
  exercises,
  createCustomExercise,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);
  const muscleGroups = getAvailableMuscleGroups(exercises);

  return (
    <Modal visible={showCustomExercise} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Nuovo Esercizio</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.input}
              placeholder="Nome esercizio"
              placeholderTextColor={C.textMuted}
              value={customExerciseName}
              onChangeText={setCustomExerciseName}
            />

            {/* Tipo esercizio */}
            <Text style={[styles.sectionLabel, { marginBottom: 8, fontWeight: '700', color: C.textDark }]}>
              Tipologia
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 14, gap: 6 }}>
              {EXERCISE_TYPES.map((t) => {
                const selected = (customExerciseType || 'weight_reps') === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setCustomExerciseType(t.key)}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: selected ? C.primary : C.border,
                      backgroundColor: selected ? (isDarkMode ? C.primary + '20' : '#e5f9ef') : C.inputBg,
                      paddingVertical: 10,
                      paddingHorizontal: 6,
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: selected ? C.primaryDark : C.textDark, textAlign: 'center' }}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Gruppo muscolare */}
            <Text style={[styles.sectionLabel, { marginBottom: 8, fontWeight: '700', color: C.textDark }]}>
              Gruppo muscolare
            </Text>
            <View style={styles.muscleGroupSelectorRow}>
              {muscleGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.groupChip,
                    customMuscleGroup === group && styles.groupChipSelected,
                  ]}
                  onPress={() => setCustomMuscleGroup(group)}>
                  <Text
                    style={
                      customMuscleGroup === group
                        ? styles.groupChipTextSelected
                        : styles.groupChipText
                    }>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={[styles.modalButtons, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => {
                setShowCustomExercise(false);
                setCustomExerciseName('');
                setCustomMuscleGroup('');
                setCustomExerciseType('weight_reps');
              }}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={createCustomExercise}>
              <Text style={styles.primaryButtonText}>Crea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
