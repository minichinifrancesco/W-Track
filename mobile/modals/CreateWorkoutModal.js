import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';

export default function CreateWorkoutModal({
  showCreateWorkout,
  setShowCreateWorkout,
  workoutName,
  setWorkoutName,
  createWorkout,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  return (
    <Modal visible={showCreateWorkout} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nuova Scheda</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome scheda"
            placeholderTextColor={C.textMuted}
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => {
                setShowCreateWorkout(false);
                setWorkoutName('');
              }}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={createWorkout}>
              <Text style={styles.primaryButtonText}>Crea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
