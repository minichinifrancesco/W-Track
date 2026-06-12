import React from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';

const keyboardAccessoryId = 'rest-time-keyboard-accessory';

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
            inputAccessoryViewID={keyboardAccessoryId}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

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
