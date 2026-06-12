import React, { useEffect, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getAvailableMuscleGroups } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';
import { useEffectiveDark } from '../context/SettingsContext';

const EXERCISE_TYPES = [
  { key: 'weight_reps', label: 'Peso + Rip.' },
  { key: 'reps',        label: 'Ripetizioni' },
  { key: 'timed',       label: 'A Tempo'     },
];
const keyboardAccessoryId = 'custom-exercise-keyboard-accessory';

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
  const [localName, setLocalName] = useState(customExerciseName || '');
  const [localMuscleGroup, setLocalMuscleGroup] = useState(customMuscleGroup || '');
  const [localType, setLocalType] = useState(customExerciseType || 'weight_reps');
  const [localDescription, setLocalDescription] = useState(customExerciseDescription || '');

  useEffect(() => {
    if (!showCustomExercise) return;
    setLocalName(customExerciseName || '');
    setLocalMuscleGroup(customMuscleGroup || '');
    setLocalType(customExerciseType || 'weight_reps');
    setLocalDescription(customExerciseDescription || '');
  }, [customExerciseDescription, customExerciseName, customExerciseType, customMuscleGroup, showCustomExercise]);

  const handleCancel = () => {
    Keyboard.dismiss();
    setShowCustomExercise(false);
    setCustomExerciseName('');
    setCustomMuscleGroup('');
    setCustomExerciseType('weight_reps');
    setCustomExerciseDescription && setCustomExerciseDescription('');
  };

  const handleCreate = () => {
    Keyboard.dismiss();
    createCustomExercise({
      name: localName,
      muscleGroup: localMuscleGroup,
      type: localType,
      description: localDescription,
    });
  };

  return (
    <Modal visible={showCustomExercise} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Nuovo Esercizio</Text>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled">
            {/* Nome */}
            <TextInput
              style={styles.input}
              placeholder="Nome esercizio *"
              placeholderTextColor={C.textMuted}
              value={localName}
              onChangeText={setLocalName}
              inputAccessoryViewID={keyboardAccessoryId}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            {/* Tipo esercizio */}
            <Text style={[styles.sectionLabel, { marginBottom: 8, fontWeight: '700', color: C.textDark }]}>
              Tipologia
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 14, gap: 6 }}>
              {EXERCISE_TYPES.map((t) => {
                const selected = (localType || 'weight_reps') === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setLocalType(t.key)}
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
                    localMuscleGroup === group && styles.groupChipSelected,
                  ]}
                  onPress={() => setLocalMuscleGroup(group)}>
                  <Text
                    style={
                      localMuscleGroup === group
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
              value={localDescription}
              onChangeText={setLocalDescription}
              inputAccessoryViewID={keyboardAccessoryId}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              multiline
              numberOfLines={4}
            />
          </ScrollView>
          </TouchableWithoutFeedback>

          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={keyboardAccessoryId}>
              <View
                style={{
                  alignItems: 'flex-end',
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  borderTopColor: isDarkMode ? '#334155' : '#cbd5e1',
                  borderTopWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                <TouchableOpacity onPress={Keyboard.dismiss}>
                  <Text style={{ color: '#86B749', fontSize: 16, fontWeight: '800' }}>
                    Fine
                  </Text>
                </TouchableOpacity>
              </View>
            </InputAccessoryView>
          )}

          <View style={[styles.modalButtons, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={handleCancel}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={handleCreate}>
              <Text style={styles.primaryButtonText}>Crea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
