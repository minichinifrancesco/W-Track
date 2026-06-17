import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';

export default function RenameCustomExerciseModal({
  visible,
  exercise,
  onClose,
  onSave,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);
  const [name, setName] = useState('');

  useEffect(() => {
    if (visible) {
      setName(exercise?.name || '');
    }
  }, [exercise?.name, visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rinomina esercizio</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome esercizio"
              placeholderTextColor={C.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => onSave(name)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}>
                <Text style={styles.secondaryButtonText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  onSave(name);
                }}>
                <Text style={styles.primaryButtonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
