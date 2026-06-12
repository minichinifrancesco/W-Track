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

const keyboardAccessoryId = 'create-workout-keyboard-accessory';

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
