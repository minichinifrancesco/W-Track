import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getAvailableMuscleGroups } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';
import { useEffectiveDark } from '../context/SettingsContext';

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
  customExerciseDescription,
  setCustomExerciseDescription,
  exercises,
  createCustomExercise,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);
  const muscleGroups = getAvailableMuscleGroups(exercises);

  const handleCancel = () => {
    setShowCustomExercise(false);
    setCustomExerciseName('');
    setCustomMuscleGroup('');
    setCustomExerciseType('weight_reps');
    setCustomExerciseDescription && setCustomExerciseDescription('');
  };

  return (
    <Modal visible={showCustomExercise} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Nuovo Esercizio</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nome */}
            <TextInput
              style={styles.input}
              placeholder="Nome esercizio *"
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

            {/* Descrizione (opzionale) */}
            <Text style={[styles.sectionLabel, { marginBottom: 6, marginTop: 14, fontWeight: '700', color: C.textDark }]}>
              Descrizione / Note esecuzione{' '}
              <Text style={{ fontWeight: '400', color: C.textMuted, fontSize: 12 }}>(opzionale)</Text>
            </Text>
            <Text style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, lineHeight: 17 }}>
              Aggiungi istruzioni, consigli di esecuzione o note personali. Saranno visibili toccando ℹ️ sull'esercizio.
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  minHeight: 90,
                  textAlignVertical: 'top',
                  paddingTop: 10,
                  fontSize: 13,
                },
              ]}
              placeholder="Es: Mantieni la schiena dritta, scendi lentamente, respira in modo controllato..."
              placeholderTextColor={C.textMuted}
              value={customExerciseDescription}
              onChangeText={setCustomExerciseDescription}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <View style={[styles.modalButtons, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={handleCancel}>
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
