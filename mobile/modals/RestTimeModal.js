import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';

export default function RestTimeModal({
  showRestTimeModal,
  setShowRestTimeModal,
  tempRestTime,
  setTempRestTime,
  setEditingRestExerciseId,
  saveRestTime,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  return (
    <Modal visible={showRestTimeModal} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tempo di recupero</Text>

          <TextInput
            style={styles.input}
            placeholder="Secondi"
            placeholderTextColor={C.textMuted}
            value={tempRestTime}
            onChangeText={setTempRestTime}
            keyboardType="numeric"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => {
                setShowRestTimeModal(false);
                setEditingRestExerciseId(null);
                setTempRestTime('');
              }}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={saveRestTime}>
              <Text style={styles.primaryButtonText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
