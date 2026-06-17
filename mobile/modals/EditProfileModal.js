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

export default function EditProfileModal({
  showEditProfileModal,
  setShowEditProfileModal,
  profileName,
  setProfileName,
  profileAge,
  setProfileAge,
  profileHeight,
  setProfileHeight,
  profileWeight,
  setProfileWeight,
  saveProfile,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  return (
    <Modal visible={showEditProfileModal} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifica dati personali</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={C.textMuted}
              value={profileName}
              onChangeText={setProfileName}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <TextInput
              style={styles.input}
              placeholder="Età"
              placeholderTextColor={C.textMuted}
              value={profileAge}
              onChangeText={setProfileAge}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <TextInput
              style={styles.input}
              placeholder="Altezza (cm)"
              placeholderTextColor={C.textMuted}
              value={profileHeight}
              onChangeText={setProfileHeight}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              placeholderTextColor={C.textMuted}
              value={profileWeight}
              onChangeText={setProfileWeight}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowEditProfileModal(false);
                }}>
                <Text style={styles.secondaryButtonText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  saveProfile();
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
