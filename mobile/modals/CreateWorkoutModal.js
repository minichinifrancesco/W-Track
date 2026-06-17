import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuova Scheda</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome scheda"
              placeholderTextColor={C.textMuted}
              value={workoutName}
              onChangeText={setWorkoutName}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowCreateWorkout(false);
                  setWorkoutName('');
                }}>
                <Text style={styles.secondaryButtonText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  createWorkout();
                }}>
                <Text style={styles.primaryButtonText}>Crea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
