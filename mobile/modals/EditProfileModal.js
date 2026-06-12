import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifica dati personali</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={C.textMuted}
            value={profileName}
            onChangeText={setProfileName}
          />

          <TextInput
            style={styles.input}
            placeholder="Età"
            placeholderTextColor={C.textMuted}
            value={profileAge}
            onChangeText={setProfileAge}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Altezza (cm)"
            placeholderTextColor={C.textMuted}
            value={profileHeight}
            onChangeText={setProfileHeight}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor={C.textMuted}
            value={profileWeight}
            onChangeText={setProfileWeight}
            keyboardType="decimal-pad"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.modalButtonFlex]}
              onPress={() => setShowEditProfileModal(false)}>
              <Text style={styles.secondaryButtonText}>Annulla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButtonFlex]}
              onPress={saveProfile}>
              <Text style={styles.primaryButtonText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
